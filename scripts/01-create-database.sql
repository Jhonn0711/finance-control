-- Script para criar o banco de dados de gerenciamento financeiro pessoal
-- Execute este script no phpMyAdmin

CREATE DATABASE IF NOT EXISTS financeiro_pessoal
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE financeiro_pessoal;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB;

-- Tabela de categorias de receitas
CREATE TABLE IF NOT EXISTS categorias_receitas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nome VARCHAR(50) NOT NULL,
    cor VARCHAR(7) DEFAULT '#10b981',
    icone VARCHAR(50) DEFAULT 'dollar-sign',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id)
) ENGINE=InnoDB;

-- Tabela de categorias de despesas
CREATE TABLE IF NOT EXISTS categorias_despesas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nome VARCHAR(50) NOT NULL,
    cor VARCHAR(7) DEFAULT '#ef4444',
    icone VARCHAR(50) DEFAULT 'shopping-cart',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id)
) ENGINE=InnoDB;

-- Tabela de receitas
CREATE TABLE IF NOT EXISTS receitas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    categoria_id INT,
    descricao VARCHAR(200) NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    data_recebimento DATE NOT NULL,
    tipo ENUM('fixa', 'variavel') DEFAULT 'variavel',
    recorrente BOOLEAN DEFAULT FALSE,
    frequencia ENUM('mensal', 'semanal', 'anual') DEFAULT 'mensal',
    observacoes TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES categorias_receitas(id) ON DELETE SET NULL,
    INDEX idx_usuario_data (usuario_id, data_recebimento),
    INDEX idx_tipo (tipo)
) ENGINE=InnoDB;

-- Tabela de despesas
CREATE TABLE IF NOT EXISTS despesas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    categoria_id INT,
    descricao VARCHAR(200) NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    data_pagamento DATE NOT NULL,
    tipo ENUM('fixa', 'variavel') DEFAULT 'variavel',
    recorrente BOOLEAN DEFAULT FALSE,
    frequencia ENUM('mensal', 'semanal', 'anual') DEFAULT 'mensal',
    pago BOOLEAN DEFAULT FALSE,
    observacoes TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES categorias_despesas(id) ON DELETE SET NULL,
    INDEX idx_usuario_data (usuario_id, data_pagamento),
    INDEX idx_tipo (tipo),
    INDEX idx_pago (pago)
) ENGINE=InnoDB;

-- Tabela de financiamentos
CREATE TABLE IF NOT EXISTS financiamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    tipo ENUM('casa', 'carro', 'outro') NOT NULL,
    descricao VARCHAR(200) NOT NULL,
    valor_total DECIMAL(12, 2) NOT NULL,
    valor_entrada DECIMAL(12, 2) DEFAULT 0,
    valor_financiado DECIMAL(12, 2) NOT NULL,
    taxa_juros DECIMAL(5, 2) NOT NULL,
    numero_parcelas INT NOT NULL,
    valor_parcela DECIMAL(10, 2) NOT NULL,
    parcelas_pagas INT DEFAULT 0,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    observacoes TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario_ativo (usuario_id, ativo),
    INDEX idx_tipo (tipo)
) ENGINE=InnoDB;

-- Tabela de parcelas de financiamento
CREATE TABLE IF NOT EXISTS parcelas_financiamento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    financiamento_id INT NOT NULL,
    numero_parcela INT NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    data_vencimento DATE NOT NULL,
    data_pagamento DATE,
    pago BOOLEAN DEFAULT FALSE,
    valor_pago DECIMAL(10, 2),
    juros_atraso DECIMAL(10, 2) DEFAULT 0,
    FOREIGN KEY (financiamento_id) REFERENCES financiamentos(id) ON DELETE CASCADE,
    INDEX idx_financiamento (financiamento_id),
    INDEX idx_vencimento (data_vencimento),
    INDEX idx_pago (pago)
) ENGINE=InnoDB;

-- Tabela de metas financeiras
CREATE TABLE IF NOT EXISTS metas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    valor_alvo DECIMAL(10, 2) NOT NULL,
    valor_atual DECIMAL(10, 2) DEFAULT 0,
    data_inicio DATE NOT NULL,
    data_alvo DATE NOT NULL,
    concluida BOOLEAN DEFAULT FALSE,
    data_conclusao DATE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario_concluida (usuario_id, concluida)
) ENGINE=InnoDB;

-- Tabela de alertas
CREATE TABLE IF NOT EXISTS alertas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    tipo ENUM('despesa_alta', 'meta_proxima', 'parcela_vencendo', 'orcamento_excedido', 'saldo_negativo') NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    mensagem TEXT NOT NULL,
    lido BOOLEAN DEFAULT FALSE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario_lido (usuario_id, lido),
    INDEX idx_tipo (tipo)
) ENGINE=InnoDB;

-- Tabela de orçamentos mensais
CREATE TABLE IF NOT EXISTS orcamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    categoria_despesa_id INT,
    mes INT NOT NULL,
    ano INT NOT NULL,
    valor_planejado DECIMAL(10, 2) NOT NULL,
    valor_gasto DECIMAL(10, 2) DEFAULT 0,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_despesa_id) REFERENCES categorias_despesas(id) ON DELETE CASCADE,
    UNIQUE KEY unique_orcamento (usuario_id, categoria_despesa_id, mes, ano),
    INDEX idx_usuario_periodo (usuario_id, ano, mes)
) ENGINE=InnoDB;
