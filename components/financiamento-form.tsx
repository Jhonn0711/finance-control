"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface FinanciamentoFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function FinanciamentoForm({ open, onOpenChange, onSuccess }: FinanciamentoFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    tipo: "casa",
    descricao: "",
    valor_total: "",
    valor_entrada: "",
    numero_parcelas: "",
    taxa_juros: "",
    data_inicio: new Date().toISOString().split("T")[0],
  })

  const [valorParcela, setValorParcela] = useState<number | null>(null)

  const calcularParcela = () => {
    const valorTotal = Number.parseFloat(formData.valor_total)
    const valorEntrada = Number.parseFloat(formData.valor_entrada)
    const numeroParcelas = Number.parseInt(formData.numero_parcelas)
    const taxaJuros = Number.parseFloat(formData.taxa_juros)

    if (valorTotal && valorEntrada && numeroParcelas && taxaJuros >= 0) {
      const valorFinanciado = valorTotal - valorEntrada
      const taxaMensal = taxaJuros / 100 / 12

      if (taxaMensal === 0) {
        setValorParcela(valorFinanciado / numeroParcelas)
      } else {
        const parcela =
          (valorFinanciado * (taxaMensal * Math.pow(1 + taxaMensal, numeroParcelas))) /
          (Math.pow(1 + taxaMensal, numeroParcelas) - 1)
        setValorParcela(parcela)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/financiamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          usuario_id: 1,
          valor_total: Number.parseFloat(formData.valor_total),
          valor_entrada: Number.parseFloat(formData.valor_entrada),
          numero_parcelas: Number.parseInt(formData.numero_parcelas),
          taxa_juros: Number.parseFloat(formData.taxa_juros),
        }),
      })

      if (response.ok) {
        onSuccess()
        onOpenChange(false)
        setFormData({
          tipo: "casa",
          descricao: "",
          valor_total: "",
          valor_entrada: "",
          numero_parcelas: "",
          taxa_juros: "",
          data_inicio: new Date().toISOString().split("T")[0],
        })
        setValorParcela(null)
      }
    } catch (error) {
      console.error("[v0] Erro ao salvar financiamento:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Novo Financiamento</DialogTitle>
          <DialogDescription>Adicione um financiamento de casa, carro ou outro bem</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casa">Casa</SelectItem>
                  <SelectItem value="carro">Carro</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Ex: Apartamento Centro"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor_total">Valor Total</Label>
              <Input
                id="valor_total"
                type="number"
                step="0.01"
                value={formData.valor_total}
                onChange={(e) => {
                  setFormData({ ...formData, valor_total: e.target.value })
                  setValorParcela(null)
                }}
                placeholder="0,00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor_entrada">Valor de Entrada</Label>
              <Input
                id="valor_entrada"
                type="number"
                step="0.01"
                value={formData.valor_entrada}
                onChange={(e) => {
                  setFormData({ ...formData, valor_entrada: e.target.value })
                  setValorParcela(null)
                }}
                placeholder="0,00"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numero_parcelas">Número de Parcelas</Label>
              <Input
                id="numero_parcelas"
                type="number"
                value={formData.numero_parcelas}
                onChange={(e) => {
                  setFormData({ ...formData, numero_parcelas: e.target.value })
                  setValorParcela(null)
                }}
                placeholder="Ex: 360"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxa_juros">Taxa de Juros (% ao ano)</Label>
              <Input
                id="taxa_juros"
                type="number"
                step="0.01"
                value={formData.taxa_juros}
                onChange={(e) => {
                  setFormData({ ...formData, taxa_juros: e.target.value })
                  setValorParcela(null)
                }}
                placeholder="Ex: 8.5"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="data_inicio">Data de Início</Label>
            <Input
              id="data_inicio"
              type="date"
              value={formData.data_inicio}
              onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
              required
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Valor da Parcela</p>
              {valorParcela !== null ? (
                <p className="text-2xl font-bold">R$ {valorParcela.toFixed(2)}</p>
              ) : (
                <p className="text-sm text-muted-foreground">Clique em calcular</p>
              )}
            </div>
            <Button type="button" variant="outline" onClick={calcularParcela}>
              Calcular
            </Button>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || valorParcela === null}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
