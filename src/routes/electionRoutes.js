const express = require('express');
const router = express.Router();
const controller = require('../controller/ElectionController');

// Rota inicial que renderiza a view index.ejs
router.get('/', controller.getIndex);

// Rotas da Eleição
router.get('/eleicao/candidatos', controller.listCandidates); // API
router.get('/eleicao/lider', controller.getLeader); // Renderiza View
router.post('/eleicao/votar', controller.registerVote); // Renderiza View

module.exports = router;