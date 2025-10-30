import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import type { Receita } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const usuarioId = searchParams.get("usuario_id") || 1

    const receitas = await query<Receita[]>(
      `SELECT r.*, c.nome as categoria_nome, c.cor as categoria_cor 
       FROM receitas r 
       LEFT JOIN categorias c ON r.categoria_id = c.id 
       WHERE r.usuario_id = ? AND r.ativo = 1
       ORDER BY r.data_recebimento DESC`,
      [usuarioId],
    )

    return NextResponse.json(receitas)
  } catch (error) {
    console.error("[v0] Erro ao buscar receitas:", error)
    return NextResponse.json({ error: "Erro ao buscar receitas" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { usuario_id, categoria_id, descricao, valor, data_recebimento, recorrente, frequencia } = body

    const result = await query(
      `INSERT INTO receitas (usuario_id, categoria_id, descricao, valor, data_recebimento, recorrente, frequencia, ativo) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      [usuario_id, categoria_id, descricao, valor, data_recebimento, recorrente, frequencia],
    )

    return NextResponse.json({ success: true, id: (result as any).insertId })
  } catch (error) {
    console.error("[v0] Erro ao criar receita:", error)
    return NextResponse.json({ error: "Erro ao criar receita" }, { status: 500 })
  }
}
