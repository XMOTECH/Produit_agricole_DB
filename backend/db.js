const oracledb = require("oracledb");

async function getConnection() {
    return await oracledb.getConnection({
        user: "mamadou",
        password: "pass2025",
        connectString: "localhost:1521/XEPDB1"
    });
}

module.exports = { getConnection }
