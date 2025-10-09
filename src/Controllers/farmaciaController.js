const dbConn = require('../../src/db');
const farmaciaModel = require('../Models/farmaciaModels');



module.exports.farmacia = (req, res) => {


    farmaciaModel.getMedicamentos(dbConn, (err, result) => {


        if (err) {
            return res.status(500).send("Erro ao recarregar as obras");
        } else {

            return res.render("farmacia.ejs", { remedios: result });

        }


    })

}


module.exports.estoqueBaixo = (req, res) => {


    farmaciaModel.getEstoqueBaixo(dbConn, (err, result) => {

        if (err) {

            return res.status(500).send("Erro ao recarregar os medicamentos");

        } else {

            res.render('farmacia', {
                medicamentos: { medicamentos: result }, mensagem: null, erro: null, filtro: 'ESTOQUE BAIXO'
            })
        }

    })
}

module.exports.retiradaMedicamento = (req, res) => {


    const dados = req.body;


    farmaciaModel.retirarMedicamento(dbConn, dados, (err, result) => {

        if (err) {

            return res.status(500).send("Erro", err);

        } else {

            res.redirect('/');

        }
    });

}