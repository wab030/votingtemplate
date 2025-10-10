const Joi = require('joi');
const { homefarmacia, updateMedicamento } = require('../controller/homeController')

//validação de medicamentos
const validateMedicamento = (req, res, next) => {
  const schema = Joi.object({
    numero: Joi.number().integer().min(1).required().messages({
      'number.empty': 'Numero do Medicamento é obrigatório',
      'number.min': 'Numero do Medicamento deve ter pelo menos 1 caractere'
    }),
    email_municipe: Joi.string().email().required().messages({
      'string.Empty': 'E-mail municipal é obrigatório',
      'string.email': 'Tem que ser um e-mail valido'
    })
  });

  const {error} = schema.validate(req.body, {abortEarly: false});
  console.log('Erro de validação:', error);
  if(error){
    return res.render('farmacia.ejs', res.render('farmacia', { medicamentos: [], mensagem: null,
erro: error, filtro: null }))
  }
  next();
};

module.exports = {
    homefarmacia: (app) =>{
        console.log("Rota / Criada");
        app.get('/', (req, res) => {
            console.log("Rota / acionada");
            homefarmacia(app,req, res);
        });
    },
    getmedicamento: (app) =>{
        console.log("Rota /retirada Criada");
        app.post('/retirada', validateMedicamento, (req, res) =>{
            console.log("Rota /retirada acionada");
            updateMedicamento(app, req, res);
        } )
    }
}