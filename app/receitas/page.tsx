"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { SidebarNav } from "@/components/sidebar-nav"
import { ReceitaForm } from "@/components/receita-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, TrendingUp } from "lucide-react"
import type { Receita, Categoria } from "@/lib/types"

export default function ReceitasPage() {
  const [receitas, setReceitas] = useState<Receita[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingReceita, setEditingReceita] = useState<Receita | undefined>()

  const fetchData = async () => {
    try {
      const [receitasRes, categoriasRes] = await Promise.all([
        fetch("/api/receitas?usuario_id=1"),
        fetch("/api/categorias?tipo=receita&usuario_id=1"),
      ])

      const receitasData = await receitasRes.json()
      const categoriasData = await categoriasRes.json()

      setReceitas(receitasData)
      setCategorias(categoriasData)
    } catch (error) {
      console.error("[v0] Erro ao carregar receitas:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta receita?")) return

    try {
      await fetch(`/api/receitas/${id}`, { method: "DELETE" })
      fetchData()
    } catch (error) {
      console.error("[v0] Erro ao deletar receita:", error)
    }
  }

  const handleEdit = (receita: Receita) => {
    setEditingReceita(receita)
    setFormOpen(true)
  }

  const handleFormClose = () => {
    setFormOpen(false)
    setEditingReceita(undefined)
  }

  const totalReceitas = receitas.reduce((sum, r) => sum + Number(r.valor), 0)

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
              <h2 className="text-3xl font-bold tracking-tight">Receitas</h2>
              <p className="text-muted-foreground">Gerencie suas fontes de renda</p>
            </div>
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Receita
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-success" />
                Total de Receitas
              </CardTitle>
              <CardDescription>Soma de todas as receitas ativas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-success">R$ {totalReceitas.toFixed(2)}</p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-muted-foreground py-8">Carregando...</p>
            ) : receitas.length === 0 ? (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground">
                    Nenhuma receita cadastrada. Clique em "Nova Receita" para começar.
                  </p>
                </CardContent>
              </Card>
            ) : (
              receitas.map((receita) => (
                <Card key={receita.id}>
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{receita.descricao}</h3>
                        {receita.recorrente && (
                          <Badge variant="secondary" className="text-xs">
                            {receita.frequencia}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(receita.data_recebimento).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-2xl font-bold text-success">R$ {Number(receita.valor).toFixed(2)}</p>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(receita)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(receita.id)}>
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

      <ReceitaForm
        open={formOpen}
        onOpenChange={handleFormClose}
        onSuccess={fetchData}
        categorias={categorias}
        receita={editingReceita}
      />
    </div>
  )
}
