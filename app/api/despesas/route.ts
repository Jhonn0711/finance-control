import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import type { Despesa } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const usuarioId = searchParams.get("usuario_id") || 1

    const despesas = await query<Despesa[]>(
      `SELECT d.*, c.nome as categoria_nome, c.cor as categoria_cor 
       FROM despesas d 
       LEFT JOIN categorias c ON d.categoria_id = c.id 
       WHERE d.usuario_id = ? AND d.ativo = 1
       ORDER BY d.data_pagamento DESC`,
      [usuarioId],
    )

    return NextResponse.json(despesas)
  } catch (error) {
    console.error("[v0] Erro ao buscar despesas:", error)
    return NextResponse.json({ error: "Erro ao buscar despesas" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { usuario_id, categoria_id, descricao, valor, data_pagamento, recorrente, frequencia, pago } = body

    const result = await query(
      `INSERT INTO despesas (usuario_id, categoria_id, descricao, valor, data_pagamento, recorrente, frequencia, pago, ativo) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [usuario_id, categoria_id, descricao, valor, data_pagamento, recorrente, frequencia, pago],
    )

    return NextResponse.json({ success: true, id: (result as any).insertId })
  } catch (error) {
    console.error("[v0] Erro ao criar despesa:", error)
    return NextResponse.json({ error: "Erro ao criar despesa" }, { status: 500 })
  }
}
