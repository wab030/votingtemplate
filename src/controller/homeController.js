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
        res.render('farmacia.ejs', { medicamentos: result, mensagem: null, erro: null, filtro: null })

        
    }); 
}

module.exports.retirada = (app, req, res) => {
    console.log('[Controller Retirada]');

    const idMedicamento = req.body.idMedicamento;
    const email = req.body.email;
    const updateData = {
        id: req.body.idMedicamento,
        email: req.body.email
    }

    updateProduto(idMedicamento, updateData, dbConnection, (error, result) => {
        if (error) {
            console.error('Erro ao atualizar o produto:', error);
            const erromsg = 'Erro ao atualizar o produto.';
            return erromsg;
        }
        const sucessmsg = 'Retirada realizada com sucesso!';
        return res.status(200).redirect('/?mensagem=${encodeURIComponent(sucessmsg}');
    });

}

module.exports.estoquebaixo = (app, req, res) => {
    console.log('[Controller Estoque Baixo]');

    getEstoqueBaixo(dbConnection, (error, result) => {
        res.render('farmacia.ejs', { medicamentos: result, mensagem: null, erro: null, filtro: 'ESTOQUE BAIXO' });
    });
}