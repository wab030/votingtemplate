// models/medicamentoModel.js
const { connect } = require('../db');

const MedicamentoModel = {
    /**
     * Busca todos os medicamentos ou filtra por estoque baixo (< 3).
     */
    findAll: async (estoqueBaixo = false) => {
        const pool = await connect();
        let sql = 'SELECT id, nome_medicamento, quantidade FROM medicamentos';
        
        if (estoqueBaixo) {
            sql += ' WHERE quantidade < 3 ORDER BY quantidade ASC';
        } else {
            sql += ' ORDER BY nome_medicamento ASC';
        }

        const [rows] = await pool.query(sql);
        return rows;
    },

    /**
     * Busca um medicamento por ID.
     */
    findById: async (id) => {
        const pool = await connect();
        const [rows] = await pool.query(
            'SELECT nome_medicamento, quantidade FROM medicamentos WHERE id = ?', 
            [id]
        );
        return rows[0];
    },

    /**
     * Verifica se o munícipe já retirou o medicamento.
     */
    checkRetiradaDuplicada: async (medicamentoId, email) => {
        const pool = await connect();
        const [rows] = await pool.query(
            'SELECT id FROM retiradas WHERE medicamento_id = ? AND email_municipe = ?',
            [medicamentoId, email]
        );
        return rows.length > 0;
    },

    /**
     * Realiza a retirada transacional: subtrai estoque e registra retirada.
     */
     processarRetirada: async (medicamentoId, email) => {
        const pool = await connect();
        let connection; // Declare 'connection' aqui, fora do try
        
        try {
            connection = await pool.getConnection(); // <-- PONTO CRÍTICO 1
            await connection.beginTransaction();
            // 1. Atualiza o estoque
            // É essencial garantir que o WHERE está correto para o medicamento_id
            await connection.query(
                'UPDATE medicamentos SET quantidade = quantidade - 1 WHERE id = ?',
                [medicamentoId]
            );
            // 2. Registra a retirada
            await connection.query(
                'INSERT INTO retiradas (medicamento_id, email_municipe) VALUES (?, ?)',
                [medicamentoId, email]
            );

            await connection.commit();
            
        } catch (error) {
            if (connection) {
                await connection.rollback();
            }
            throw error; // Propaga o erro (que o Controller pega e transforma em 500)
        } finally {
            // Garante que a conexão SEMPRE será liberada, mesmo que ocorra um erro!
            if (connection) {
                connection.release(); // <-- PONTO CRÍTICO 2
            }
        }
    }
};

module.exports = MedicamentoModel;