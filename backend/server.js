const express = require('express');
const cors = require('cors');
const oracledb = require('oracledb');
const { getConnection } = require('./db');

const app = express();
const PORT = 3000;

// --- MIDDLEWARES ---
app.use(cors()); // Autorise le Frontend React
app.use(express.json()); // Permet de lire le JSON dans le body des requêtes

// --- CONFIGURATION ORACLE ---
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT; // Retourne { "ID": 1 } au lieu de [1]
oracledb.autoCommit = true; // Valide automatiquement les transactions

// --- FONCTION UTILITAIRE (CLEAN CODE) ---
// Cette fonction gère l'ouverture et la fermeture de connexion pour éviter la répétition
async function executeSQL(sql, params = [], res) {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(sql, params);
    return result;
  } catch (err) {
    console.error("Erreur SQL:", err.message);
    // Gestion spécifique des erreurs métier (Triggers)
    if (err.message.includes('ORA-20001')) {
      res.status(400).json({ success: false, error: "STOCK INSUFFISANT : Impossible de réaliser cette vente." });
    } else if (err.message.includes('ORA-20002')) {
      res.status(400).json({ success: false, error: "ERREUR SAISIE : La perte dépasse le stock disponible." });
    } else {
      res.status(500).json({ success: false, error: "Erreur serveur interne." });
    }
    return null; // Signale qu'il y a eu une erreur
  } finally {
    if (connection) {
      try { await connection.close(); } catch (e) { console.error(e); }
    }
  }
}

// ==================================================================
// 1. ENDPOINTS RÉFÉRENTIELS (POUR LES LISTES DÉROULANTES)
// ==================================================================

// GET /api/produits
app.get('/api/produits', async (req, res) => {
  const result = await executeSQL('SELECT * FROM PRODUIT ORDER BY nom_produit', [], res);
  if (result) res.json(result.rows);
});

// GET /api/varietes (Inclut le nom du produit et le stock actuel)
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

// ==================================================================
// 2. ENDPOINTS TRANSACTIONNELS (SAISIE FORMULAIRES)
// ==================================================================

// POST /api/recoltes
app.post('/api/recoltes', async (req, res) => {
  const { id_variete, qte_kg } = req.body;

  // Validation basique
  if (!id_variete || !qte_kg) return res.status(400).json({ error: "Données manquantes" });

  const sql = `INSERT INTO RECOLTE (id_variete, qte_kg) VALUES (:id, :qte)`;
  const result = await executeSQL(sql, [id_variete, qte_kg], res);

  if (result) {
    res.json({ success: true, message: "Récolte enregistrée et stock mis à jour." });
  }
});

// POST /api/ventes
app.post('/api/ventes', async (req, res) => {
  const { id_variete, qte_kg, prix_unitaire } = req.body;

  if (!id_variete || !qte_kg || !prix_unitaire) return res.status(400).json({ error: "Données manquantes" });

  const sql = `INSERT INTO VENTE (id_variete, qte_kg, prix_unitaire) VALUES (:id, :qte, :prix)`;
  // Si le stock est insuffisant, executeSQL attrapera l'erreur ORA-20001
  const result = await executeSQL(sql, [id_variete, qte_kg, prix_unitaire], res);

  if (result) {
    res.json({ success: true, message: "Vente validée." });
  }
});

// POST /api/pertes
app.post('/api/pertes', async (req, res) => {
  const { id_variete, qte_kg, motif } = req.body;

  if (!id_variete || !qte_kg) return res.status(400).json({ error: "Données manquantes" });

  const sql = `INSERT INTO PERTE (id_variete, qte_kg, motif) VALUES (:id, :qte, :motif)`;
  // Si la perte > stock, executeSQL attrapera l'erreur ORA-20002
  const result = await executeSQL(sql, [id_variete, qte_kg, motif], res);

  if (result) {
    res.json({ success: true, message: "Perte enregistrée." });
  }
});

// POST /api/produits (Créer une nouvelle catégorie)
app.post('/api/produits', async (req, res) => {
  const { nom_produit } = req.body;
  if (!nom_produit) return res.status(400).json({ error: "Nom du produit requis" });

  // On utilise INSERT ... RETURNING pour récupérer l'ID créé tout de suite
  const sql = `INSERT INTO PRODUIT (nom_produit) VALUES (:nom) RETURNING id_produit INTO :id`;

  const result = await executeSQL(sql, {
    nom: nom_produit,
    id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
  }, res);

  if (result) {
    res.json({ success: true, message: "Produit créé avec succès.", id: result.outBinds.id[0] });
  }
});

