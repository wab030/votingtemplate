const request = require('supertest');
const app = require('../src/app'); // Importa a instância do Express (sem listen)
const { connect } = require('../src/db');

// Variáveis para rastrear o estado do banco de dados (crucial para testes sequenciais)
let initialMedicamentosCount;

// Função utilitária para buscar um elemento pelo ID na string HTML
const getElementById = (html, id) => {
    const regex = new RegExp(`<[^>]*id="${id}"[^>]*>(.*?)<\/[^>]*>`, 's');
    const match = html.match(regex);
    if (match) {
        // Remove tags HTML internas e retorna apenas o texto
        return match[1].replace(/<[^>]*>/g, '').trim();
    }
    return null;
};

// Funções para resetar o DB (idealmente um script SQL, simplificado aqui)
const resetDatabase = async () => {
    const pool = await connect();
    // Reseta a tabela de retiradas
    await pool.query('DELETE FROM retiradas');
    // Reseta o estoque para o estado inicial
    await pool.query('UPDATE medicamentos SET quantidade = 15 WHERE id = 1'); // Paracetamol
    await pool.query('UPDATE medicamentos SET quantidade = 5 WHERE id = 2'); // Dipirona
    await pool.query('UPDATE medicamentos SET quantidade = 2 WHERE id = 3'); // Amoxicilina
    await pool.query('UPDATE medicamentos SET quantidade = 1 WHERE id = 4'); // Ibuprofeno
    
    // Contagem inicial para referência
    const [rows] = await pool.query('SELECT COUNT(*) as total FROM medicamentos');
    initialMedicamentosCount = rows[0].total;
};

beforeAll(async () => {
    await resetDatabase();
});

afterEach(async () => {
    // Garante que o estado seja resetado após cada teste POST, GET não muda o estado
    await resetDatabase(); 
});

describe('Requisito 2: Listar Todos os Medicamentos (GET /)', () => {
    it('deve retornar 200 e a contagem correta de medicamentos na view', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        // --- Teste de Saída EJS (Requisito 2) ---
        const total = getElementById(response.text, 'total-medicamentos');
        expect(total).not.toBeNull();
        expect(parseInt(total)).toBe(initialMedicamentosCount); // Espera 4 medicamentos iniciais
    });
});

// describe('Requisito 4: Medicamentos com Estoque Baixo (GET /estoque-baixo)', () => {
//     it('deve retornar 200, listar apenas estoque baixo e exibir o filtro ativo', async () => {
//         const response = await request(app).get('/estoque-baixo');

//         expect(response.statusCode).toBe(200);

//         // --- Teste de Saída EJS (Requisito 4) ---
//         const total = getElementById(response.text, 'total-medicamentos');
//         const filtro = getElementById(response.text, 'filtro-ativo');

//         // Espera-se 2 medicamentos com estoque baixo (Amoxicilina=2, Ibuprofeno=1)
//         expect(parseInt(total)).toBe(2);
        
//         // Verifica se a tag de filtro está presente
//         expect(filtro).toBe('FILTRO ATIVO: ESTOQUE BAIXO'); 
//     });
// });

