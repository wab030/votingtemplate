module.exports = {
    getProdutos: (dbConnection, callback) => {
        console.log('[Model que Lerá os Remédios]');
        const sql = 'SELECT * FROM medicamentos';
        dbConnection.query(sql, callback);
    },
    updateRemedioModel: (idMedicamento, updatedData, dbConnection, callback) => {
        const sql = 'UPDATE medicamentos SET quantidade = quantidade - 1 WHERE id = ?'
        dbConnection.query(sql, [idMedicamento], callback);
    },
    getEstoqueBaixo: (dbConnection, callback) => {
        const sql = 'SELECT * FROM medicamentos WHERE quantidade < 3';
        dbConnection.query(sql, callback);
    }
}