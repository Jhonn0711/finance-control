"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { SidebarNav } from "@/components/sidebar-nav"
import { DespesaForm } from "@/components/despesa-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, TrendingDown, CheckCircle2, Circle } from "lucide-react"
import type { Despesa, Categoria } from "@/lib/types"

export default function DespesasPage() {
  const [despesas, setDespesas] = useState<Despesa[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingDespesa, setEditingDespesa] = useState<Despesa | undefined>()

  const fetchData = async () => {
    try {
      const [despesasRes, categoriasRes] = await Promise.all([
        fetch("/api/despesas?usuario_id=1"),
        fetch("/api/categorias?tipo=despesa&usuario_id=1"),
      ])

      const despesasData = await despesasRes.json()
      const categoriasData = await categoriasRes.json()

      setDespesas(despesasData)
      setCategorias(categoriasData)
    } catch (error) {
      console.error("[v0] Erro ao carregar despesas:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta despesa?")) return

    try {
      await fetch(`/api/despesas/${id}`, { method: "DELETE" })
      fetchData()
    } catch (error) {
      console.error("[v0] Erro ao deletar despesa:", error)
    }
  }

  const handleEdit = (despesa: Despesa) => {
    setEditingDespesa(despesa)
    setFormOpen(true)
  }

  const handleFormClose = () => {
    setFormOpen(false)
    setEditingDespesa(undefined)
  }

  const totalDespesas = despesas.reduce((sum, d) => sum + Number(d.valor), 0)
  const despesasPagas = despesas.filter((d) => d.pago).reduce((sum, d) => sum + Number(d.valor), 0)
  const despesasPendentes = totalDespesas - despesasPagas

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 border-r bg-card md:block">
        <div className="flex h-16 items-center border-b px-6">
          <h2 className="text-lg font-semibold">Controle Financeiro</h2>
        </div>
        <SidebarNav />
      </aside>

      <div className="flex-1">
        <DashboardHeader />

        <main className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Despesas</h2>
              <p className="text-muted-foreground">Controle seus gastos</p>
            </div>
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Despesa
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-destructive" />
                  Total
                </CardTitle>
                <CardDescription>Todas as despesas</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-destructive">R$ {totalDespesas.toFixed(2)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                  Pagas
                </CardTitle>
                <CardDescription>Despesas quitadas</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">R$ {despesasPagas.toFixed(2)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Circle className="h-5 w-5 text-warning" />
                  Pendentes
                </CardTitle>
                <CardDescription>A pagar</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-warning">R$ {despesasPendentes.toFixed(2)}</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-muted-foreground py-8">Carregando...</p>
            ) : despesas.length === 0 ? (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground">
                    Nenhuma despesa cadastrada. Clique em "Nova Despesa" para começar.
                  </p>
                </CardContent>
              </Card>
            ) : (
              despesas.map((despesa) => (
                <Card key={despesa.id}>
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{despesa.descricao}</h3>
                        {despesa.recorrente && (
                          <Badge variant="secondary" className="text-xs">
                            {despesa.frequencia}
                          </Badge>
                        )}
                        {despesa.pago ? (
                          <Badge variant="outline" className="text-xs">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Pago
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs text-warning">
                            <Circle className="mr-1 h-3 w-3" />
                            Pendente
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(despesa.data_pagamento).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-2xl font-bold text-destructive">R$ {Number(despesa.valor).toFixed(2)}</p>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(despesa)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(despesa.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>

      <DespesaForm
        open={formOpen}
        onOpenChange={handleFormClose}
        onSuccess={fetchData}
        categorias={categorias}
        despesa={editingDespesa}
      />
    </div>
  )
}
