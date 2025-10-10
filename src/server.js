const app = require('./app'); // Importa a aplicação Express
const router = require('./routes/routes');
const PORT = 4000; // Define a porta obrigatória

router.home(app);
router.requestMedicine(app);
router.lowStock(app);

// Inicia o servidor na porta 5000
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});