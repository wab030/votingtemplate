-- init.sql
-- Script para a criação e inicialização do banco de dados da Avaliação de Desenvolvimento Web 2 (Farmácia Pública).

-- -----------------------------------------------------
-- 1. DROP E CRIAÇÃO DO BANCO DE DADOS
-- -----------------------------------------------------
-- **COMANDO ADICIONADO:** Apaga o banco de dados 'saude' se ele já existir, garantindo um ambiente limpo.
DROP DATABASE IF EXISTS saude;

-- Cria o banco de dados 'saude' e o seleciona para uso.
CREATE DATABASE saude CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE saude;

-- -----------------------------------------------------
-- 2. CRIAÇÃO DA TABELA MEDICAMENTOS
-- -----------------------------------------------------
-- Armazena o cadastro dos medicamentos e a quantidade em estoque.
CREATE TABLE medicamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_medicamento VARCHAR(255) NOT NULL,
    quantidade INT NOT NULL DEFAULT 0
);

-- -----------------------------------------------------
-- 3. CRIAÇÃO DA TABELA RETIRADAS
-- -----------------------------------------------------
-- Registra quem (e-mail) retirou qual medicamento para evitar duplicidade.
CREATE TABLE retiradas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email_municipe VARCHAR(255) NOT NULL COMMENT 'E-mail do munícipe que retirou o medicamento (chave para evitar duplicidade)',
    medicamento_id INT NOT NULL,
    data_retirada DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Chave estrangeira
    FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id),
    
    -- Restrição UNIQUE para a retirada duplicada (quem pegou o quê)
    UNIQUE INDEX idx_unica_retirada (email_municipe, medicamento_id)
);

-- -----------------------------------------------------
-- 4. INCLUSÃO DE DADOS INICIAIS
-- -----------------------------------------------------
-- Dados de teste para iniciar o estoque.
INSERT INTO medicamentos (nome_medicamento, quantidade) VALUES
('Paracetamol 500mg', 15),
('Dipirona 1g', 5),
('Amoxicilina 500mg', 2),
('Ibuprofeno 600mg', 1);

-- 5. CRIAÇÃO E CONCESSÃO DE PRIVILÉGIOS PARA O USUÁRIO 'admin'
-- Isso garante que o usuário de teste exista, independentemente das variáveis de ambiente do Docker.
DROP USER IF EXISTS 'admin'@'%'; -- Limpa qualquer resquício
CREATE USER 'admin'@'%' IDENTIFIED BY 'ifsp@1234'; -- Cria o usuário com a senha do pipeline (test.yml)
GRANT ALL PRIVILEGES ON saude.* TO 'admin'@'%'; -- Concede privilégios no banco 'saude'
FLUSH PRIVILEGES; -- Aplica as mudanças imediatamente

-- -----------------------------------------------------
-- FIM DO SCRIPT DE INICIALIZAÇÃO
-- -----------------------------------------------------