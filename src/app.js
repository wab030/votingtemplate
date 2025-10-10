const express = require('express');
const app = express();

app.set("view engine", "ejs");
app.set("views", "../src/Views");
app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const farmaciaRoutes = require('./Routes/routes');

farmaciaRoutes.farmacia(app);

module.exports = app;