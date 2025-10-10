const express = require('express');
const routes = require('./routes/routes');
const app = express();

// Aqui você deve desenvolver toda a configuração do seu app. 

//ATENÇÂO NÃO COLOQUE O COMANDO app.listen nesse arquivo. Ele já está no server, que é o arquivo principal da sua aplicação. 

// Para iniciar sua aplicação digite nodemon server.js

app.set('view engine', 'ejs');
app.set('views', '../src/views');
app.use(express.static('../src/public'));

routes.home(app);

module.exports = app;