const dbConn = require('../db')
const {getMedicamentos ,  getEstoqueBaixo } = require('../models/farmaciaModel');

module.exports.farmacia = (app, req, res) => {
    
    const db = dbConn();
    getMedicamentos(db, (error, result) => {
        res.render('farmacia', { medicamentos: result, mensagem: null,
            erro: error, filtro: null })
    });
};

module.exports.estoquebaixo = (app, req, res) => {
    
    const db = dbConn();
    getEstoqueBaixo(db, (error, result) => {
        res.render('farmacia', { medicamentos: result, mensagem: null,
            erro: error, filtro: 'ESTOQUE BAIXO' })
    });
};
