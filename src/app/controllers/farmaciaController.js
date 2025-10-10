const { connect } = require('../src/db');
const { getMedicamentos } = require('../models/farmaciaModel');

module.exports.farmacia = (app, req, res) => {
    const db = connect();
    getMedicamentos(db, (error, result) => {
        res.render('farmacia.ejs', { medicamentos: result });
    });
}