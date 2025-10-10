const Joi = require('joi');
const { home } = require('../controller/homeController');
const { retirada } = require('../controller/homeController');
const { estoquebaixo } = require('../controller/homeController');
const { getProdutos, updateRemedioModel } = require('../model/homeModel');

const schema = Joi.object({
    medicamento_id: Joi.number().integer().min(1).required(),
    email_municipe: Joi.string().email().required().min(11).max(50).required(),
})

const validateRemedio = (req, res, next) => {
    console.log('Validando Requisição');
    const { error } = schema.validate(req.body);
    if(error){
        return res.render('farmacia.ejs', { errors: error.details[0].message, medicamento: req.body, filtro: null, mensagem: null, medicamentos: [] });
    }
    next();
}

module.exports = {
    home: (app) => {
        app.get('/', function (req, res) {
            home(app, req, res);
        });
    },
    retirada: (app) => {
        app.post('/retirada', validateRemedio, (req, res) => {
            retirada(app, req, res);
        });
    },
    estoquebaixo: (app) => {
        app.get('/estoque-baixo', (req, res) => {
            estoquebaixo(app, req, res);
        });
    },
}