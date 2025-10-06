// validation/schemas.js
const Joi = require('joi');

const retiradaSchema = Joi.object({
    medicamento_id: Joi.number()
        .integer()
        .min(1)
        .required()
        .messages({
            'number.base': 'ID do medicamento deve ser um número inteiro.',
            'number.min': 'ID do medicamento inválido.',
            'any.required': 'O ID do medicamento é obrigatório.'
        }),
    
    email_municipe: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'br'] } })
        .required()
        .messages({
            'string.email': 'O e-mail do munícipe deve ser um formato válido.',
            'any.required': 'O e-mail do munícipe é obrigatório.'
        })
});

module.exports = { retiradaSchema };