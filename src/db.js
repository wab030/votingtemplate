const mysql = require('mysql2');


const dbConn = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'ifsp',
    database: 'saude',
    waitForConnections: true,
    connectionLimit: 10, 
    queueLimit: 0
});

module.exports = dbConn;    