// POST /api/varietes (Créer une nouvelle variété liée à un produit)
app.post('/api/varietes', async (req, res) => {
  const { nom_variete, description, id_produit } = req.body;
  if (!nom_variete || !id_produit) return res.status(400).json({ error: "Données manquantes" });

  const sql = `INSERT INTO VARIETE (nom_variete, description, id_produit) VALUES (:nom_variete, :description, :id_produit)`;

  const result = await executeSQL(sql, [nom_variete, description || '', id_produit], res);

  if (result) {
    res.json({ success: true, message: "Nouvelle variété ajoutée au catalogue." });
  }
});

// ==================================================================
// 3. ENDPOINTS DASHBOARD (LECTURE DES VUES)
// ==================================================================
// 1. Endpoint for the Donut Chart (Revenue by Product)
app.get('/api/dashboard/repartition-produit', async (req, res) => {
  const result = await executeSQL('SELECT * FROM REPARTITION_CA_PRODUIT', [], res);
  if (result) res.json(result.rows);
});

// 2. Endpoint for the Top 5 Varieties (Bar Chart)
// We limit to 5 rows to keep the chart clean

// Endpoint pour le graphique combiné (Activite)
app.get('/api/dashboard/activite', async (req, res) => {
  try {
    const result = await executeSQL(`SELECT * FROM V_ACTIVITE_JOUR`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/dashboard/top-varietes', async (req, res) => {
  const sql = `SELECT * FROM KPI_REVENUS ORDER BY total_ca DESC FETCH FIRST 5 ROWS ONLY`;
  const result = await executeSQL(sql, [], res);
  if (result) res.json(result.rows);
});

// KPI Revenus (Graphique Barres)
app.get('/api/dashboard/revenus', async (req, res) => {
  const result = await executeSQL('SELECT * FROM KPI_REVENUS ORDER BY total_ca DESC', [], res);
  if (result) res.json(result.rows);
});

// KPI Global (Cartes en haut)
app.get('/api/dashboard/stats-globales', async (req, res) => {
  const result = await executeSQL('SELECT * FROM GLOBAL_STATS', [], res);
  // On renvoie le premier élément car c'est une vue à ligne unique
  if (result) res.json(result.rows[0]);
});

// KPI Alertes Stock (Tableau)
app.get('/api/dashboard/alertes', async (req, res) => {
  const result = await executeSQL('SELECT * FROM ALERTE_STOCK', [], res);
  if (result) res.json(result.rows);
});

/// Tableau de Bord Détaillé (Rendement) avec RECHERCHE
app.get('/api/dashboard/rendement', async (req, res) => {
  const { search } = req.query; // Récupère ?search=tomate

  let sql = 'SELECT * FROM RENDEMENT_DETAIL';
  const params = [];

  // Injection SQL sécurisée pour le filtre
  if (search) {
    sql += ` WHERE UPPER(nom_variete) LIKE UPPER(:searchQuery) OR UPPER(nom_produit) LIKE UPPER(:searchQuery)`;
    params.push(`%${search}%`);
  }

  sql += ' ORDER BY ca_total DESC';

  const result = await executeSQL(sql, params, res);
  if (result) res.json(result.rows);
});

// Graphique d'évolution des ventes (Pour les courbes)
app.get('/api/dashboard/evolution', async (req, res) => {
  // On récupère les 30 derniers jours par exemple (ou tout l'historique selon la vue)
  const sql = `SELECT * FROM EVOLUTION_VENTES`;
  const result = await executeSQL(sql, [], res);
  if (result) res.json(result.rows);
});

// ... (Vos imports et config restent inchangés)

// ==================================================================
// AJOUT : HISTORIQUES (Pour la page "Opérations")
// ==================================================================

// Historique des Ventes (avec noms produits)
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

// Historique des Récoltes
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


// ... (Le reste du code reste inchangé)

// --- DÉMARRAGE ---
app.listen(PORT, () => {
  console.log(`
    SERVEUR AGRI-GES DÉMARRÉ !
    -----------------------------------
    Port: ${PORT}
    URL:  http://localhost:${PORT}
    -----------------------------------
    `);
});