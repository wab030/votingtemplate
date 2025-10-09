const { connect } = require('../db');

async function getAll() {
    const pool = await connect();
    const [rows] = await pool.query('SELECT * FROM medicamentos ORDER BY id');
    return rows;
}

async function getLowStock() {
    const pool = await connect();
    const [rows] = await pool.query('SELECT * FROM medicamentos WHERE quantidade < 3 ORDER BY id');
    return rows;
}

async function getById(id) {
    const pool = await connect();
    const [rows] = await pool.query('SELECT * FROM medicamentos WHERE id = ?', [id]);
    return rows[0];
}

async function decrementQuantity(id) {
    const pool = await connect();
    const [result] = await pool.query('UPDATE medicamentos SET quantidade = quantidade - 1 WHERE id = ? AND quantidade > 0', [id]);
    return result.affectedRows > 0;
}

async function recordRetirada(medicamento_id, email_municipe) {
    const pool = await connect();
    const [result] = await pool.query('INSERT INTO retiradas (email_municipe, medicamento_id) VALUES (?, ?)', [email_municipe, medicamento_id]);
    return result.insertId;
}

async function hasRetirada(medicamento_id, email_municipe) {
    const pool = await connect();
    const [rows] = await pool.query('SELECT id FROM retiradas WHERE medicamento_id = ? AND email_municipe = ?', [medicamento_id, email_municipe]);
    return rows.length > 0;
}

async function performRetirada(medicamento_id, email_municipe) {
    const pool = await connect();
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        const [alreadyRows] = await conn.query('SELECT id FROM retiradas WHERE medicamento_id = ? AND email_municipe = ? FOR UPDATE', [medicamento_id, email_municipe]);
        if (alreadyRows.length > 0) {
            await conn.rollback();
            return { status: 'already' };
        }

        const [medRows] = await conn.query('SELECT quantidade, nome_medicamento FROM medicamentos WHERE id = ? FOR UPDATE', [medicamento_id]);
        if (medRows.length === 0) {
            await conn.rollback();
            return { status: 'notfound' };
        }

        const medicamento = medRows[0];
        if (medicamento.quantidade <= 0) {
            await conn.rollback();
            return { status: 'nostock', nome: medicamento.nome_medicamento };
        }

        await conn.query('UPDATE medicamentos SET quantidade = quantidade - 1 WHERE id = ?', [medicamento_id]);
        await conn.query('INSERT INTO retiradas (email_municipe, medicamento_id) VALUES (?, ?)', [email_municipe, medicamento_id]);

        await conn.commit();

        return { status: 'ok', estoqueAtual: medicamento.quantidade - 1, nome: medicamento.nome_medicamento };
    } catch (err) {
        try { await conn.rollback(); } catch (e) { /* ignore */ }
        throw err;
    } finally {
        conn.release();
    }
}

module.exports = { getAll, getLowStock, getById, decrementQuantity, recordRetirada, hasRetirada, performRetirada };
