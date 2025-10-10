module.exports = {
    getMedicamentos: (db, callback) => {
         console.log('[Model] Função que fará a leitura de trodas os medicamentos no banco de dados');
         const sql = 'select * from medicamentos;';
         db.query(sql, callback)
    },

    updateMedica: (conn, id, medicamento, callback) =>{
        const sql = 'UPDATE medicamentos SET quantidade=quantidade-1 WHERE id = ? ;';
        console.log('Home model updateMedicamento');
        conn.query(sql, [id], callback);
    }
}