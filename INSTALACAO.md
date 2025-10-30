# 🚀 Guia de Instalação - Sistema de Gestão Financeira Pessoal

## Pré-requisitos

- Node.js 18+ instalado
- MySQL instalado (XAMPP, WAMP, ou MySQL standalone)
- phpMyAdmin (geralmente vem com XAMPP/WAMP)

## Passo 1: Configurar o Banco de Dados MySQL

### 1.1 Abrir phpMyAdmin
- Acesse: `http://localhost/phpmyadmin`
- Faça login (usuário padrão: `root`, senha: vazia ou `root`)

### 1.2 Executar Scripts SQL
1. Abra o arquivo `scripts/01-create-database.sql`
2. Copie todo o conteúdo
3. No phpMyAdmin, clique na aba **SQL**
4. Cole o conteúdo e clique em **Executar**
5. Repita o processo com `scripts/02-seed-categories.sql`

✅ Seu banco de dados `financeiro_pessoal` está criado!

## Passo 2: Baixar o Código

### Opção A: Via v0 (Recomendado)
1. Clique nos **três pontos** no canto superior direito
2. Selecione **"Download ZIP"**
3. Extraia o arquivo ZIP em uma pasta de sua escolha

### Opção B: Via GitHub
1. Clique no botão **GitHub** no canto superior direito
2. Clone o repositório criado

## Passo 3: Configurar Variáveis de Ambiente

1. Na pasta do projeto, copie o arquivo `.env.example` e renomeie para `.env`
2. Edite o arquivo `.env` com suas credenciais MySQL:

\`\`\`env
# Configuração do Banco de Dados MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=financeiro_pessoal
\`\`\`

**Importante:** Ajuste `DB_PASSWORD` se você configurou uma senha no MySQL.

## Passo 4: Instalar Dependências

Abra o terminal na pasta do projeto e execute:

\`\`\`bash
npm install
\`\`\`

Isso vai instalar todas as dependências necessárias, incluindo:
- Next.js (React framework)
- mysql2 (conexão com MySQL)
- Recharts (gráficos)
- Tailwind CSS (estilização)
- shadcn/ui (componentes)

## Passo 5: Executar o Sistema

\`\`\`bash
npm run dev
\`\`\`

O sistema estará disponível em: **http://localhost:3000**

## 🎯 Testando o Sistema

### 1. Dashboard
- Acesse `http://localhost:3000`
- Veja o resumo financeiro com saldo, receitas e despesas

### 2. Adicionar Receita
- Vá em **Receitas** no menu lateral
- Clique em **+ Nova Receita**
- Preencha: descrição, valor, data, categoria
- Marque se é recorrente (salário, por exemplo)

### 3. Adicionar Despesa
- Vá em **Despesas**
- Clique em **+ Nova Despesa**
- Escolha entre despesa fixa (aluguel, internet) ou avulsa
- Marque se é recorrente

### 4. Criar Financiamento
- Vá em **Financiamentos**
- Clique em **+ Novo Financiamento**
- Preencha: tipo (casa/carro), valor total, entrada, taxa de juros, parcelas
- O sistema calcula automaticamente as parcelas com juros compostos

### 5. Ver Relatórios
- Vá em **Relatórios**
- Veja gráficos de:
  - Fluxo de caixa mensal
  - Despesas por categoria
  - Receitas por categoria
  - Despesas fixas vs avulsas

### 6. Criar Metas
- Vá em **Metas**
- Defina objetivos financeiros (ex: "Economizar R$ 10.000 para viagem")
- Acompanhe o progresso

### 7. Configurar Alertas
- Vá em **Alertas**
- Configure notificações para:
  - Orçamento excedido
  - Parcelas vencendo
  - Metas próximas de serem alcançadas

## 🔧 Solução de Problemas

### Erro de Conexão com MySQL
\`\`\`
Error: connect ECONNREFUSED 127.0.0.1:3306
\`\`\`
**Solução:** Verifique se o MySQL está rodando. No XAMPP, inicie o módulo MySQL.

### Erro "Database not found"
\`\`\`
Error: Unknown database 'financeiro_pessoal'
\`\`\`
**Solução:** Execute os scripts SQL no phpMyAdmin (Passo 1.2).

### Erro de Autenticação
\`\`\`
Error: Access denied for user 'root'@'localhost'
\`\`\`
**Solução:** Verifique usuário e senha no arquivo `.env`.

### Porta 3000 já está em uso
\`\`\`
Error: Port 3000 is already in use
\`\`\`
**Solução:** Execute `npm run dev -- -p 3001` para usar outra porta.

## 📊 Estrutura do Projeto

\`\`\`
financeiro-pessoal/
├── app/                    # Páginas Next.js
│   ├── api/               # Backend API (Node.js)
│   ├── receitas/          # Página de receitas
│   ├── despesas/          # Página de despesas
│   ├── financiamentos/    # Página de financiamentos
│   ├── relatorios/        # Página de relatórios
│   ├── metas/             # Página de metas
│   └── alertas/           # Página de alertas
├── components/            # Componentes React reutilizáveis
├── lib/                   # Utilitários e conexão com DB
├── scripts/               # Scripts SQL
└── .env                   # Configurações (criar a partir do .env.example)
\`\`\`

## 🎓 Conceitos Financeiros Implementados

O sistema segue as melhores práticas de gestão financeira pessoal:

### 1. **Regra 50-30-20**
- 50% para necessidades (despesas fixas)
- 30% para desejos (despesas variáveis)
- 20% para poupança/investimentos

### 2. **Controle de Fluxo de Caixa**
- Acompanhamento mensal de entradas e saídas
- Identificação de meses no vermelho

### 3. **Categorização de Despesas**
- Permite identificar onde o dinheiro está sendo gasto
- Facilita cortes estratégicos

### 4. **Despesas Fixas vs Variáveis**
- Fixas: previsíveis e recorrentes (aluguel, internet)
- Variáveis: podem ser controladas (lazer, compras)

### 5. **Sistema de Metas SMART**
- Específicas, Mensuráveis, Atingíveis, Relevantes, Temporais

### 6. **Alertas Preventivos**
- Evita surpresas e ajuda a manter o controle

## 🚀 Próximos Passos

Após instalar e testar:

1. **Cadastre suas receitas atuais** (salário, freelances, etc)
2. **Liste todas as despesas fixas** (aluguel, contas, assinaturas)
3. **Adicione despesas variáveis do último mês** para ter uma base
4. **Configure alertas** para orçamentos mensais por categoria
5. **Defina metas financeiras** (emergência, viagem, aposentadoria)
6. **Acompanhe os relatórios semanalmente** para identificar padrões

## 📞 Suporte

Se tiver problemas, verifique:
- MySQL está rodando
- Arquivo `.env` está configurado corretamente
- Scripts SQL foram executados
- Porta 3000 está disponível

---

**Desenvolvido com foco em ajudar pessoas a saírem do vermelho! 💚**
