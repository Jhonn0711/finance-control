import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string; parcelaId: string }> }) {
  try {
    const { parcelaId } = await params
    const body = await request.json()
    const { pago, data_pagamento } = body

    await query(
      `UPDATE parcelas_financiamento 
       SET pago = ?, data_pagamento = ?
       WHERE id = ?`,
      [pago, data_pagamento, parcelaId],
    )

    // Atualizar contador de parcelas pagas no financiamento
    if (pago) {
      await query(
        `UPDATE financiamentos f
         SET parcelas_pagas = (
           SELECT COUNT(*) FROM parcelas_financiamento 
           WHERE financiamento_id = f.id AND pago = 1
         )
         WHERE id = (SELECT financiamento_id FROM parcelas_financiamento WHERE id = ?)`,
        [parcelaId],
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Erro ao atualizar parcela:", error)
    return NextResponse.json({ error: "Erro ao atualizar parcela" }, { status: 500 })
  }
}
