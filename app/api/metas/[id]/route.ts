import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { descricao, valor_alvo, valor_atual, data_inicio, data_fim } = body

    await query(
      `UPDATE metas 
       SET descricao = ?, valor_alvo = ?, valor_atual = ?, data_inicio = ?, data_fim = ?
       WHERE id = ?`,
      [descricao, valor_alvo, valor_atual, data_inicio, data_fim, id],
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Erro ao atualizar meta:", error)
    return NextResponse.json({ error: "Erro ao atualizar meta" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    await query("UPDATE metas SET ativo = 0 WHERE id = ?", [id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Erro ao deletar meta:", error)
    return NextResponse.json({ error: "Erro ao deletar meta" }, { status: 500 })
  }
}
