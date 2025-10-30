# Sistema de Gerenciamento Financeiro Pessoal

Sistema completo para controle de finanças pessoais, desenvolvido para ajudar pessoas a organizarem suas receitas, despesas e saírem do vermelho.

## 🎯 Objetivo

Fornecer o maior auxílio possível para controle financeiro pessoal, com foco em:
- Visualização clara da situação financeira
- Identificação de gastos desnecessários
- Planejamento de orçamento
- Controle de financiamentos
- Estabelecimento e acompanhamento de metas

## 🏗️ Arquitetura

### Frontend
- **React** - Interface moderna e responsiva
- **Recharts** - Gráficos interativos
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI

### Backend
- **Node.js** - Servidor
- **Express** - Framework web
- **MySQL** - Banco de dados
- **JWT** - Autenticação

## 📊 Funcionalidades

### 1. Dashboard Principal
- Visão geral do saldo atual
- Receitas vs Despesas do mês
- Alertas importantes
- Gráfico de evolução financeira

### 2. Gestão de Receitas
- Cadastro de receitas fixas (salário, aluguel recebido)
- Cadastro de receitas variáveis (freelance, bônus)
- Categorização personalizada
- Histórico completo

### 3. Gestão de Despesas
- Despesas fixas (aluguel, contas)
- Despesas variáveis (compras, lazer)
- Controle de pagamentos
- Categorização e análise

### 4. Financiamentos
- Cadastro de financiamentos (casa, carro)
- Controle de parcelas
- Cálculo de juros
- Projeção de quitação

### 5. Análises e Gráficos
- Gráfico de pizza por categoria
- Evolução temporal de gastos
- Comparativo mensal
- Identificação de padrões

### 6. Metas Financeiras
- Definição de objetivos
- Acompanhamento de progresso
- Sugestões de economia

### 7. Alertas Inteligentes
- Despesas acima da média
- Parcelas vencendo
- Orçamento excedido
- Saldo negativo

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais:
- `usuarios` - Dados dos usuários
- `receitas` - Todas as receitas
- `despesas` - Todas as despesas
- `categorias_receitas` - Categorias de receitas
- `categorias_despesas` - Categorias de despesas
- `financiamentos` - Financiamentos ativos
- `parcelas_financiamento` - Controle de parcelas
- `metas` - Metas financeiras
- `alertas` - Sistema de notificações
- `orcamentos` - Planejamento mensal

## 🚀 Como Instalar

### 1. Configurar Banco de Dados
1. Abra o phpMyAdmin
2. Execute o script `scripts/01-create-database.sql`
3. Execute o script `scripts/02-seed-categories.sql`

### 2. Configurar Backend (próxima etapa)
\`\`\`bash
cd backend
npm install
npm start
\`\`\`

### 3. Configurar Frontend (próxima etapa)
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

## 💡 Conceitos Financeiros Aplicados

### Regra 50-30-20
- 50% para necessidades (moradia, alimentação, transporte)
- 30% para desejos (lazer, entretenimento)
- 20% para poupança e investimentos

### Fundo de Emergência
- Meta: 6 meses de despesas fixas
- Prioridade máxima antes de investimentos

### Controle de Dívidas
- Método Bola de Neve: pagar dívidas menores primeiro
- Método Avalanche: pagar dívidas com maior juros primeiro

### Orçamento Base Zero
- Cada real tem uma função definida
- Receita - Despesas = 0

## 📈 Indicadores Financeiros

- **Taxa de Poupança**: (Receitas - Despesas) / Receitas × 100
- **Índice de Endividamento**: Dívidas / Receita Mensal
- **Saúde Financeira**: Score baseado em múltiplos fatores

## 🎨 Design System

O sistema utiliza uma paleta de cores profissional:
- **Verde**: Receitas e saldo positivo
- **Vermelho**: Despesas e alertas
- **Azul**: Informações e ações
- **Cinza**: Elementos neutros

## 📱 Responsividade

Interface totalmente responsiva, funcionando perfeitamente em:
- Desktop
- Tablet
- Mobile

## 🔐 Segurança

- Senhas criptografadas com bcrypt
- Autenticação JWT
- Proteção contra SQL Injection
- Validação de dados no frontend e backend

## 📝 Próximos Passos

1. ✅ Estrutura do banco de dados
2. ⏳ Backend Node.js com API REST
3. ⏳ Dashboard principal
4. ⏳ Gestão de receitas e despesas
5. ⏳ Sistema de financiamentos
6. ⏳ Gráficos e análises
7. ⏳ Sistema de alertas e metas

---

**Desenvolvido com foco em educação financeira e controle de gastos**
