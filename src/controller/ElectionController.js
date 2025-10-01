const model = require('../models/ElectionModel');
const voteSchema = require('../validation/voteSchema');

// --- Tratamento de Erros (Simplificado para API/JSON) ---
// Retorna SEMPRE JSON para todas as rotas de API.
const errorHandler = (req, res, error, status = 500) => {
  console.error(`[STATUS ${status}] Erro na rota ${req.path}: ${error.message}`);

  // Sempre retorna JSON (para API ou para o browser que o chamou internamente)
  return res.status(status).json({
    error: error.message || 'Ocorreu um erro interno no servidor.',
  });
};

// 1. Página Inicial (Mantém EJS)
const getIndex = async (req, res) => {
  try {
    const candidatos = await model.listCandidatesModel();
    res.render('index', {
      candidatos: candidatos,
    });
  } catch (error) {
    // Para rotas de página, se houver um erro, o ideal é renderizar uma view de erro.
    // Usamos o padrão de retorno JSON do errorHandler para simplificar,
    // mas em produção, 'getIndex' deveria ter um tratamento de erro que renderize um template EJS de erro.
    errorHandler(req, res, error, 500); 
  }
};

// Controller para listar candidatos (API pura)
const listCandidates = async (req, res) => {
  try {
    const candidatos = await model.listCandidatesModel();
    res.status(200).json(candidatos);
  } catch (error) {
    errorHandler(req, res, error, 500); 
  }
};

// Controller para obter o líder (CONSOLIDADO: Sempre retorna JSON)
// Esta função é agora usada pelo browser (que tratará o JSON) e pelos testes.
const getLeader = async (req, res) => {
  try {
    const leader = await model.getLeaderModel();
    if (!leader) {
      // Se não há líder, retorna 404 JSON
      return res.status(404).json({ error: 'Nenhum candidato registrado ou votos contabilizados.' });
    }
    // Sempre retorna JSON 200 OK
    res.status(200).json(leader);
  } catch (error) {
    errorHandler(req, res, error, 500); 
  }
};

// Controller para registrar o voto (API pura - SEM CONDICIONAL)
const registerVote = async (req, res) => {
  try {
    const { error, value } = voteSchema.validate(req.body);
    if (error) {
      // Sempre retorna JSON 400 Bad Request
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, id } = value;
    const result = await model.registerVoteModel(email, id);

    // Sempre retorna JSON 201 Created
    res.status(201).json(result);

  } catch (error) {
    let status = 500;
    if (error.message.includes('Voto duplicado')) {
      status = 403;
    } else if (error.message.includes('Candidato não encontrado')) {
      status = 404;
    }
    // Tratamento de erro unificado para retornar JSON
    res.status(status).json({ error: error.message });
  }
};


module.exports = {
  getIndex,
  listCandidates,
  getLeader, // Rota única para API /eleicao/lider
  registerVote,
};
