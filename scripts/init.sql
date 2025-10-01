-- Criar o banco de dados se ele não existir
DROP DATABASE IF EXISTS eleicao;
CREATE DATABASE IF NOT EXISTS eleicao;
USE eleicao;

-- Tabela de candidatos
CREATE TABLE IF NOT EXISTS candidatos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_candidato VARCHAR(255) NOT NULL,
    numero_candidato INT NOT NULL UNIQUE, -- Adicionado UNIQUE para id_candidato ser chave de identificação
    votos INT DEFAULT 0
);

-- Tabela de votantes
CREATE TABLE IF NOT EXISTS votantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE
);

-- Inserção de dados iniciais dos candidatos
INSERT INTO candidatos (nome_candidato, numero_candidato, votos) VALUES
('Maria Silva', 1, 0),
('João Santos', 2, 0),
('Ana Oliveira', 3, 0)
ON DUPLICATE KEY UPDATE nome_candidato=VALUES(nome_candidato);

-- Inserção de dados iniciais de votantes (opcional para testes, mas manter como no requisito)
INSERT INTO votantes (email) VALUES
('joao@example.com'),
('maria@example.com'),
('ana@example.com')
ON DUPLICATE KEY UPDATE email=email; -- Apenas para evitar erro se já existirem

GRANT ALL PRIVILEGES ON cadastro.* TO 'admin'@'%';
