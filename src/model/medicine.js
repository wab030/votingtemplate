const Joi = require('joi');
const {getMedicine} =  require('./home');
const schema = Joi.object({
    email: Joi.string().min(5).max(100).required(),
    id: Joi.number().integer().required(),
});

module.exports = {
    validateMedicineRequest: (medicine, res) => {
        let {error} = schema.validate(medicine);

        if(error){
            let mensagem = `Dados inválidos: ${medicine.email_municipe} deve ser um e-mail válido`;
            return res.status(400).redirect(`/?mensagem=${encodeURIComponent(mensagem)}`);
        }
    },
    retireMedicine: (db, medicine, callback) => {  
        getMedicine(db,medicine,(error, result)=>{
            let queryVerifica = `SELECT * FROM retiradas WHERE 
            email_municipe = ${medicine.email_municipe} AND medicamento_id= ${medicine.medicamento_id}`;

            let queryRetirada = `INSERT INTO retiradas (email_municipe, medicamento_id) 
            VALUES ("${medicine.email_municipe}", "${medicine.medicamento_id}")`;
            
            db.query(queryRetirada);
            let medicineData = result[0];

            let quantidadeApos = medicineData.quantidade - 1;
    
            let queryUpdate = `UPDATE medicamentos SET quantidade=${quantidadeApos} WHERE id=${medicine.medicamento_id}`;
    
            db.query(queryUpdate,callback);
        });
    },
    lowStock: (db, callback) => {
        let query = `SELECT * FROM medicamentos WHERE quantidade < 3`;
        db.query(query, callback);
    }
};