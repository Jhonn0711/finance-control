"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { SidebarNav } from "@/components/sidebar-nav"
import { FinanciamentoForm } from "@/components/financiamento-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Home, Car, Package, Eye, CheckCircle2, Circle } from "lucide-react"
import type { Financiamento, ParcelaFinanciamento } from "@/lib/types"

export default function FinanciamentosPage() {
  const [financiamentos, setFinanciamentos] = useState<Financiamento[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [selectedFinanciamento, setSelectedFinanciamento] = useState<Financiamento | null>(null)
  const [parcelas, setParcelas] = useState<ParcelaFinanciamento[]>([])
  const [parcelasOpen, setParcelasOpen] = useState(false)

  const fetchData = async () => {
    try {
      const response = await fetch("/api/financiamentos?usuario_id=1")
      const data = await response.json()
      setFinanciamentos(data)
    } catch (error) {
      console.error("[v0] Erro ao carregar financiamentos:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleViewParcelas = async (financiamento: Financiamento) => {
    setSelectedFinanciamento(financiamento)
    try {
      const response = await fetch(`/api/financiamentos/${financiamento.id}/parcelas`)
      const data = await response.json()
      setParcelas(data)
      setParcelasOpen(true)
    } catch (error) {
      console.error("[v0] Erro ao carregar parcelas:", error)
    }
  }

  const handleToggleParcela = async (parcela: ParcelaFinanciamento) => {
    try {
      const novoPago = !parcela.pago
      await fetch(`/api/financiamentos/${selectedFinanciamento?.id}/parcelas/${parcela.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pago: novoPago,
          data_pagamento: novoPago ? new Date().toISOString().split("T")[0] : null,
        }),
      })

      // Atualizar lista de parcelas
      if (selectedFinanciamento) {
        const response = await fetch(`/api/financiamentos/${selectedFinanciamento.id}/parcelas`)
        const data = await response.json()
        setParcelas(data)
      }

      // Atualizar lista de financiamentos
      fetchData()
    } catch (error) {
      console.error("[v0] Erro ao atualizar parcela:", error)
    }
  }

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case "casa":
        return <Home className="h-5 w-5" />
      case "carro":
        return <Car className="h-5 w-5" />
      default:
        return <Package className="h-5 w-5" />
    }
  }

  const totalFinanciado = financiamentos.reduce((sum, f) => sum + Number(f.valor_total - f.valor_entrada), 0)
  const totalPago = financiamentos.reduce((sum, f) => sum + f.parcelas_pagas * Number(f.valor_parcela), 0)
  const totalRestante = totalFinanciado - totalPago

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
              <h2 className="text-3xl font-bold tracking-tight">Financiamentos</h2>
              <p className="text-muted-foreground">Gerencie seus financiamentos de longo prazo</p>
            </div>
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Financiamento
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total Financiado</CardTitle>
                <CardDescription>Valor total dos financiamentos</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">R$ {totalFinanciado.toFixed(2)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Pago</CardTitle>
                <CardDescription>Valor já quitado</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-success">R$ {totalPago.toFixed(2)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Saldo Devedor</CardTitle>
                <CardDescription>Valor restante</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-warning">R$ {totalRestante.toFixed(2)}</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-muted-foreground py-8">Carregando...</p>
            ) : financiamentos.length === 0 ? (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground">
                    Nenhum financiamento cadastrado. Clique em "Novo Financiamento" para começar.
                  </p>
                </CardContent>
              </Card>
            ) : (
              financiamentos.map((financiamento) => {
                const progresso = (financiamento.parcelas_pagas / financiamento.numero_parcelas) * 100
                const valorPago = financiamento.parcelas_pagas * Number(financiamento.valor_parcela)
                const valorRestante = financiamento.numero_parcelas * Number(financiamento.valor_parcela) - valorPago

                return (
                  <Card key={financiamento.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg text-primary">{getIcon(financiamento.tipo)}</div>
                          <div>
                            <h3 className="font-semibold text-lg">{financiamento.descricao}</h3>
                            <p className="text-sm text-muted-foreground">
                              {financiamento.tipo.charAt(0).toUpperCase() + financiamento.tipo.slice(1)}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleViewParcelas(financiamento)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Parcelas
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Valor Total</p>
                            <p className="font-semibold">R$ {Number(financiamento.valor_total).toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Entrada</p>
                            <p className="font-semibold">R$ {Number(financiamento.valor_entrada).toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Parcela</p>
                            <p className="font-semibold">R$ {Number(financiamento.valor_parcela).toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Taxa de Juros</p>
                            <p className="font-semibold">{Number(financiamento.taxa_juros).toFixed(2)}% a.a.</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progresso</span>
                            <span className="font-medium">
                              {financiamento.parcelas_pagas} de {financiamento.numero_parcelas} parcelas
                            </span>
                          </div>
                          <Progress value={progresso} className="h-2" />
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-success">Pago: R$ {valorPago.toFixed(2)}</span>
                            <span className="text-warning">Restante: R$ {valorRestante.toFixed(2)}</span>
                          </div>
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

      <FinanciamentoForm open={formOpen} onOpenChange={setFormOpen} onSuccess={fetchData} />

      <Dialog open={parcelasOpen} onOpenChange={setParcelasOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Parcelas - {selectedFinanciamento?.descricao}</DialogTitle>
            <DialogDescription>Gerencie o pagamento das parcelas</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {parcelas.map((parcela) => (
              <div
                key={parcela.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToggleParcela(parcela)}>
                    {parcela.pago ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </Button>
                  <div>
                    <p className="font-medium">Parcela {parcela.numero_parcela}</p>
                    <p className="text-sm text-muted-foreground">
                      Vencimento: {new Date(parcela.data_vencimento).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">R$ {Number(parcela.valor).toFixed(2)}</p>
                  {parcela.pago && parcela.data_pagamento && (
                    <p className="text-xs text-success">
                      Pago em {new Date(parcela.data_pagamento).toLocaleDateString("pt-BR")}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
