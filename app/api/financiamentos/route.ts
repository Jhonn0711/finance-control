import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import type { Financiamento } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const usuarioId = searchParams.get("usuario_id") || 1

    const financiamentos = await query<Financiamento[]>(
      `SELECT * FROM financiamentos 
       WHERE usuario_id = ? AND ativo = 1
       ORDER BY data_inicio DESC`,
      [usuarioId],
    )

    return NextResponse.json(financiamentos)
  } catch (error) {
    console.error("[v0] Erro ao buscar financiamentos:", error)
    return NextResponse.json({ error: "Erro ao buscar financiamentos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { usuario_id, tipo, descricao, valor_total, valor_entrada, numero_parcelas, taxa_juros, data_inicio } = body

    // Calcular valor da parcela com juros compostos
    const valorFinanciado = valor_total - valor_entrada
    const taxaMensal = taxa_juros / 100 / 12
    const valorParcela =
      (valorFinanciado * (taxaMensal * Math.pow(1 + taxaMensal, numero_parcelas))) /
      (Math.pow(1 + taxaMensal, numero_parcelas) - 1)

    const result = await query(
      `INSERT INTO financiamentos (usuario_id, tipo, descricao, valor_total, valor_entrada, numero_parcelas, valor_parcela, taxa_juros, data_inicio, parcelas_pagas, ativo) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 1)`,
      [
        usuario_id,
        tipo,
        descricao,
        valor_total,
        valor_entrada,
        numero_parcelas,
        valorParcela.toFixed(2),
        taxa_juros,
        data_inicio,
      ],
    )

    const financiamentoId = (result as any).insertId

    // Criar parcelas
    const dataInicio = new Date(data_inicio)
    for (let i = 1; i <= numero_parcelas; i++) {
      const dataVencimento = new Date(dataInicio)
      dataVencimento.setMonth(dataVencimento.getMonth() + i)

      await query(
        `INSERT INTO parcelas_financiamento (financiamento_id, numero_parcela, valor, data_vencimento, pago) 
         VALUES (?, ?, ?, ?, 0)`,
        [financiamentoId, i, valorParcela.toFixed(2), dataVencimento.toISOString().split("T")[0]],
      )
    }

    return NextResponse.json({ success: true, id: financiamentoId })
  } catch (error) {
    console.error("[v0] Erro ao criar financiamento:", error)
    return NextResponse.json({ error: "Erro ao criar financiamento" }, { status: 500 })
  }
}
