module.exports = {
    getMedicamentos: (db, callback) => {
        const sql = 'select * from medicamentos';
        db.query(sql, callback);
    },
    getEstoqueBaixo: (db, callback) => {
         const sql = 'select * from medicamentos where quantidade < 3';
         db.query(sql, callback);
     },
}