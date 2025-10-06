// controllers/medicamentoController.js
const MedicamentoModel = require('../models/medicamentoModel');

// --- 2. Listar Todos os Medicamentos (GET /) ---
// --- 4. Medicamentos com Estoque Baixo (GET /estoque-baixo) ---
exports.listar = async (req, res) => {
    // Verifica se a rota é para estoque baixo
    const estoqueBaixo = req.path === '/estoque-baixo';
    
    // Captura mensagens/erros passados via query string (após redirecionamento)
    const mensagem = req.query.mensagem ? decodeURIComponent(req.query.mensagem) : null;
    const erro = req.query.erro ? decodeURIComponent(req.query.erro) : null;

    try {
        const medicamentos = await MedicamentoModel.findAll(estoqueBaixo);
        // Parâmetros de renderização para a ÚNICA VIEW
        const params = {
            medicamentos,
            mensagem,
            erro,
            // Parâmetro específico para o teste de Saída 4.
            filtro: estoqueBaixo ? 'ESTOQUE BAIXO' : null
        };

        res.status(200).render('farmacia', params);

    } catch (error) {
        console.error('Erro no Controller ao listar:', error);
        // --- 5. Tratamento de Erros: Erro Interno (500) ---
        res.status(500).send(`<div id="erro-interno">Erro interno do servidor: ${error.message}</div>`);
    }
};

// --- 3. Retirar Medicamento (POST /retirada) ---
exports.retirar = async (req, res) => {
    const { medicamento_id, email_municipe } = req.body;
    
    try {
        // 1. Verificar se o medicamento existe e tem estoque
        const medicamento = await MedicamentoModel.findById(medicamento_id);

        // Caso o ID seja válido pelo Joi, mas não exista no DB
        if (!medicamento) {
            const erroMsg = `Medicamento com ID ${medicamento_id} não encontrado no sistema.`;
            return res.status(400).redirect(`/?erro=${encodeURIComponent(erroMsg)}`);
        }

        // 2. Verificar Estoque Insuficiente
        if (medicamento.quantidade <= 0) {
            // --- Saída 3.C. Erro (Estoque Baixo) ---
            const erroMsg = `O medicamento ${medicamento.nome_medicamento} não possui estoque disponível para retirada.`;
            return res.status(400).redirect(`/?erro=${encodeURIComponent(erroMsg)}`);
        }

        // 3. Verificar Retirada Duplicada
        const jaRetirou = await MedicamentoModel.checkRetiradaDuplicada(medicamento_id, email_municipe);
        
        if (jaRetirou) {
            // --- Saída 3.C. Erro (Já Retirou) ---
            const erroMsg = `Este munícipe já retirou o medicamento ${medicamento.nome_medicamento} e não pode retirar novamente.`;
            return res.status(409).redirect(`/?erro=${encodeURIComponent(erroMsg)}`);
        }

        // 4. Processar Retirada (Atualiza DB)
        await MedicamentoModel.processarRetirada(medicamento_id, email_municipe);
        
        // --- Saída 3.C. Sucesso ---
        const novaQuantidade = medicamento.quantidade - 1;
        const sucessoMsg = `Retirada realizada com sucesso. Estoque atual: ${novaQuantidade}`;
        return res.status(200).redirect(`/?mensagem=${encodeURIComponent(sucessoMsg)}`);

    } catch (error) {
        console.error('Erro no Controller ao retirar:', error);
        // --- 5. Tratamento de Erros: Erro Interno (500) ---
        res.status(500).send(`<div id="erro-interno">Erro interno do servidor na retirada: ${error.message}</div>`);
    }
};