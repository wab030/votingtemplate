const Joi = require('joi');
const {home} = require('../controller/homeController'); 
const {medicine, lowStock} = require('../controller/requestMedicineController');

module.exports = {
    home: (app) => {
        app.get('/', (req, res) => {
            home(app, req, res);
        });
    },
    requestMedicine: (app) => {
        app.post('/retirada', (req,res) => {
            medicine(app, req, res);
        });
    },
    lowStock: (app) => {
        app.get('/baixo-estoque', (req,res)=>{
            lowStock(app, req, res);
        });
    }

};