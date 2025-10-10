const mysql = require('mysql2');

const host = 'localhost';
const database = 'saude';
const user = 'ifsp';
const password = 'ifsp';

module.exports = ()=>{
    return mysql.createConnection({
        host: host,
        user: user,
        password: password,
        database: database
    });
}