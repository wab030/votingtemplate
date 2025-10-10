const dbconn = require('../../config/dbConnection');
const { addFarmacia, getFarmaciaModel, getFarmaciaById } = require('./models');
const { 
getfarmacia,
addFarmacia,
getFarmaciaModel,
getFarmaciaById,
updateFarmacia
}  ('../models');

module.exports = connection;

module.exports.home = (app, req, res) => {	
console.log;
const db = dbconn ();
getFarmacia (db), (error, result) => {
if (error) {
	console.error (error);
	return res.send;
}}

res.render('farmacia', {medicamentos: [...], mensagem: {}, erro:{}, fitro: {}) };

    module.exports.home = (app, req, res) => {
    console.log;
    const db = dbConn();
    getfarmacia(db, (error, result) => {
        if (error) {
            console.error(error);
            return res.send('Erro ao consultar o banco de dados');
        }
        res.render('home.ejs', { farmacia: result });
    });
};

module.exports.addFarmacia = (app, req, res) => {
    console.log('[Controller add Farmacia]');
    console.log(req.body);
    const db = dbConn();
    addFarmacia(db, req.body, (error, result) => {
        if (error) {
            console.error(error);
            return res.send('Erro ao gravar no banco de dados');
        }
        console.log('Resultado', result);
        res.redirect('/');
    });
};

module.exports.getFarmaciaController = (app, req, res) => {
    console.log("Controller Get Farmacia");
    const { idmed } = req.query; 
    const db = dbConn();

    getFarmaciaModel(idmed, db, (error, result) => {
        if (error) {
            console.error(error);
            return res.send('Erro ao buscar a obra');
        }
        const [farmacia] = result;
        res.render('showFarmacia.ejs', { farmacia });
    });
};

module.exports.editFarmacia = (app, req, res) => {
    console.log('[Controller edit farmacia]');
    const { id } = req.params; 
    const db = dbConn();

    getFarmaciaById(db, id, (error, result) => {
        if (error) {
            console.error(error);
            return res.send('Erro ao buscar medicameneto pelo prontuário');
        }
        res.render('editFarmacia.ejs', { farmacia: result[0] });
    });
};

module.exports.updateFarmacia = (app, req, res) => {
    console.log('[Controller update Farmacia]');
    const { id } = req.params;
    const db = dbConn();

    updateFarmacia(db, id, req.body, (error, result) => {
        if (error) {
            console.error(error);
            return res.send('Erro ao atualizar medicamento');
        }
        res.redirect('/showFarmacia?idobra=' + id);
    });