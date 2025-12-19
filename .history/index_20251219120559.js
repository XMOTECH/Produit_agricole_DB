const express = require("express");
const oracledb = require("oracledb");
const cors = require("cors");

const app = express();
app.use(cors());

// ⚠️ Pas besoin d'initOracleClient en mode "thin" sous Linux/WSL
// Supprime ou commente cette ligne :
// oracledb.initOracleClient({ libDir: "C:\\oracle\\instantclient" });

async function getConnection() {
  return await oracledb.getConnection({
    user: "mamadou",             // ton utilisateur Oracle
    password: "pass2025",        // ton mot de passe Oracle
    connectString: "localhost:1521/XEPDB1" // ta base Oracle dans Docker
  });
}

// Exemple d’endpoint : récupérer les produits
app.get("/products", async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      "SELECT product_id, product_name, list_price FROM products"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur Oracle");
  } finally {
    if (conn) await conn.close();
  }
});

app.listen(3001, () => console.log("Backend running on http://localhost:3001"));
