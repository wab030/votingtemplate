const {farmacia} = require('../controllers/farmaciaController')
const {estoquebaixo} = require('../controllers/farmaciaController')

module.exports = {
    farmacia: (app) => {
        app.get('/', (req, res) => {
            //console.log('Cheguei na rota /');
            farmacia(app, req, res);
        });
    },
    estoquebaixo:(app) => {
        app.get('/estoque-baixo', (req, res) => {
           // console.log('Cheguei na rota /');
            estoquebaixo(app, req, res);
        });
    }
}