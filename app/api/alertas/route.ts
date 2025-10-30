import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import type { Alerta } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const usuarioId = searchParams.get("usuario_id") || 1

    const alertas = await query<Alerta[]>(
      `SELECT * FROM alertas 
       WHERE usuario_id = ?
       ORDER BY lido ASC, data_criacao DESC`,
      [usuarioId],
    )

    return NextResponse.json(alertas)
  } catch (error) {
    console.error("[v0] Erro ao buscar alertas:", error)
    return NextResponse.json({ error: "Erro ao buscar alertas" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { usuario_id, tipo, mensagem } = body

    const result = await query(
      `INSERT INTO alertas (usuario_id, tipo, mensagem, lido, data_criacao) 
       VALUES (?, ?, ?, 0, NOW())`,
      [usuario_id, tipo, mensagem],
    )

    return NextResponse.json({ success: true, id: (result as any).insertId })
  } catch (error) {
    console.error("[v0] Erro ao criar alerta:", error)
    return NextResponse.json({ error: "Erro ao criar alerta" }, { status: 500 })
  }
}
