const mysql = require('mysql2');

const host = 'localhost';
const database = 'saude';
const user = 'root';
const password = 'ifsp';

dbConn = mysql.createConnection({
    host: host,
    user: user,
    database: database,
    password: password
});

module.exports = dbConn;