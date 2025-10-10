const Joi = require('joi');
const { farmacia } = require('../controllers/farmaciaController');
const { estoquebaixo } = require('../controllers/farmaciaController');
const { retirada } = require('../controllers/farmaciaController');

const schema = Joi.object({
    medicamento_id: Joi.number().required().min(1),
    email_municipe: Joi.string().email().required()
});

const validateForm = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return res.render('farmacia.ejs', { errors: error.details, medicamentos: req.body });
    }
    next();
}

module.exports = {
    farmacia: (app) => {
        app.get('/', (req, res) => {
            farmacia(app, req, res);
        });
    },
    estoquebaixo: (app) => {
        app.get('/estoque-baixo', (req, res) => {
            estoquebaixo(app, req, res);
        });
    },
    retirada: (app) => {
        app.post('/retirada', validateForm, (req, res) => {
            retirada(app, req, res);
        });
    }
}