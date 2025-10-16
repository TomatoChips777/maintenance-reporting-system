const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'mysql',
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "lc-maintenance-db",
    waitForConnections: true,  
    connectionLimit: 10,
    queueLimit: 0              
});

// Create a promise pool (returns promises for queries)
const db = pool.promise();

// Wrapper for async/await to use the pool for queries
db.queryAsync = (query, params) => {
    return db.query(query, params)
        .then(([results]) => results)  // Return just the results, not the full array
        .catch(err => {
            console.error("Database query failed:", err);
            throw err;
        });
};

module.exports = db;
