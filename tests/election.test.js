const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db'); // Usar a conexão real do DB

const TEST_EMAIL = 'teste.supertest@votacao.com';

const NUMERO_MARIA_SILVA = 13;
const NUMERO_JOAO_SANTOS = 22;
let ID_MARIA_SILVA;
let ID_JOAO_SANTOS;

beforeEach(async () => {
  await db.query('DELETE FROM votantes WHERE email = ?', [TEST_EMAIL]);

  if (NUMERO_MARIA_SILVA && NUMERO_JOAO_SANTOS) {
    await db.query('DELETE FROM candidatos WHERE numero_candidato IN (?, ?)', [
      NUMERO_MARIA_SILVA,
      NUMERO_JOAO_SANTOS,
    ]);
  }

  const [mariaInsert] = await db.query(
    'INSERT INTO candidatos (nome_candidato, numero_candidato, votos) VALUES (?, ?, 0)',
    ['Maria Silva', 13]
  );
  ID_MARIA_SILVA = mariaInsert.insertId;

  const [joaoInsert] = await db.query(
    'INSERT INTO candidatos (nome_candidato, numero_candidato, votos) VALUES (?, ?, 0)',
    ['João Santos', 22]
  );
  ID_JOAO_SANTOS = joaoInsert.insertId;
});

afterAll(async () => {
  await db.query('DELETE FROM votantes WHERE email = ?', [TEST_EMAIL]);
  await db.query('DELETE FROM candidatos WHERE numero_candidato IN (?, ?)', [
    NUMERO_MARIA_SILVA,
    NUMERO_JOAO_SANTOS,
  ]);
  await db.end();
});

describe('Rotas de Eleição (Funcionalidades Principais)', () => {
  it('GET /eleicao/candidatos deve listar os candidatos corretamente', async () => {
    await db.query(
      'UPDATE candidatos SET votos = 1 WHERE numero_candidato = ?',
      [ID_MARIA_SILVA]
    );
    const response = await request(app)
      .get('/eleicao/candidatos')
      .expect('Content-Type', /text\/html/); // **ALTERAÇÃO 1**
    expect(response.statusCode).toBe(200);
    expect(typeof response.text).toBe('string');
    expect(response.text).toContain('Maria Silva');
    // expect(response.text).toContain('1 Votos');
  });

  it('CENÁRIO 1: Deve retornar 200 e a mensagem de "sem líder" quando todos os votos são 0', async () => {
    // Assumimos que o banco de dados está resetado para 0 votos pelo beforeEach

    const response = await request(app)
      .get('/eleicao/lider')
      .expect('Content-Type', /text\/html/) // Esperamos HTML
      .expect(200);

    // O controller renderiza a view passando { leader: null } (devido à lógica no model)
    // Verificamos se a view EJS exibe a mensagem de "sem líder".
    expect(response.text).toContain('Aguardando Votos');
    expect(response.text).not.toContain('Maria Silva');
    expect(response.text).not.toContain('VOTOS');
  });

  it('CENÁRIO 2: Deve retornar 200 e renderizar o candidato com mais votos', async () => {
    // Atualiza os votos no banco de dados para criar um líder (Maria Silva com 12)
    await db.query('UPDATE candidatos SET votos = 5 WHERE id = ?', [
      ID_JOAO_SANTOS,
    ]);
    await db.query('UPDATE candidatos SET votos = 12 WHERE id = ?', [
      ID_MARIA_SILVA,
    ]);

    const response = await request(app)
      .get('/eleicao/lider')
      .expect('Content-Type', /text\/html/) // Esperamos HTML
      .expect(200);

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Maria Silva');
    expect(response.text).toContain('12 VOTOS');
    expect(response.text).not.toContain('5 VOTOS');
    expect(response.text).not.toContain('Aguardando Votos');
  });

  it('POST /eleicao/votar deve registrar um voto válido e retornar 201', async () => {
    await db.query('UPDATE candidatos SET votos = 0');
    await db.query('DELETE FROM votantes WHERE email = ?', [TEST_EMAIL]);

    const response = await request(app)
      .post('/eleicao/votar')
      .send({ email: TEST_EMAIL, id: ID_MARIA_SILVA })
      .expect('Content-Type', /text\/html/) // **ALTERAÇÃO 1**
      .expect(201); // O status 201 é mantido

    expect(response.text).toContain('Voto Registrado com Sucesso!');
    expect(response.text).toContain('Maria Silva');
    expect(response.text).toContain('Você votou na candidata:');

    const [candidato] = await db.query(
      'SELECT votos FROM candidatos WHERE id = ?',
      [ID_MARIA_SILVA]
    );
    expect(candidato[0].votos).toBe(1);

    const [votante] = await db.query(
      'SELECT email FROM votantes WHERE email = ?',
      [TEST_EMAIL]
    );
    expect(votante.length).toBe(1);
  });

  it('POST /eleicao/votar deve retornar 403 para voto duplicado', async () => {
    await request(app)
      .post('/eleicao/votar')
      .send({ email: TEST_EMAIL, id: ID_MARIA_SILVA });

    const response = await request(app)
      .post('/eleicao/votar')
      .send({ email: TEST_EMAIL, id: ID_MARIA_SILVA });

    expect(response.statusCode).toBe(403);
    expect(response.body).toHaveProperty(
      'error',
      'Voto duplicado. Este e-mail já foi registrado.'
    );
  });

  it('POST /eleicao/votar deve retornar 404 para candidato inexistente', async () => {
    const response = await request(app)
      .post('/eleicao/votar')
      .send({ email: 'novo.votante@teste.com', id: 9999 });

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'Candidato não encontrado.');
  });
});
