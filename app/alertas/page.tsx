"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle2, Trash2, Bell } from "lucide-react"
import type { Alerta } from "@/lib/types"

export default function AlertasPage() {
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const response = await fetch("/api/alertas?usuario_id=1")
      const data = await response.json()
      setAlertas(data)
    } catch (error) {
      console.error("[v0] Erro ao carregar alertas:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleMarcarLido = async (id: number) => {
    try {
      await fetch(`/api/alertas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      })
      fetchData()
    } catch (error) {
      console.error("[v0] Erro ao marcar alerta como lido:", error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/alertas/${id}`, { method: "DELETE" })
      fetchData()
    } catch (error) {
      console.error("[v0] Erro ao deletar alerta:", error)
    }
  }

  const getIconeAlerta = (tipo: string) => {
    switch (tipo) {
      case "orcamento_excedido":
      case "saldo_negativo":
        return <AlertTriangle className="h-5 w-5 text-destructive" />
      case "parcela_vencendo":
        return <Bell className="h-5 w-5 text-warning" />
      case "meta_proxima":
        return <CheckCircle2 className="h-5 w-5 text-success" />
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />
    }
  }

  const alertasNaoLidos = alertas.filter((a) => !a.lido).length

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
              <h2 className="text-3xl font-bold tracking-tight">Alertas</h2>
              <p className="text-muted-foreground">
                {alertasNaoLidos > 0
                  ? `Você tem ${alertasNaoLidos} alerta${alertasNaoLidos > 1 ? "s" : ""} não lido${alertasNaoLidos > 1 ? "s" : ""}`
                  : "Nenhum alerta pendente"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-muted-foreground py-8">Carregando...</p>
            ) : alertas.length === 0 ? (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground">Nenhum alerta no momento.</p>
                </CardContent>
              </Card>
            ) : (
              alertas.map((alerta) => (
                <Card key={alerta.id} className={!alerta.lido ? "border-primary" : ""}>
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="mt-1">{getIconeAlerta(alerta.tipo)}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium">{alerta.mensagem}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(alerta.data_criacao).toLocaleDateString("pt-BR")} às{" "}
                            {new Date(alerta.data_criacao).toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        {!alerta.lido && <Badge variant="default">Novo</Badge>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!alerta.lido && (
                        <Button variant="outline" size="sm" onClick={() => handleMarcarLido(alerta.id)}>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Marcar como lido
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(alerta.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
