CREATE DATABASE IF NOT EXISTS saude;
USE saude;

CREATE TABLE medicamentos (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nome_medicamento VARCHAR(255) NOT NULL,
	quantidade INT NOT NULL DEFAULT 0
);

CREATE TABLE retiradas (
	id INT AUTO_INCREMENT PRIMARY KEY,
	email_municipe VARCHAR(255) NOT NULL,
	medicamento_id INT NOT NULL,
	data_retirada DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id)
);

INSERT INTO medicamentos (nome_medicamento, quantidade) VALUES
('Paracetamol 500mg', 15),
('Dipirona 1g', 5),
('Amoxicilina 500mg', 2),
('Ibuprofeno 600mg', 1);