// utils/database.js
const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'admin', // SEU USUÁRIO
    password: 'ifsp@1234', // SUA SENHA
    database: 'saude'
};

let pool;

async function connect() {
    try {
        if (!pool) {
            pool = mysql.createPool(dbConfig);
            console.log('Conectado ao banco de dados MySQL: saude.');
        }
        return pool;
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        throw new Error('Falha na conexão com o banco de dados.');
    }
}

module.exports = { connect };