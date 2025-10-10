const db = require('../db');
const { estoquebaixo } = require('../models/modelTeste');

module.exports.estoquebaixo = (app, req, res) => {
    try {
        estoquebaixo(db(), (error, result) => {
                console.log(error);
                console.log(result);
                res.render('farmacia', { medicamentos: result, mensagem: null, erro: null, filtro: null })
            }
        )
    } catch (err) {
        console.error(err);
    }

};
