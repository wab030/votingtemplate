const express = require('express');
const app = express();

const routes = require('./app/routes/routes');

app.set("view engine", "ejs");
app.set('views', '.src/app/views');

routes.farmacia(app);

// Aqui você deve desenvolver toda a configuração do seu app. 

//ATENÇÂO NÃO COLOQUE O COMANDO app.listen nesse arquivo. Ele já está no server, que é o arquivo principal da sua aplicação. 

// Para iniciar sua aplicação digite nodemon server.js

module.exports = app;