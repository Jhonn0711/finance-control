import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import type { Categoria } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tipo = searchParams.get("tipo")
    const usuarioId = searchParams.get("usuario_id") || 1

    let sql = `SELECT * FROM categorias WHERE (usuario_id IS NULL OR usuario_id = ?)`
    const params: any[] = [usuarioId]

    if (tipo) {
      sql += ` AND tipo = ?`
      params.push(tipo)
    }

    sql += ` ORDER BY nome`

    const categorias = await query<Categoria[]>(sql, params)

    return NextResponse.json(categorias)
  } catch (error) {
    console.error("[v0] Erro ao buscar categorias:", error)
    return NextResponse.json({ error: "Erro ao buscar categorias" }, { status: 500 })
  }
}
