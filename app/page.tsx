"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { SidebarNav } from "@/components/sidebar-nav"
import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TrendingUp, TrendingDown, Wallet, AlertTriangle, Home, Car } from "lucide-react"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface DashboardData {
  totalReceitas: number
  totalDespesas: number
  saldo: number
  despesasPorCategoria: Array<{ nome: string; cor: string; total: number }>
  financiamentos: Array<{
    tipo: string
    descricao: string
    valor_parcela: number
    numero_parcelas: number
    parcelas_pagas: number
  }>
  alertas: Array<{ tipo: string; mensagem: string; data_criacao: string }>
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/dashboard?usuario_id=1")
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error("[v0] Erro ao carregar dashboard:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
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
          <main className="flex items-center justify-center p-6">
            <p className="text-muted-foreground">Carregando...</p>
          </main>
        </div>
      </div>
    )
  }

  const saldoTrend = data && data.saldo > 0 ? "up" : data && data.saldo < 0 ? "down" : "neutral"

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
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">Visão geral das suas finanças</p>
          </div>

          {data?.alertas && data.alertas.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Atenção!</AlertTitle>
              <AlertDescription>{data.alertas[0].mensagem}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              title="Receitas do Mês"
              value={`R$ ${(data?.totalReceitas ?? 0).toFixed(2)}`}
              icon={TrendingUp}
              trend="up"
            />
            <StatCard
              title="Despesas do Mês"
              value={`R$ ${(data?.totalDespesas ?? 0).toFixed(2)}`}
              icon={TrendingDown}
              trend="down"
            />
            <StatCard title="Saldo" value={`R$ ${(data?.saldo ?? 0).toFixed(2)}`} icon={Wallet} trend={saldoTrend} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Despesas por Categoria</CardTitle>
                <CardDescription>Distribuição dos seus gastos</CardDescription>
              </CardHeader>
              <CardContent>
                {data?.despesasPorCategoria && data.despesasPorCategoria.length > 0 ? (
                  <ChartContainer
                    config={data.despesasPorCategoria.reduce(
                      (acc, cat, idx) => ({
                        ...acc,
                        [cat.nome]: {
                          label: cat.nome,
                          color: cat.cor || `hsl(var(--chart-${(idx % 5) + 1}))`,
                        },
                      }),
                      {},
                    )}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.despesasPorCategoria}
                          dataKey="total"
                          nameKey="nome"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={(entry) => `${entry.nome}: R$ ${(entry.total ?? 0).toFixed(2)}`}
                        >
                          {data.despesasPorCategoria.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.cor || `hsl(var(--chart-${(index % 5) + 1}))`} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <p className="text-center text-muted-foreground py-8">Nenhuma despesa registrada</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financiamentos Ativos</CardTitle>
                <CardDescription>Acompanhe seus financiamentos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {data?.financiamentos && data.financiamentos.length > 0 ? (
                  data.financiamentos.map((fin, idx) => {
                    const progresso = (fin.parcelas_pagas / fin.numero_parcelas) * 100
                    return (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {fin.tipo === "casa" ? (
                              <Home className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Car className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="font-medium">{fin.descricao}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {fin.parcelas_pagas}/{fin.numero_parcelas}
                          </span>
                        </div>
                        <Progress value={progresso} className="h-2" />
                        <p className="text-sm text-muted-foreground">
                          Parcela: R$ ${(fin.valor_parcela ?? 0).toFixed(2)}/mês
                        </p>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-center text-muted-foreground py-4">Nenhum financiamento ativo</p>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
