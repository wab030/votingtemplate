const dbCon = require('../db');
const {home} = require('../model/home');

module.exports = {
    home: (app, req, res) => {
        db = dbCon()
        home(db,(error,result)=>{
            res.render('farmacia.ejs',{
                medicamentos: result,
                mensagem: null,
                erro: null,
                filtro: null
            });
        });
    }
}