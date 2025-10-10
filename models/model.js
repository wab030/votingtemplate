module.exports = {
    model: (db, callback) => {
        console.log('Funfou');
        const sql = 'select * from medicamentos';
        db.query(sql, callback);
    }
}