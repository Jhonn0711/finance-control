import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { categoria_id, descricao, valor, data_pagamento, recorrente, frequencia, pago } = body

    await query(
      `UPDATE despesas 
       SET categoria_id = ?, descricao = ?, valor = ?, data_pagamento = ?, recorrente = ?, frequencia = ?, pago = ?
       WHERE id = ?`,
      [categoria_id, descricao, valor, data_pagamento, recorrente, frequencia, pago, id],
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Erro ao atualizar despesa:", error)
    return NextResponse.json({ error: "Erro ao atualizar despesa" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    await query("UPDATE despesas SET ativo = 0 WHERE id = ?", [id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Erro ao deletar despesa:", error)
    return NextResponse.json({ error: "Erro ao deletar despesa" }, { status: 500 })
  }
}
