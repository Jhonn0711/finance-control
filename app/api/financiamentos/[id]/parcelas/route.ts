import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import type { ParcelaFinanciamento } from "@/lib/types"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const parcelas = await query<ParcelaFinanciamento[]>(
      `SELECT * FROM parcelas_financiamento 
       WHERE financiamento_id = ? 
       ORDER BY numero_parcela`,
      [id],
    )

    return NextResponse.json(parcelas)
  } catch (error) {
    console.error("[v0] Erro ao buscar parcelas:", error)
    return NextResponse.json({ error: "Erro ao buscar parcelas" }, { status: 500 })
  }
}
