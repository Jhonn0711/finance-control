"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { SidebarNav } from "@/components/sidebar-nav"
import { MetaForm } from "@/components/meta-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Target, TrendingUp } from "lucide-react"
import type { Meta } from "@/lib/types"

export default function MetasPage() {
  const [metas, setMetas] = useState<Meta[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingMeta, setEditingMeta] = useState<Meta | undefined>()

  const fetchData = async () => {
    try {
      const response = await fetch("/api/metas?usuario_id=1")
      const data = await response.json()
      setMetas(data)
    } catch (error) {
      console.error("[v0] Erro ao carregar metas:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta meta?")) return

    try {
      await fetch(`/api/metas/${id}`, { method: "DELETE" })
      fetchData()
    } catch (error) {
      console.error("[v0] Erro ao deletar meta:", error)
    }
  }

  const handleEdit = (meta: Meta) => {
    setEditingMeta(meta)
    setFormOpen(true)
  }

  const handleFormClose = () => {
    setFormOpen(false)
    setEditingMeta(undefined)
  }

  const handleAtualizarValor = async (meta: Meta) => {
    const novoValor = prompt(`Atualizar valor atual da meta "${meta.descricao}":`, meta.valor_atual.toString())
    if (novoValor === null) return

    try {
      await fetch(`/api/metas/${meta.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...meta,
          valor_atual: Number.parseFloat(novoValor),
        }),
      })
      fetchData()
    } catch (error) {
      console.error("[v0] Erro ao atualizar meta:", error)
    }
  }

  const getStatus = (meta: Meta) => {
    const progresso = (Number(meta.valor_atual) / Number(meta.valor_alvo)) * 100
    const dataFim = new Date(meta.data_fim)
    const hoje = new Date()
    const diasRestantes = Math.ceil((dataFim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))

    if (progresso >= 100) return { label: "Concluída", variant: "default" as const, color: "text-success" }
    if (diasRestantes < 0) return { label: "Vencida", variant: "destructive" as const, color: "text-destructive" }
    if (diasRestantes <= 30) return { label: "Urgente", variant: "secondary" as const, color: "text-warning" }
    return { label: "Em andamento", variant: "outline" as const, color: "text-primary" }
  }

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
              <h2 className="text-3xl font-bold tracking-tight">Metas Financeiras</h2>
              <p className="text-muted-foreground">Defina e acompanhe seus objetivos</p>
            </div>
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Meta
            </Button>
          </div>

          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-muted-foreground py-8">Carregando...</p>
            ) : metas.length === 0 ? (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground">
                    Nenhuma meta cadastrada. Clique em "Nova Meta" para começar.
                  </p>
                </CardContent>
              </Card>
            ) : (
              metas.map((meta) => {
                const progresso = (Number(meta.valor_atual) / Number(meta.valor_alvo)) * 100
                const status = getStatus(meta)
                const dataFim = new Date(meta.data_fim)
                const hoje = new Date()
                const diasRestantes = Math.ceil((dataFim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))

                return (
                  <Card key={meta.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Target className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle>{meta.descricao}</CardTitle>
                            <CardDescription>
                              {new Date(meta.data_inicio).toLocaleDateString("pt-BR")} até{" "}
                              {dataFim.toLocaleDateString("pt-BR")}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progresso</span>
                          <span className="font-medium">{progresso.toFixed(1)}%</span>
                        </div>
                        <Progress value={Math.min(progresso, 100)} className="h-2" />
                        <div className="flex items-center justify-between text-sm">
                          <span className={status.color}>R$ {Number(meta.valor_atual).toFixed(2)}</span>
                          <span className="text-muted-foreground">de R$ {Number(meta.valor_alvo).toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {diasRestantes > 0 ? (
                            <>
                              <span>{diasRestantes} dias restantes</span>
                            </>
                          ) : (
                            <span className="text-destructive">Meta vencida</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleAtualizarValor(meta)}>
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Atualizar
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(meta)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(meta.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </main>
      </div>

      <MetaForm open={formOpen} onOpenChange={handleFormClose} onSuccess={fetchData} meta={editingMeta} />
    </div>
  )
}
