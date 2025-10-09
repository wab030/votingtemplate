const express = require('express');
const app = express();

// Aqui você deve desenvolver toda a configuração do seu app. 

//ATENÇÂO NÃO COLOQUE O COMANDO app.listen nesse arquivo. Ele já está no server, que é o arquivo principal da sua aplicação. 

// Para iniciar sua aplicação digite nodemon server.js

app.set("view engine", "ejs");
app.set("views", "./app/views");
app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const farmaciaRoutes = require('./Routes/routes.js');

farmaciaRoutes(app);

module.exports = app;