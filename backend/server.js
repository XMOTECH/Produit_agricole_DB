const express = require('express');
const cors = require('cors');
const oracledb = require('oracledb');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const { getConnection } = require('./db');

const upload = multer({ dest: 'uploads/' });

const app = express();
const PORT = 3000;

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());

// --- CONFIGURATION ORACLE ---
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true;

// --- FONCTION UTILITAIRE SQL ---
async function executeSQL(sql, params = [], res) {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(sql, params);
    return result;
  } catch (err) {
    console.error("Erreur SQL:", err.message);
    if (res) {
      if (err.message.includes('ORA-20001')) {
        res.status(400).json({ success: false, error: "STOCK INSUFFISANT : Impossible de réaliser cette vente." });
      } else if (err.message.includes('ORA-20002')) {
        res.status(400).json({ success: false, error: "ERREUR SAISIE : La perte dépasse le stock disponible." });
      } else {
        res.status(500).json({ success: false, error: "Erreur serveur interne : " + err.message });
      }
    }
    return null;
  } finally {
    if (connection) {
      try { await connection.close(); } catch (e) { }
    }
  }
}

// ==================================================================
// 1. RÉFÉRENTIELS & CATALOGUE
// ==================================================================

app.get('/api/produits', async (req, res) => {
  const result = await executeSQL('SELECT * FROM PRODUIT ORDER BY nom_produit', [], res);
  if (result) res.json(result.rows);
});

app.get('/api/varietes', async (req, res) => {
  const sql = `
        SELECT v.id_variete, v.nom_variete, v.stock_actuel_kg, p.nom_produit 
        FROM VARIETE v
        JOIN PRODUIT p ON v.id_produit = p.id_produit
        ORDER BY v.nom_variete
    `;
  const result = await executeSQL(sql, [], res);
  if (result) res.json(result.rows);
});

app.post('/api/produits', async (req, res) => {
  const { nom_produit } = req.body;
  if (!nom_produit) return res.status(400).json({ error: "Nom requis" });
  const sql = `INSERT INTO PRODUIT (nom_produit) VALUES (:nom) RETURNING id_produit INTO :id`;
  const result = await executeSQL(sql, {
    nom: nom_produit,
    id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
  }, res);
  if (result) res.json({ success: true, message: "Produit créé.", id: result.outBinds.id[0] });
});

app.post('/api/varietes', async (req, res) => {
  const { nom_variete, description, id_produit } = req.body;
  if (!nom_variete || !id_produit) return res.status(400).json({ error: "Données manquantes" });
  const sql = `INSERT INTO VARIETE (nom_variete, description, id_produit) VALUES (:1, :2, :3)`;
  const result = await executeSQL(sql, [nom_variete, description || '', id_produit], res);
  if (result) res.json({ success: true, message: "Variété ajoutée." });
});

// ==================================================================
// 2. OPÉRATIONS (RECOLTE, VENTE, PERTE)
// ==================================================================

app.post('/api/recoltes', async (req, res) => {
  const { id_variete, qte_kg } = req.body;
  const result = await executeSQL(`INSERT INTO RECOLTE (id_variete, qte_kg) VALUES (:1, :2)`, [id_variete, qte_kg], res);
  if (result) res.json({ success: true, message: "Récolte enregistrée." });
});

app.post('/api/ventes', async (req, res) => {
  const { id_variete, qte_kg, prix_unitaire } = req.body;
  const result = await executeSQL(`INSERT INTO VENTE (id_variete, qte_kg, prix_unitaire) VALUES (:1, :2, :3)`, [id_variete, qte_kg, prix_unitaire], res);
  if (result) res.json({ success: true, message: "Vente validée." });
});

app.post('/api/pertes', async (req, res) => {
  const { id_variete, qte_kg, motif } = req.body;
  const result = await executeSQL(`INSERT INTO PERTE (id_variete, qte_kg, motif) VALUES (:1, :2, :3)`, [id_variete, qte_kg, motif], res);
  if (result) res.json({ success: true, message: "Perte enregistrée." });
});

app.get('/api/historique/ventes', async (req, res) => {
  const sql = `
        SELECT v.id_vente, p.nom_produit, var.nom_variete, v.qte_kg, v.prix_unitaire, 
               (v.qte_kg * v.prix_unitaire) as total_vente,
               TO_CHAR(v.date_vente, 'DD/MM/YYYY HH24:MI') as date_fmt
        FROM VENTE v
        JOIN VARIETE var ON v.id_variete = var.id_variete
        JOIN PRODUIT p ON var.id_produit = p.id_produit
        ORDER BY v.date_vente DESC
    `;
  const result = await executeSQL(sql, [], res);
  if (result) res.json(result.rows);
});

