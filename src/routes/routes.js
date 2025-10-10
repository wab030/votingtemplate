const Joi = require('joi');
const { home } = require('../controller/homeController');
const { retirada } = require('../model/homeModel');

const schema = Joi.object({
    idMedicamento: Joi.number().integer().positive().required().messages({'number.base': 'O ID do medicamento deve ser um número.', 
        'number.integer': 'O ID do medicamento deve ser um número inteiro.', 
        'number.positive': 'O ID do medicamento deve ser um número positivo.', 
        'any.required': 'O ID do medicamento é obrigatório.'}),
    email: Joi.string().email({tlds: {allow:false}}).required().messages({'string.base': 'O email deve ser uma string.', 
        'string.email': 'O email deve ser um email válido.', 
        'any.required': 'O email é obrigatório.'})
    
});

const validateProduto = (req, res, next) => {

    const { error } = schema.validate(req.body);
    if (error) {
        return res.render('farmacia.ejs', { mensagem: null, erro: error.details[0].message, filtro: null });
    }
}

module.exports = {
    home: (app) => {
        app.get('/', (req, res) => {
            home(app, req, res);
        });
    },

    retirada: (app) => {
        app.post('/retirada', validateProduto, (req, res) => {
            retirada(app, req, res);
        });

    }

    
}