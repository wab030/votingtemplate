const express = require('express');
const app = express();

// Aqui você deve desenvolver toda a configuração do seu app. 

//ATENÇÂO NÃO COLOQUE O COMANDO app.listen nesse arquivo. Ele já está no server, que é o arquivo principal da sua aplicação. 

// Para iniciar sua aplicação digite nodemon server.js

app.set("view engine", "ejs");
app.set('views', './views'); //Definição do local das views
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

const routes = require('./routes/routes');

routes.farmacia(app);
routes.estoquebaixo(app);

module.exports = app;