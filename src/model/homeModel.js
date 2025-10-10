module.exports = {
    getProdutos: (dbConnection, callback) => {
        console.log('[Model Home]');
        const sql = 'SELECT * FROM saude.medicamentos';
        dbConnection.query(sql, callback);
    },

    updateProduto: (dbConnection, idMedicamento, quantidade, callback) => {
        console.log('[Model Retirada]');
        const sql = 'UPDATE saude.medicamentos SET quantidade = quantidade - 1 WHERE idMedicamento = ?';
        const params = [quantidade, idMedicamento];
        dbConnection.query(sql, params, callback);
    },

    getEstoqueBaixo: (dbConnection, callback) => {
        console.log('[Model Estoque Baixo]');
        const sql = 'SELECT * FROM saude.medicamentos WHERE quantidade < 3';
        dbConnection.query(sql, callback);
    }
};

