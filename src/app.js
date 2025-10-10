const express = require('express');
const app = express();
const routes = require("./routes/routes");

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.urlencoded({ extended: true }));

routes.homefarmacia(app);
routes.getmedicamento(app);


module.exports = app;