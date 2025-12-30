const { executeQueries } = require('./scripts/runner');
const TABLES_QUERIES = require('./database/tables');
const VIEW_QUERIES = require('./database/views');
const PLSQL_QUERIES = require('./database/plsql');

async function runFullSetup() {
    console.log("!!! ATTENTION : RÉINITIALISATION COMPLÈTE (DONNÉES PERDUES) !!!");

    // 1. Tables (Supprime et recrée la structure de données)
    await executeQueries(TABLES_QUERIES, "Réinitialisation des TABLES");

    // 2. Vues
    await executeQueries(VIEW_QUERIES, "Installation des VUES");

    // 3. PL/SQL
    await executeQueries(PLSQL_QUERIES, "Installation PL/SQL");

    console.log("=== Succès : Base de données entièrement réinstallée ===");
}

runFullSetup();