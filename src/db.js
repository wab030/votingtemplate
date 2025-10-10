
const mysql = require('mysql2');

const host = 'localhost';
const database = 'saude';
const user = 'root';
const password = 'ifsp';

module.exports = () => {
    return connect = mysql.createConnection({
        host: host,
        user: user,
        password: password,
        database: database
    });
}