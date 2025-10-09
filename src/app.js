const express = require('express');
const path = require('path');
const app = express();
const medicamentoController = require('./controllers/medicamentoController');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', medicamentoController.home);
app.get('/estoque-baixo', medicamentoController.estoqueBaixo);
app.post('/retirada', medicamentoController.retirada);

module.exports = app;