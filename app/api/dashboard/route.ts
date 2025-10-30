import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const usuarioId = searchParams.get("usuario_id") || 1
    const mes = searchParams.get("mes") || new Date().getMonth() + 1
    const ano = searchParams.get("ano") || new Date().getFullYear()

    // Total de receitas do mês
    const [receitasResult] = await query<any[]>(
      `SELECT COALESCE(SUM(valor), 0) as total 
       FROM receitas 
       WHERE usuario_id = ? AND MONTH(data_recebimento) = ? AND YEAR(data_recebimento) = ? AND ativo = 1`,
      [usuarioId, mes, ano],
    )

    // Total de despesas do mês
    const [despesasResult] = await query<any[]>(
      `SELECT COALESCE(SUM(valor), 0) as total 
       FROM despesas 
       WHERE usuario_id = ? AND MONTH(data_pagamento) = ? AND YEAR(data_pagamento) = ? AND ativo = 1`,
      [usuarioId, mes, ano],
    )

    // Despesas por categoria
    const despesasPorCategoria = await query<any[]>(
      `SELECT c.nome, c.cor, COALESCE(SUM(d.valor), 0) as total 
       FROM categorias c
       LEFT JOIN despesas d ON c.id = d.categoria_id AND d.usuario_id = ? AND MONTH(d.data_pagamento) = ? AND YEAR(d.data_pagamento) = ? AND d.ativo = 1
       WHERE c.tipo = 'despesa'
       GROUP BY c.id, c.nome, c.cor
       HAVING total > 0
       ORDER BY total DESC`,
      [usuarioId, mes, ano],
    )

    // Financiamentos ativos
    const financiamentos = await query<any[]>(
      `SELECT tipo, descricao, valor_parcela, numero_parcelas, parcelas_pagas 
       FROM financiamentos 
       WHERE usuario_id = ? AND ativo = 1`,
      [usuarioId],
    )

    // Alertas não lidos
    const alertas = await query<any[]>(
      `SELECT * FROM alertas 
       WHERE usuario_id = ? AND lido = 0 
       ORDER BY data_criacao DESC 
       LIMIT 5`,
      [usuarioId],
    )

    const totalReceitas = receitasResult.total
    const totalDespesas = despesasResult.total
    const saldo = totalReceitas - totalDespesas

    return NextResponse.json({
      totalReceitas,
      totalDespesas,
      saldo,
      despesasPorCategoria,
      financiamentos,
      alertas,
    })
  } catch (error) {
    console.error("[v0] Erro ao buscar dados do dashboard:", error)
    return NextResponse.json({ error: "Erro ao buscar dados do dashboard" }, { status: 500 })
  }
}
