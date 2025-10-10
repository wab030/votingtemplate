// validation/middleware.js (Pode ser criado na pasta validation)
const { retiradaSchema } = require('./schema');

const validateRetirada = (req, res, next) => {
    // Valida apenas os campos do body
    const { error } = retiradaSchema.validate(req.body);

    if (error) {
        // Formata o erro para ser exibido na view principal
        const errorMessage = `Dados inválidos: ${error.details[0].message}`;
        
        // Redireciona de volta para a rota inicial com o erro (400 Bad Request no corpo)
        // Usamos encodeURIComponent para garantir que a mensagem de erro seja preservada na URL
        return res.redirect(`/?erro=${encodeURIComponent(errorMessage)}`);
    }

    next();
};

module.exports = { validateRetirada };