const {validateMedicineRequest, retireMedicine, lowStock} = require('../model/medicine');
const dbCon = require('../db');

module.exports = {
    medicine: (app, req, res) => {
        let medicine = req.body;
        validateMedicineRequest(medicine, res);

        retireMedicine(dbCon(),req,(error, result)=>{
            let sucessoMsg = "Retirada realizada com sucesso. Estoque atual: MUDAR"
            return res.status(200).redirect(`/?mensagem=${encodeURIComponent(sucessoMsg)}`);
        });
    },
    lowStock: (app, req, res) => {
        lowStock(dbCon(),(error, result)=>{
            console.log(result)
            res.render('farmacia.ejs',{
                medicamentos: result,
                mensagem: null,
                erro: null,
                filtro: 'ESTOQUE BAIXO'
            });
        });
    }
}