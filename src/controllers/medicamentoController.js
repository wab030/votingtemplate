const Joi = require('joi');
const medicamentoModel = require('../models/medicamentoModel');

const retiradaSchema = Joi.object({
    medicamento_id: Joi.number().integer().positive().required().messages({
        'number.base': 'O id do medicamento deve ser um número',
        'number.positive': 'O id do medicamento deve ser maior que 0',
        'any.required': 'O id do medicamento é obrigatório'
    }),
    email_municipe: Joi.string().email().required().messages({
        'string.email': 'O e-mail do munícipe deve ser um formato válido',
        'any.required': 'O e-mail do munícipe é obrigatório'
    })
});

async function home(req, res) {
    const { mensagem, erro } = req.query;
    const medicamentos = await medicamentoModel.getAll();
    return res.render('farmacia', { medicamentos, mensagem: mensagem || null, erro: erro || null, filtro: null });
}

async function estoqueBaixo(req, res) {
    const medicamentos = await medicamentoModel.getLowStock();
    return res.render('farmacia', { medicamentos, mensagem: null, erro: null, filtro: 'ESTOQUE BAIXO' });
}

async function retirada(req, res) {
    try {
        const payload = {
            medicamento_id: Number(req.body.medicamento_id),
            email_municipe: req.body.email_municipe,
        };

        const { error } = retiradaSchema.validate(payload, { abortEarly: false });
        if (error) {
            const mensagem = `Dados inválidos: ${error.details.map(d => d.message).join('. ')}`;
            return res.status(400).redirect(`/?mensagem=&erro=${encodeURIComponent(mensagem)}`);
        }

        const result = await medicamentoModel.performRetirada(payload.medicamento_id, payload.email_municipe);
        if (result.status === 'notfound') {
            const mensagem = `Medicamento com ID ${payload.medicamento_id} não encontrado no sistema.`;
            return res.status(400).redirect(`/?mensagem=&erro=${encodeURIComponent(mensagem)}`);
        }

        if (result.status === 'already') {
            const mensagem = `Este munícipe já retirou o medicamento ${result.nome || ''} e não pode retirar novamente.`;
            return res.status(409).redirect(`/?mensagem=&erro=${encodeURIComponent(mensagem)}`);
        }

        if (result.status === 'nostock') {
            const mensagem = `O medicamento ${result.nome} não possui estoque disponível para retirada.`;
            return res.status(400).redirect(`/?mensagem=&erro=${encodeURIComponent(mensagem)}`);
        }

        if (result.status === 'ok') {
            const sucessoMsg = `Retirada realizada com sucesso.\nEstoque atual: ${result.estoqueAtual}`;
            return res.status(200).redirect(`/?mensagem=${encodeURIComponent(sucessoMsg)}`);
        }

    } catch (err) {
        console.error(err);
        const mensagem = 'Erro interno no servidor.';
        return res.status(500).redirect(`/?mensagem=&erro=${encodeURIComponent(mensagem)}`);
    }
}

module.exports = { home, estoqueBaixo, retirada };
