const Joi = require('joi')


const retiradaSchema = Joi.object({

    id: Joi.number().integer().min(1).required(),
    email: Joi.string().email().required()

})



module.exports = {


    schemas: {

        retirada: retiradaSchema,

    },

    getMedicamentos: (db, callback) => {

        const sql = 'SELECT * FROM medicamentos';

        db.query(sql, callback);

    },
    getEstoqueBaixo: (db, callback) => {

        const sql = 'SELECT * FROM medicamentos WHERE quantidade < 3';

        db.query(sql, callback);

    },

    retirarMedicamento: (db, dados, callback) => {

        const sql = 'INSERT INTO retiradas (id , email_municipe) VALUES(?,?)';
        const valores = [dados.id, dados.email_municipe]
        db.query(sql, valores, callback);

    }



}