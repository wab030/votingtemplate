const { farmacia } = require('../controllers/controller');
const { estoquebaixo } = require('../controllers/controllerTeste');

module.exports = {
    farmacia: (app) => {
        app.get('/', function (req, res) {
            farmacia(app, req, res);
        });
    },
    estoquebaixo: (app) => {
        app.get('/estoque-baixo', function (req, res) {
            estoquebaixo(app, req, res);
        });
    },
}