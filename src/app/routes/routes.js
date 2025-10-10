const { farmacia } = require('../controllers/farmaciaController');

module.exports = {
    farmacia: (app) => {
        app.get('/', (req, res) => {
            farmacia(app, req, res);
        });
    }}