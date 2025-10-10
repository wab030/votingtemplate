const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'admin',
    password: 'ifsp@1234',
    database: 'saude'
});
module.exports.connect = async () => pool;

