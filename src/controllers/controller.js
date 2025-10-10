const db = require('../db');
const { model } = require('../models/model');

module.exports.farmacia = (app, req, res) => {
    try {
        model(db(), (error, result) => {
                console.log(error);
                console.log(result);
                res.render('farmacia', { medicamentos: result, mensagem: null, erro: null, filtro: null })
            }
        )
    } catch (err) {
        console.error(err);
    }

};
