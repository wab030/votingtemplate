// routes/web.js
const express = require('express');
const router = express.Router();
const medicamentoController = require('../controllers/medicamentoController');
const { validateRetirada } = require('../validaton/middleware');

// --- 2. Listar Todos (GET /) ---
router.get('/', medicamentoController.listar);

// --- 4. Estoque Baixo (GET /estoque-baixo) ---
router.get('/estoque-baixo', medicamentoController.listar);

// --- 3. Retirar Medicamento (POST /retirada) ---
// Aplica o middleware de validação Joi antes do controller
router.post('/retirada', validateRetirada, medicamentoController.retirar);

module.exports = router;