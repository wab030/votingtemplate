const express = require('express');
const routes = require('../src/routes/routes');
const app = express();
const bodyParser = require ('body-parser');

app.set("view engine", "ejs");
app.set("views", "../src/views");
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

routes.home(app);
routes.retirada(app);
routes.estoquebaixo(app);

module.exports = app;