app.get('/api/historique/recoltes', async (req, res) => {
  const sql = `
        SELECT r.id_recolte, p.nom_produit, var.nom_variete, r.qte_kg,
               TO_CHAR(r.date_rec, 'DD/MM/YYYY HH24:MI') as date_fmt
        FROM RECOLTE r
        JOIN VARIETE var ON r.id_variete = var.id_variete
        JOIN PRODUIT p ON var.id_produit = p.id_produit
        ORDER BY r.date_rec DESC
    `;
  const result = await executeSQL(sql, [], res);
  if (result) res.json(result.rows);
});

// ==================================================================
// 3. IMPORT CSV
// ==================================================================

app.post('/api/import/varietes', upload.single('file'), async (req, res) => {
  console.log("Requête Import CSV reçue...");
  if (!req.file) return res.status(400).json({ error: "Aucun fichier fourni" });

  const results = [];
  const errors = [];
  let connection;

  try {
    connection = await getConnection();
    // Lecture du CSV - On laisse csv-parser détecter les headers automatiquement
    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .pipe(csv({
          mapHeaders: ({ header }) => header.trim().toUpperCase().replace(/ /g, '_')
        }))
        .on('data', (data) => results.push(data))
        .on('end', resolve)
        .on('error', reject);
    });
    fs.unlinkSync(req.file.path);

    console.log(`Lignes lues: ${results.length}`);
    let successCount = 0;

    for (const row of results) {
      // Les headers sont maintenant uniformisés en majuscules (ex: NOM_PRODUIT)
      const nomP = row.NOM_PRODUIT || row.PRODUIT;
      const nomV = row.NOM_VARIETE || row.VARIETE;
      const desc = row.DESCRIPTION || '';
      const stock = parseFloat(row.STOCK_INITIAL_KG || row.STOCK || 0);

      if (!nomP || !nomV) continue;

      try {
        let prodResult = await connection.execute(`SELECT id_produit FROM PRODUIT WHERE UPPER(nom_produit) = UPPER(:1)`, [nomP.trim()]);
        let productId;
        if (prodResult.rows.length === 0) {
          const insertProd = await connection.execute(`INSERT INTO PRODUIT (nom_produit) VALUES (:nom) RETURNING id_produit INTO :id`, { nom: nomP.trim(), id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER } });
          productId = insertProd.outBinds.id[0];
        } else {
          productId = prodResult.rows[0].ID_PRODUIT;
        }
        await connection.execute(`INSERT INTO VARIETE (nom_variete, description, id_produit, stock_actuel_kg) VALUES (:1, :2, :3, :4)`, [nomV.trim(), desc.trim(), productId, stock]);
        successCount++;
      } catch (err) {
        errors.push({ row, error: err.message });
        console.error("Erreur ligne CSV:", err.message);
      }
    }
    await connection.commit();
    console.log(`Import terminé: ${successCount} succès`);
    res.json({ success: true, message: `${successCount} variétés importées.`, errors: errors.length > 0 ? errors : null });
  } catch (err) {
    console.error("Erreur Fatale Import:", err);
    res.status(500).json({ error: "Erreur traitement CSV : " + err.message });
  } finally {
    if (connection) try { await connection.close(); } catch (e) { }
  }
});

// ==================================================================
// 4. DASHBOARD & ANALYTIQUES
// ==================================================================

app.get('/api/dashboard/stats-globales', async (req, res) => {
  const { period } = req.query;
  let dfR = "", dfV = "", dfP = "";
  const params = {};
  if (period) {
    let days = period === 'quarter' ? 90 : (period === 'year' ? 365 : 30);
    dfR = ` WHERE date_rec >= TRUNC(SYSDATE) - :d`;
    dfV = ` WHERE date_vente >= TRUNC(SYSDATE) - :d`;
    dfP = ` WHERE date_perte >= TRUNC(SYSDATE) - :d`;
    params.d = days;
  }
  const sql = `
    SELECT 
      (SELECT NVL(SUM(qte_kg),0) FROM RECOLTE ${dfR}) as total_recolte,
      (SELECT NVL(SUM(qte_kg * prix_unitaire),0) FROM VENTE ${dfV}) as total_vente_fcfa,
      (SELECT NVL(SUM(qte_kg),0) FROM PERTE ${dfP}) as total_perte_kg,
      ROUND(CASE WHEN (SELECT NVL(SUM(qte_kg),0) FROM RECOLTE ${dfR}) > 0 
           THEN ((SELECT NVL(SUM(qte_kg),0) FROM VENTE ${dfV}) / (SELECT NVL(SUM(qte_kg),0) FROM RECOLTE ${dfR})) * 100 
           ELSE 0 END, 2) as taux_ecoulement,
      (SELECT NVL(SUM(v.stock_actuel_kg * (SELECT NVL(AVG(s.prix_unitaire), 0) FROM VENTE s WHERE s.id_variete = v.id_variete)), 0) FROM VARIETE v) as valeur_stock_estimee
    FROM DUAL
  `;
  const result = await executeSQL(sql, params, res);
  if (result) res.json(result.rows[0]);
});

