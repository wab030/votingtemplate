// app.js (NOVO ARQUIVO)
const express = require('express');
const path = require('path');
const webRoutes = require('./routes/routes');

const app = express();

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para processar dados de formulário (POST)
app.use(express.urlencoded({ extended: true }));

// Uso das Rotaslllll
app.use('/', webRoutes);

// --- 5. Tratamento de Erros: Rota Não Encontrada (404) ---
app.use((req, res) => {
    res.status(404).send('<h1>404: Rota Não Encontrada</h1><p>A rota solicitada não existe.</p>');
});

// Exporta a instância do Express para ser usada pelo server.js e pelos testes
module.exports = app;
