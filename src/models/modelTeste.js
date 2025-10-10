module.exports = {
    estoquebaixo: (db, callback) => {
        console.log('Funfou');
        const sql = 'select * from medicamentos where quantidade < 3';
        console.log('saida sql ')
        console.log(sql)
        db.query(sql, callback);
    }
}