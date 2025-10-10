const dbConnection = require('../db');
const { getProdutos, updateRemedioModel, getEstoqueBaixo } = require('../model/homeModel');

module.exports.home = (app, req, res) => {
    console.log('[Home]');

    getProdutos(dbConnection, (error, result) => {
        res.render('farmacia.ejs', { medicamentos: result , mensagem: null, errors: null, filtro: null });
    })};

module.exports.retirada = (app, req, res) => {
    console.log('[Retirada Medicamento]');

    const idMedicamento = req.body.medicamento_id;
    const email_municipe = req.body.email_municipe;
    const updatedData = {
        id: req.body.medicamento_id,
        email: req.body.email_municipe
    }

    updateRemedioModel(idMedicamento, updatedData, dbConnection, (error, result) => {
        if(error){
            console.error("Erro no BD:", error);
            const erroMsg = 'Erro no servidor ao tentar processar a retirada.';
            return erroMsg
        }
        const sucessoMsg = 'Retirada realizada com sucesso';
        return res.status(200).redirect(`/?mensagem=${encodeURIComponent(sucessoMsg)}`);
    })
}

module.exports.estoquebaixo = (app, req, res) => {
    console.log('[Estoque Baixo]');

    getEstoqueBaixo(dbConnection, (error, result) => {
        res.render('farmacia.ejs', { medicamentos: result , mensagem: null, errors: null, filtro: 'ESTOQUE BAIXO' });
    })
}

    