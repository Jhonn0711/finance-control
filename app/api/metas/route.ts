import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import type { Meta } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const usuarioId = searchParams.get("usuario_id") || 1

    const metas = await query<Meta[]>(
      `SELECT * FROM metas 
       WHERE usuario_id = ? AND ativo = 1
       ORDER BY data_fim ASC`,
      [usuarioId],
    )

    return NextResponse.json(metas)
  } catch (error) {
    console.error("[v0] Erro ao buscar metas:", error)
    return NextResponse.json({ error: "Erro ao buscar metas" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { usuario_id, descricao, valor_alvo, valor_atual, data_inicio, data_fim } = body

    const result = await query(
      `INSERT INTO metas (usuario_id, descricao, valor_alvo, valor_atual, data_inicio, data_fim, ativo) 
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [usuario_id, descricao, valor_alvo, valor_atual || 0, data_inicio, data_fim],
    )

    return NextResponse.json({ success: true, id: (result as any).insertId })
  } catch (error) {
    console.error("[v0] Erro ao criar meta:", error)
    return NextResponse.json({ error: "Erro ao criar meta" }, { status: 500 })
  }
}
