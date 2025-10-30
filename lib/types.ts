export interface Usuario {
  id: number
  nome: string
  email: string
  senha: string
  salario_mensal: number
  data_cadastro: Date
}

export interface Categoria {
  id: number
  nome: string
  tipo: "receita" | "despesa"
  cor: string
  icone: string
  usuario_id?: number
}

export interface Receita {
  id: number
  usuario_id: number
  categoria_id: number
  descricao: string
  valor: number
  data_recebimento: Date
  recorrente: boolean
  frequencia?: "mensal" | "semanal" | "anual"
  ativo: boolean
  categoria?: Categoria
}

export interface Despesa {
  id: number
  usuario_id: number
  categoria_id: number
  descricao: string
  valor: number
  data_pagamento: Date
  recorrente: boolean
  frequencia?: "mensal" | "semanal" | "anual"
  pago: boolean
  ativo: boolean
  categoria?: Categoria
}

export interface Financiamento {
  id: number
  usuario_id: number
  tipo: "casa" | "carro" | "outro"
  descricao: string
  valor_total: number
  valor_entrada: number
  numero_parcelas: number
  valor_parcela: number
  taxa_juros: number
  data_inicio: Date
  parcelas_pagas: number
  ativo: boolean
}

export interface ParcelaFinanciamento {
  id: number
  financiamento_id: number
  numero_parcela: number
  valor: number
  data_vencimento: Date
  data_pagamento?: Date
  pago: boolean
}

export interface Meta {
  id: number
  usuario_id: number
  descricao: string
  valor_alvo: number
  valor_atual: number
  data_inicio: Date
  data_fim: Date
  ativo: boolean
}

export interface Orcamento {
  id: number
  usuario_id: number
  categoria_id: number
  mes: number
  ano: number
  valor_planejado: number
  valor_gasto: number
  categoria?: Categoria
}

export interface Alerta {
  id: number
  usuario_id: number
  tipo: "orcamento_excedido" | "meta_proxima" | "parcela_vencendo" | "saldo_negativo"
  mensagem: string
  lido: boolean
  data_criacao: Date
}
