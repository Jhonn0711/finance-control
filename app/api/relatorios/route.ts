import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const usuarioId = searchParams.get("usuario_id") || 1
    const ano = searchParams.get("ano") || new Date().getFullYear()

    // Receitas e despesas por mês
    const receitasPorMes = await query<any[]>(
      `SELECT 
        MONTH(data_recebimento) as mes,
        COALESCE(SUM(valor), 0) as total
       FROM receitas 
       WHERE usuario_id = ? AND YEAR(data_recebimento) = ? AND ativo = 1
       GROUP BY MONTH(data_recebimento)
       ORDER BY mes`,
      [usuarioId, ano],
    )

    const despesasPorMes = await query<any[]>(
      `SELECT 
        MONTH(data_pagamento) as mes,
        COALESCE(SUM(valor), 0) as total
       FROM despesas 
       WHERE usuario_id = ? AND YEAR(data_pagamento) = ? AND ativo = 1
       GROUP BY MONTH(data_pagamento)
       ORDER BY mes`,
      [usuarioId, ano],
    )

    // Preencher todos os meses
    const meses = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ]

    const fluxoCaixa = meses.map((nome, index) => {
      const mes = index + 1
      const receita = receitasPorMes.find((r) => r.mes === mes)?.total || 0
      const despesa = despesasPorMes.find((d) => d.mes === mes)?.total || 0
      return {
        mes: nome,
        receitas: Number(receita),
        despesas: Number(despesa),
        saldo: Number(receita) - Number(despesa),
      }
    })

    // Despesas por categoria (ano todo)
    const despesasPorCategoria = await query<any[]>(
      `SELECT 
        c.nome,
        c.cor,
        COALESCE(SUM(d.valor), 0) as total,
        COUNT(d.id) as quantidade
       FROM categorias c
       LEFT JOIN despesas d ON c.id = d.categoria_id 
         AND d.usuario_id = ? 
         AND YEAR(d.data_pagamento) = ? 
         AND d.ativo = 1
       WHERE c.tipo = 'despesa'
       GROUP BY c.id, c.nome, c.cor
       HAVING total > 0
       ORDER BY total DESC`,
      [usuarioId, ano],
    )

    // Receitas por categoria (ano todo)
    const receitasPorCategoria = await query<any[]>(
      `SELECT 
        c.nome,
        c.cor,
        COALESCE(SUM(r.valor), 0) as total,
        COUNT(r.id) as quantidade
       FROM categorias c
       LEFT JOIN receitas r ON c.id = r.categoria_id 
         AND r.usuario_id = ? 
         AND YEAR(r.data_recebimento) = ? 
         AND r.ativo = 1
       WHERE c.tipo = 'receita'
       GROUP BY c.id, c.nome, c.cor
       HAVING total > 0
       ORDER BY total DESC`,
      [usuarioId, ano],
    )

    // Estatísticas gerais
    const [estatisticas] = await query<any[]>(
      `SELECT 
        (SELECT COALESCE(SUM(valor), 0) FROM receitas WHERE usuario_id = ? AND YEAR(data_recebimento) = ? AND ativo = 1) as total_receitas,
        (SELECT COALESCE(SUM(valor), 0) FROM despesas WHERE usuario_id = ? AND YEAR(data_pagamento) = ? AND ativo = 1) as total_despesas,
        (SELECT COALESCE(AVG(valor), 0) FROM receitas WHERE usuario_id = ? AND YEAR(data_recebimento) = ? AND ativo = 1) as media_receitas,
        (SELECT COALESCE(AVG(valor), 0) FROM despesas WHERE usuario_id = ? AND YEAR(data_pagamento) = ? AND ativo = 1) as media_despesas`,
      [usuarioId, ano, usuarioId, ano, usuarioId, ano, usuarioId, ano],
    )

    // Despesas recorrentes vs avulsas
    const [tiposDespesas] = await query<any[]>(
      `SELECT 
        COALESCE(SUM(CASE WHEN recorrente = 1 THEN valor ELSE 0 END), 0) as recorrentes,
        COALESCE(SUM(CASE WHEN recorrente = 0 THEN valor ELSE 0 END), 0) as avulsas
       FROM despesas 
       WHERE usuario_id = ? AND YEAR(data_pagamento) = ? AND ativo = 1`,
      [usuarioId, ano],
    )

    return NextResponse.json({
      fluxoCaixa,
      despesasPorCategoria,
      receitasPorCategoria,
      estatisticas: {
        ...estatisticas,
        total_receitas: Number(estatisticas.total_receitas),
        total_despesas: Number(estatisticas.total_despesas),
        media_receitas: Number(estatisticas.media_receitas),
        media_despesas: Number(estatisticas.media_despesas),
        saldo_anual: Number(estatisticas.total_receitas) - Number(estatisticas.total_despesas),
      },
      tiposDespesas: {
        recorrentes: Number(tiposDespesas.recorrentes),
        avulsas: Number(tiposDespesas.avulsas),
      },
    })
  } catch (error) {
    console.error("[v0] Erro ao buscar relatórios:", error)
    return NextResponse.json({ error: "Erro ao buscar relatórios" }, { status: 500 })
  }
}
