const farmaciaController = require('../Controllers/farmaciaController');
const farmaciaModel = require('../Models/farmaciaModels');



module.exports =  {

    farmacia: (app) => {

        app.get('/',farmaciaController.farmacia);

    },

        estoqueBaixo : (app) =>{

        app.get('/estoque-baixo',(req,res)=>{

            farmaciaController.estoqueBaixo(req,res);

        })
    },

    retirarMedicamento : (app) =>{

        app.post('/retirada',(req,res)=>{

            const {error} = farmaciaModel.schemas.retirada.validate(req.body);


            if(error){
                return res.render('farmacia.ejs',{errors:error.details , retirada:req.body})
            }else{

                farmaciaController.retiradaMedicamento(req,res);
            }
        })
    }


}