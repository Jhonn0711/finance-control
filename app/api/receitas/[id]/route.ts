import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { categoria_id, descricao, valor, data_recebimento, recorrente, frequencia } = body

    await query(
      `UPDATE receitas 
       SET categoria_id = ?, descricao = ?, valor = ?, data_recebimento = ?, recorrente = ?, frequencia = ?
       WHERE id = ?`,
      [categoria_id, descricao, valor, data_recebimento, recorrente, frequencia, id],
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Erro ao atualizar receita:", error)
    return NextResponse.json({ error: "Erro ao atualizar receita" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    await query("UPDATE receitas SET ativo = 0 WHERE id = ?", [id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Erro ao deletar receita:", error)
    return NextResponse.json({ error: "Erro ao deletar receita" }, { status: 500 })
  }
}
