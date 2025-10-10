module.exports = {
    home: (db, callback) => {
        let query = "SELECT * FROM medicamentos";
        db.query(query,callback);
    },
    getMedicine: (db, medicine, callback) => {
        let query = `SELECT * FROM medicamentos WHERE id=${medicine.medicamento_id}`;
        
        db.query(query,callback);
    },
};