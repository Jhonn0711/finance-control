"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, PieChartIcon, BarChart3 } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface RelatorioData {
  fluxoCaixa: Array<{ mes: string; receitas: number; despesas: number; saldo: number }>
  despesasPorCategoria: Array<{ nome: string; cor: string; total: number; quantidade: number }>
  receitasPorCategoria: Array<{ nome: string; cor: string; total: number; quantidade: number }>
  estatisticas: {
    total_receitas: number
    total_despesas: number
    media_receitas: number
    media_despesas: number
    saldo_anual: number
  }
  tiposDespesas: {
    recorrentes: number
    avulsas: number
  }
}

export default function RelatoriosPage() {
  const [data, setData] = useState<RelatorioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear().toString())

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/relatorios?usuario_id=1&ano=${anoSelecionado}`)
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error("[v0] Erro ao carregar relatórios:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [anoSelecionado])

  const anos = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

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
              <h2 className="text-3xl font-bold tracking-tight">Relatórios e Análises</h2>
              <p className="text-muted-foreground">Visualize seus dados financeiros</p>
            </div>
            <Select value={anoSelecionado} onValueChange={setAnoSelecionado}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {anos.map((ano) => (
                  <SelectItem key={ano} value={ano.toString()}>
                    {ano}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <p className="text-center text-muted-foreground py-8">Carregando...</p>
          ) : data ? (
            <>
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Receitas Totais</CardTitle>
                    <TrendingUp className="h-4 w-4 text-success" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-success">
                      R$ {data.estatisticas.total_receitas.toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Média: R$ {data.estatisticas.media_receitas.toFixed(2)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Despesas Totais</CardTitle>
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-destructive">
                      R$ {data.estatisticas.total_despesas.toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Média: R$ {data.estatisticas.media_despesas.toFixed(2)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Saldo Anual</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`text-2xl font-bold ${data.estatisticas.saldo_anual >= 0 ? "text-success" : "text-destructive"}`}
                    >
                      R$ {data.estatisticas.saldo_anual.toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {data.estatisticas.saldo_anual >= 0 ? "Superávit" : "Déficit"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Taxa de Economia</CardTitle>
                    <PieChartIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {data.estatisticas.total_receitas > 0
                        ? ((data.estatisticas.saldo_anual / data.estatisticas.total_receitas) * 100).toFixed(1)
                        : 0}
                      %
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Do total de receitas</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Fluxo de Caixa Mensal</CardTitle>
                  <CardDescription>Comparação entre receitas e despesas ao longo do ano</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      receitas: {
                        label: "Receitas",
                        color: "hsl(var(--success))",
                      },
                      despesas: {
                        label: "Despesas",
                        color: "hsl(var(--destructive))",
                      },
                    }}
                    className="h-[400px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.fluxoCaixa}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line type="monotone" dataKey="receitas" stroke="hsl(var(--success))" strokeWidth={2} />
                        <Line type="monotone" dataKey="despesas" stroke="hsl(var(--destructive))" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Despesas por Categoria</CardTitle>
                    <CardDescription>Distribuição dos gastos por categoria</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {data.despesasPorCategoria.length > 0 ? (
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
                              label={(entry) => `${entry.nome}: R$ ${entry.total.toFixed(2)}`}
                            >
                              {data.despesasPorCategoria.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.cor || `hsl(var(--chart-${(index % 5) + 1}))`}
                                />
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
                    <CardTitle>Receitas por Categoria</CardTitle>
                    <CardDescription>Distribuição das receitas por categoria</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {data.receitasPorCategoria.length > 0 ? (
                      <ChartContainer
                        config={data.receitasPorCategoria.reduce(
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
                          <BarChart data={data.receitasPorCategoria}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="nome" />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="total" fill="hsl(var(--success))">
                              {data.receitasPorCategoria.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.cor || `hsl(var(--chart-${(index % 5) + 1}))`}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">Nenhuma receita registrada</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Despesas Recorrentes vs Avulsas</CardTitle>
                  <CardDescription>Análise do tipo de despesas</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      recorrentes: {
                        label: "Recorrentes",
                        color: "hsl(var(--chart-1))",
                      },
                      avulsas: {
                        label: "Avulsas",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Recorrentes", value: data.tiposDespesas.recorrentes },
                            { name: "Avulsas", value: data.tiposDespesas.avulsas },
                          ]}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={(entry) => `${entry.name}: R$ ${entry.value.toFixed(2)}`}
                        >
                          <Cell fill="hsl(var(--chart-1))" />
                          <Cell fill="hsl(var(--chart-2))" />
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </>
          ) : null}
        </main>
      </div>
    </div>
  )
}
