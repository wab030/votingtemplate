const dbConnection = require('../db');
const {getMedicamentos, updateMedica} = require('../model/home');

module.exports.homefarmacia = (app, req, res) => {
  // Aqui vamos fazer a chamada para o model do banco de dados.
  console.log('[Controller homefarmacia]');
  
  // Correção: Mudou 'dbConn' para 'dbConnection' para consistência e evitar erro de variável
  const conn = dbConnection();  // Chama a função corretamente e armazena em 'conn'

  getMedicamentos(conn, (error, result) => {
    console.log(error);
    console.log(result);
    if (error) {
      console.error('Erro ao buscar medicamentos:', error);
      return res.status(500).render('farmacia.ejs', { medicamentos: [], mensagem: null, erro: 'Erro no banco de dados', filtro: null });
    }

     res.render('farmacia.ejs', { medicamentos: result, mensagem: null,erro: null, filtro: null });
  });
};

module.exports.updateMedicamento = (app, req, res) => {
  console.log('Controller updateMedicamento');
  console.log(req.body);

  const id = req.params.id;
  const conn = dbConnection();
  
  updateMedica(conn, id, req.body, (error, result) =>{
    if(error){
      console.error('Erro ao atualizar medicamento:', error);
      return res.status(500).send('Erro ao atualizar no banco de dados');
    }
    if(result.affectedRows === 0){
      return res.status(404).render('farmacia.ejs');
    }
    //req.session.sucess = 'Obra atualizada com sucesso!';
    res.redirect('/');
  });
};