describe('Requisito 3: Retirar Medicamento (POST /retirada)', () => {
    const validData = { medicamento_id: 2, email_municipe: 'teste.municipe@email.com' };
    // --- Teste 3.B. Saída Sucesso ---
    it('deve processar a retirada, reduzir o estoque e exibir mensagem de sucesso', async () => {
        const initialQuantity = 5; // Dipirona (ID 2)

        const response = await request(app)
            .post('/retirada')
            // 🚨 SOLUÇÃO: Força o Supertest a enviar o Content-Type como formulário, 
            // que é o que express.urlencoded espera
            .type('form') 
            .send(validData)
            .expect(302); // Espera Redirecionamento

        // Segue o redirecionamento para verificar a mensagem na página inicial
        const homeResponse = await request(app).get(response.header.location);
        const mensagemSucesso = getElementById(homeResponse.text, 'mensagem-sucesso');
        
        // Verifica se a mensagem de sucesso está presente e correta
        expect(mensagemSucesso).not.toBeNull();
        expect(mensagemSucesso).toContain(`Estoque atual: ${initialQuantity - 1}`);

        // Verifica se o estoque foi realmente atualizado no DB (opcional, mas boa prática)
        const pool = await connect();
        const [rows] = await pool.query('SELECT quantidade FROM medicamentos WHERE id = ?', [validData.medicamento_id]);
        expect(rows[0].quantidade).toBe(initialQuantity - 1);
    });
    
    // --- Teste 3.A. Validação JOI (Dados Inválidos) ---
    it('deve falhar a retirada se o email for inválido (JOI) e exibir mensagem de erro', async () => {
        const invalidData = { medicamento_id: 1, email_municipe: 'email-invalido' };
        
        const response = await request(app)
            .post('/retirada')
            .type('form') 
            .send(invalidData)
            .expect(302); 

        // Segue o redirecionamento
        const homeResponse = await request(app).get(response.header.location);
        
        const mensagemErro = getElementById(homeResponse.text, 'mensagem-erro');
        
        // Verifica se o erro do Joi foi capturado
        expect(mensagemErro).not.toBeNull();
        expect(mensagemErro).toContain('Dados inválidos: O e-mail do munícipe deve ser um formato válido');
    });

    // --- Teste 3.C. Erro (Já Retirou) ---
    it('deve falhar a retirada se o munícipe já tiver retirado o mesmo medicamento (409)', async () => {
        // 1. Simula a primeira retirada (sucesso)
        await request(app).post('/retirada').type('form').send(validData);

        // 2. Tenta a segunda retirada
        const response = await request(app)
            .post('/retirada')
            .type('form')
            .send(validData)
            .expect(302); // Redireciona mesmo com 409

        const homeResponse = await request(app).get(response.header.location);
        
        const mensagemErro = getElementById(homeResponse.text, 'mensagem-erro');
        
        // Verifica se a mensagem de retirada duplicada está presente
        expect(mensagemErro).not.toBeNull();
        expect(mensagemErro).toContain('já retirou o medicamento Dipirona 1g e não pode retirar novamente.');
    });

    // --- Teste 3.C. Erro (Estoque Insuficiente) ---
    it('deve falhar a retirada se o estoque for zero', async () => {
        const lowStockData = { medicamento_id: 4, email_municipe: 'teste.estoque@email.com' }; // Ibuprofeno (estoque 1)
        
        // 1. Primeira retirada (zera o estoque)
        await request(app).post('/retirada').type('form').send(lowStockData); // Estoque vai para 0

        // 2. Tenta a segunda retirada (falha)
        const response = await request(app)
            .post('/retirada')
            .type('form')
            .send(lowStockData)
            .expect(302);
            
        const homeResponse = await request(app).get(response.header.location);
        
        const mensagemErro = getElementById(homeResponse.text, 'mensagem-erro');
        
        // Verifica se a mensagem de estoque insuficiente está presente
        expect(mensagemErro).not.toBeNull();
        expect(mensagemErro).toContain('não possui estoque disponível para retirada.');
    });
});

// describe('Requisito 5: Tratamento de Erros Gerais', () => {
//     // --- Teste 5. Rota Não Encontrada (404) ---
//     it('deve retornar 404 para rotas inexistentes', async () => {
//         const response = await request(app).get('/rota-que-nao-existe');
//         expect(response.statusCode).toBe(404);
//         expect(response.text).toContain('404: Rota Não Encontrada');
//     });

//     // --- Teste 5. Erro Interno (500) ---
//     // NOTA: Para simular um 500 real de DB, precisaríamos desconectar o banco no meio do teste, o que é complexo.
//     // Vamos testar o caso de um ID que não faz sentido, mas que é pego pelo Model.
//     it('deve retornar 400/mensagem de erro para ID de medicamento inexistente', async () => {
//         const nonExistentId = 999;
//         const data = { medicamento_id: nonExistentId, email_municipe: 'erro.db@email.com' };

//         const response = await request(app)
//             .post('/retirada')
//             .send(data)
//             .expect(302);

//         const homeResponse = await request(app).get(response.header.location);
//         const mensagemErro = getElementById(homeResponse.text, 'mensagem-erro');

//         // Verifica o tratamento do erro 400/ID Inválido dentro do Controller
//         expect(mensagemErro).not.toBeNull();
//         expect(mensagemErro).toContain(`Medicamento com ID ${nonExistentId} não encontrado no sistema.`);
//     });
// });
