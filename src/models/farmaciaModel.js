module.exports = {
    getMedicamentos: (db, callback) => {
        const sql = 'select * from medicamentos';
        db.query(sql, callback);
    },
    getEstoqueBaixo: (db, callback) => {
         const sql = 'select * from medicamentos where quantidade < 3';
         db.query(sql, callback);
     },
     retirarMedicamento: (db,medicamento, callback) => {
        
        const update = 'update medicamentos set quantidade = quantidade - 1 where id = ?';
        db.query(update, [medicamento.medicamento_id], callback);

        const insert = 'INSERT INTO retiradas (email_municipe, medicamento_id, data_retirada) VALUES (?, ?, NOW())';
        db.query(insert, [medicamento.email_municipe,medicamento.medicamento_id], callback);
    },
}