app.get('/api/dashboard/activite', async (req, res) => {
  const { period } = req.query;
  let sql = `SELECT * FROM V_ACTIVITE_JOUR`, params = [];
  if (period) {
    let days = period === 'quarter' ? 90 : (period === 'year' ? 365 : 30);
    sql += ` WHERE JOUR >= TRUNC(SYSDATE) - :d`;
    params.push(days);
  }
  sql += ` ORDER BY JOUR ASC`;
  const result = await executeSQL(sql, params, res);
  if (result) res.json(result.rows);
});

app.get('/api/dashboard/evolution', async (req, res) => {
  const { period } = req.query;
  let sql = `SELECT * FROM EVOLUTION_VENTES`, params = [];
  if (period) {
    let days = period === 'quarter' ? 90 : (period === 'year' ? 365 : 30);
    sql += ` WHERE JOUR >= TRUNC(SYSDATE) - :d`;
    params.push(days);
  }
  sql += ` ORDER BY JOUR ASC`;
  const result = await executeSQL(sql, params, res);
  if (result) res.json(result.rows);
});

app.get('/api/dashboard/repartition-produit', async (req, res) => {
  const { period } = req.query;
  let where = "", params = {};
  if (period) {
    where = ` WHERE v.date_vente >= TRUNC(SYSDATE) - :d`;
    params.d = period === 'quarter' ? 90 : (period === 'year' ? 365 : 30);
  }
  const sql = `
    SELECT p.nom_produit, SUM(v.qte_kg * v.prix_unitaire) as value
    FROM VENTE v
    JOIN VARIETE var ON v.id_variete = var.id_variete
    JOIN PRODUIT p ON var.id_produit = p.id_produit
    ${where}
    GROUP BY p.nom_produit
  `;
  const result = await executeSQL(sql, params, res);
  if (result) res.json(result.rows);
});

app.get('/api/dashboard/top-varietes', async (req, res) => {
  const { period } = req.query;
  let where = "", params = {};
  if (period) {
    where = ` WHERE s.date_vente >= TRUNC(SYSDATE) - :d`;
    params.d = period === 'quarter' ? 90 : (period === 'year' ? 365 : 30);
  }
  const sql = `
    SELECT v.nom_variete, NVL(SUM(s.qte_kg * s.prix_unitaire), 0) as total_ca
    FROM VARIETE v
    LEFT JOIN VENTE s ON v.id_variete = s.id_variete
    ${where}
    GROUP BY v.nom_variete
    ORDER BY total_ca DESC 
    FETCH FIRST 5 ROWS ONLY
  `;
  const result = await executeSQL(sql, params, res);
  if (result) res.json(result.rows);
});

app.get('/api/dashboard/rendement', async (req, res) => {
  const { search, period } = req.query;
  const params = {};
  if (period) params.d = period === 'quarter' ? 90 : (period === 'year' ? 365 : 30);
  const dr = period ? ` AND date_rec >= TRUNC(SYSDATE) - :d` : "";
  const dv = period ? ` AND date_vente >= TRUNC(SYSDATE) - :d` : "";
  const dp = period ? ` AND date_perte >= TRUNC(SYSDATE) - :d` : "";

  let sql = `
    SELECT 
      v.id_variete, v.nom_variete, p.nom_produit,
      (SELECT NVL(SUM(qte_kg), 0) FROM RECOLTE WHERE id_variete = v.id_variete ${dr}) as qte_recoltee,
      (SELECT NVL(SUM(qte_kg), 0) FROM VENTE WHERE id_variete = v.id_variete ${dv}) as qte_vendue,
      (SELECT NVL(SUM(qte_kg), 0) FROM PERTE WHERE id_variete = v.id_variete ${dp}) as qte_perdue,
      v.stock_actuel_kg,
      (SELECT NVL(SUM(qte_kg * prix_unitaire), 0) FROM VENTE WHERE id_variete = v.id_variete ${dv}) as ca_total
    FROM VARIETE v
    JOIN PRODUIT p ON v.id_produit = p.id_produit
  `;
  if (search) {
    sql += ` WHERE UPPER(v.nom_variete) LIKE UPPER(:s) OR UPPER(p.nom_produit) LIKE UPPER(:s)`;
    params.s = `%${search}%`;
  }
  sql += ' ORDER BY ca_total DESC';
  const result = await executeSQL(sql, params, res);
  if (result) res.json(result.rows);
});

app.get('/api/dashboard/alertes', async (req, res) => {
  const result = await executeSQL('SELECT * FROM ALERTE_STOCK', [], res);
  if (result) res.json(result.rows);
});

app.get('/api/dashboard/predictions', async (req, res) => {
  const result = await executeSQL(`SELECT * FROM V_ML_STOCK_PREDICT WHERE niveau_urgence != 'NORMAL' ORDER BY jours_restants ASC`);
  if (result) res.json(result.rows);
});

app.listen(PORT, () => {
  console.log(`Serveur prêt sur http://localhost:${PORT}`);
});