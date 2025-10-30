-- Script para popular categorias padrão
-- Execute após criar as tabelas

USE financeiro_pessoal;

-- Inserir usuário de exemplo (senha: demo123 - hash bcrypt)
INSERT INTO usuarios (nome, email, senha) VALUES
('Usuário Demo', 'demo@financeiro.com', '$2b$10$rKvVPZqGhXxJZqKZqKZqKOqKZqKZqKZqKZqKZqKZqKZqKZqKZqKZq');

-- Pegar o ID do usuário demo
SET @usuario_id = LAST_INSERT_ID();

-- Categorias de receitas padrão
INSERT INTO categorias_receitas (usuario_id, nome, cor, icone) VALUES
(@usuario_id, 'Salário', '#10b981', 'briefcase'),
(@usuario_id, 'Freelance', '#3b82f6', 'laptop'),
(@usuario_id, 'Investimentos', '#8b5cf6', 'trending-up'),
(@usuario_id, 'Aluguel Recebido', '#f59e0b', 'home'),
(@usuario_id, 'Outros', '#6b7280', 'dollar-sign');

-- Categorias de despesas padrão
INSERT INTO categorias_despesas (usuario_id, nome, cor, icone) VALUES
(@usuario_id, 'Moradia', '#ef4444', 'home'),
(@usuario_id, 'Alimentação', '#f97316', 'utensils'),
(@usuario_id, 'Transporte', '#eab308', 'car'),
(@usuario_id, 'Saúde', '#ec4899', 'heart'),
(@usuario_id, 'Educação', '#3b82f6', 'book'),
(@usuario_id, 'Lazer', '#8b5cf6', 'smile'),
(@usuario_id, 'Contas Fixas', '#6366f1', 'file-text'),
(@usuario_id, 'Vestuário', '#14b8a6', 'shopping-bag'),
(@usuario_id, 'Outros', '#6b7280', 'more-horizontal');

-- Exemplos de despesas fixas
INSERT INTO despesas (usuario_id, categoria_id, descricao, valor, data_pagamento, tipo, recorrente, frequencia, pago) VALUES
(@usuario_id, (SELECT id FROM categorias_despesas WHERE nome = 'Moradia' AND usuario_id = @usuario_id), 'Aluguel', 1200.00, CURDATE(), 'fixa', TRUE, 'mensal', FALSE),
(@usuario_id, (SELECT id FROM categorias_despesas WHERE nome = 'Contas Fixas' AND usuario_id = @usuario_id), 'Internet', 99.90, CURDATE(), 'fixa', TRUE, 'mensal', FALSE),
(@usuario_id, (SELECT id FROM categorias_despesas WHERE nome = 'Contas Fixas' AND usuario_id = @usuario_id), 'Energia Elétrica', 150.00, CURDATE(), 'fixa', TRUE, 'mensal', FALSE),
(@usuario_id, (SELECT id FROM categorias_despesas WHERE nome = 'Contas Fixas' AND usuario_id = @usuario_id), 'Água', 80.00, CURDATE(), 'fixa', TRUE, 'mensal', FALSE);

-- Exemplo de receita fixa
INSERT INTO receitas (usuario_id, categoria_id, descricao, valor, data_recebimento, tipo, recorrente, frequencia) VALUES
(@usuario_id, (SELECT id FROM categorias_receitas WHERE nome = 'Salário' AND usuario_id = @usuario_id), 'Salário Mensal', 3500.00, CURDATE(), 'fixa', TRUE, 'mensal');

-- Exemplo de financiamento de carro
INSERT INTO financiamentos (usuario_id, tipo, descricao, valor_total, valor_entrada, valor_financiado, taxa_juros, numero_parcelas, valor_parcela, data_inicio, data_fim) VALUES
(@usuario_id, 'carro', 'Financiamento Honda Civic 2023', 85000.00, 25000.00, 60000.00, 1.99, 48, 1450.00, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 48 MONTH));

-- Criar parcelas do financiamento
SET @financiamento_id = LAST_INSERT_ID();

-- Gerar 48 parcelas
INSERT INTO parcelas_financiamento (financiamento_id, numero_parcela, valor, data_vencimento)
SELECT 
    @financiamento_id,
    n,
    1450.00,
    DATE_ADD(CURDATE(), INTERVAL n MONTH)
FROM (
    SELECT 1 n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10
    UNION SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14 UNION SELECT 15 UNION SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19 UNION SELECT 20
    UNION SELECT 21 UNION SELECT 22 UNION SELECT 23 UNION SELECT 24 UNION SELECT 25 UNION SELECT 26 UNION SELECT 27 UNION SELECT 28 UNION SELECT 29 UNION SELECT 30
    UNION SELECT 31 UNION SELECT 32 UNION SELECT 33 UNION SELECT 34 UNION SELECT 35 UNION SELECT 36 UNION SELECT 37 UNION SELECT 38 UNION SELECT 39 UNION SELECT 40
    UNION SELECT 41 UNION SELECT 42 UNION SELECT 43 UNION SELECT 44 UNION SELECT 45 UNION SELECT 46 UNION SELECT 47 UNION SELECT 48
) numbers;

-- Exemplo de meta financeira
INSERT INTO metas (usuario_id, titulo, descricao, valor_alvo, valor_atual, data_inicio, data_alvo) VALUES
(@usuario_id, 'Fundo de Emergência', 'Reserva de 6 meses de despesas', 18000.00, 5000.00, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 12 MONTH));
