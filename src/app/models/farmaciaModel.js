module.exports = {
    getMedicamentos: (callback) => {
        const sql = 'select * from saude';
        db.query(sql, callback);
    },
}
