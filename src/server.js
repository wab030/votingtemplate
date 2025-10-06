const app = require('./app');
const PORT = 4000
app.listen(PORT, () => {
    console.log(`Servidor rodandllllo na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});