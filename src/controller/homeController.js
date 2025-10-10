const dbConnection = require('../db');
const Joi = require('joi');
const { getProdutos } = require('../model/homeModel');
const { updateProduto } = require('../model/homeModel');
const { getEstoqueBaixo } = require('../model/homeModel');
const homeModel = require('../model/homeModel');
const { get } = require('../app');


module.exports.home = (app, req, res) => {
    console.log('[Controller Home]');

    getProdutos(dbConnection, (error, result) => {
        res.render('farmacia', { medicamentos: result, mensagem: null, erro: null, filtro: null })

        
    }); 
}

module.exports.retirada = (app, req, res) => {
    console.log('[Controller Retirada]');

    const {  idMedicamento, email } = req.body;

    const { error } = schema.validate(idMedicamento, email);
    if (error) {
        const mensagemErro = error.details.map(detail => detail.message).join(', ');

        console.error('Erro de validação:', mensagemErro);

        return res.render('retirada', { mensagem: `Erro de validação: $(mensagemErro)`, erro: true });
    }

    homeModel.restirada(dbConnection, idMedicamento, 1, (error, result) => {
        if (error) {
            console.error('Erro ao processar a retirada:', error);
            return res.render('retirada', { mensagem: 'Erro ao processar a retirada.', erro: true });
        }
    });
    
    
    res.render('retirada', { mensagem: 'Retirada de produto realizada com sucesso!', erro: null });

}

module.exports.estoquebaixo = (app, req, res) => {
    console.log('[Controller Estoque Baixo]');

    getEstoqueBaixo(dbConnection, (error, result) => {
        res.render('farmacia.ejs', { medicamentos: result, mensagem: null, erro: null, filtro: 'ESTOQUE BAIXO' });
    });
}