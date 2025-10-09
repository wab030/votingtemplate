const express = require('express');
const app = express();
const routes = require('./routes/routes');

app.set("view engine", "ejs");
app.set('views', 'src/views'); //Definição do local das views
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

routes.farmacia(app);
routes.estoquebaixo(app);

// Para iniciar sua aplicação digite nodemon server.js
console.log('Hello Word Prova WEB 2')

module.exports = app;