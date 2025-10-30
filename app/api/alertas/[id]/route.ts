import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    await query("UPDATE alertas SET lido = 1 WHERE id = ?", [id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Erro ao marcar alerta como lido:", error)
    return NextResponse.json({ error: "Erro ao marcar alerta como lido" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    await query("DELETE FROM alertas WHERE id = ?", [id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Erro ao deletar alerta:", error)
    return NextResponse.json({ error: "Erro ao deletar alerta" }, { status: 500 })
  }
}
