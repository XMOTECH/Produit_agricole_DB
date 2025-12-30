const { executeQueries } = require('./scripts/runner');
const VIEW_QUERIES = require('./database/views');
const PLSQL_QUERIES = require('./database/plsql');

async function runSafeUpdate() {
    console.log("=== MISE À JOUR SÉCURISÉE (SANS PERTE DE DONNÉES) ===");
    // On met à jour uniquement la logique (Vues et Triggers)
    await executeQueries(VIEW_QUERIES, "Mise à jour des VUES");
    await executeQueries(PLSQL_QUERIES, "Mise à jour PL/SQL (Triggers/Fonctions)");
    console.log("=== Succès : Logique Applicative mise à jour ===");
}

runSafeUpdate();
