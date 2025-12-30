const { getConnection } = require('../db');

async function executeQueries(queryList, label) {
    let connection;
    try {
        console.log(`\n--- Démarrage: ${label} ---`);
        connection = await getConnection();

        for (const query of queryList) {
            try {
                await connection.execute(query.sql);
                console.log(`[OK] ${query.name}`);
            } catch (err) {
                // Ignore errors for DROP queries if table doesn't exist
                if (query.name.startsWith("Drop") && err.message.includes("ORA-00942")) {
                    console.log(`[INFO] ${query.name} (Inexistante)`);
                } else {
                    console.error(`[ERREUR] ${query.name}:`, err.message);
                }
            }
        }
        console.log(`--- Terminé: ${label} ---\n`);
    } catch (err) {
        console.error("Erreur Connexion:", err);
    } finally {
        if (connection) {
            try { await connection.close(); } catch (e) { console.error(e); }
        }
    }
}

module.exports = { executeQueries };
