const app = require('./app'); // Importa a aplicação Express
const PORT = 4000; // Define a porta obrigatória


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});