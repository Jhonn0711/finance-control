# 💰 Sistema de Controle Financeiro Pessoal

Um sistema web completo para gestão de finanças pessoais, que permite ao usuário visualizar e controlar entradas, saídas, saldo, gastos por categoria, e prever o próximo salário.

---

## 📌 Tecnologias Utilizadas

### Frontend:
- HTML5
- CSS3
- [Bootstrap 5](https://getbootstrap.com/)
- JavaScript Vanilla
- SweetAlert2 (alertas e feedbacks)

### Backend:
- Node.js
- Express.js
- Supabase (autenticação + banco de dados PostgreSQL)

---

## 🎯 Funcionalidades Principais

### 🔐 Autenticação
- Login e cadastro com e-mail e senha via Supabase
- Proteção de rotas autenticadas

### 📥 Lançamento de Transações
- Entradas e saídas com:
  - Descrição
  - Valor
  - Data
  - Categoria
  - Tipo (`entrada` ou `saída`)

### 💼 Previsão de Salário
- Cadastro do próximo salário
- Cálculo automático de dias e valor restante até o pagamento

### 📊 Painel Financeiro
- Saldo atual
- Total de entradas e saídas do mês
- Dias restantes até o próximo salário
- Gráfico de pizza (distribuição por categoria)
- Gráfico de linha (evolução do saldo)

### 🔎 Filtros e Recursos Adicionais
- Filtro por período: últimos 7 dias, mês atual, período personalizado
- Exportar transações em `.CSV`
- Editar e excluir lançamentos

