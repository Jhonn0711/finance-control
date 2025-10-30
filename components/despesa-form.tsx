"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Categoria, Despesa } from "@/lib/types"

interface DespesaFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  categorias: Categoria[]
  despesa?: Despesa
}

export function DespesaForm({ open, onOpenChange, onSuccess, categorias, despesa }: DespesaFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    categoria_id: despesa?.categoria_id || "",
    descricao: despesa?.descricao || "",
    valor: despesa?.valor || "",
    data_pagamento: despesa?.data_pagamento
      ? new Date(despesa.data_pagamento).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    recorrente: despesa?.recorrente || false,
    frequencia: despesa?.frequencia || "mensal",
    pago: despesa?.pago || false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = despesa ? `/api/despesas/${despesa.id}` : "/api/despesas"
      const method = despesa ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          usuario_id: 1,
          valor: Number.parseFloat(formData.valor.toString()),
        }),
      })

      if (response.ok) {
        onSuccess()
        onOpenChange(false)
      }
    } catch (error) {
      console.error("[v0] Erro ao salvar despesa:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{despesa ? "Editar Despesa" : "Nova Despesa"}</DialogTitle>
          <DialogDescription>Adicione ou edite uma despesa no seu controle financeiro</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Ex: Aluguel, Mercado, etc"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor">Valor</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                placeholder="0,00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                type="date"
                value={formData.data_pagamento}
                onChange={(e) => setFormData({ ...formData, data_pagamento: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoria">Categoria</Label>
            <Select
              value={formData.categoria_id.toString()}
              onValueChange={(value) => setFormData({ ...formData, categoria_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="pago">Já foi pago</Label>
            <Switch
              id="pago"
              checked={formData.pago}
              onCheckedChange={(checked) => setFormData({ ...formData, pago: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="recorrente">Despesa Recorrente</Label>
            <Switch
              id="recorrente"
              checked={formData.recorrente}
              onCheckedChange={(checked) => setFormData({ ...formData, recorrente: checked })}
            />
          </div>

          {formData.recorrente && (
            <div className="space-y-2">
              <Label htmlFor="frequencia">Frequência</Label>
              <Select
                value={formData.frequencia}
                onValueChange={(value) => setFormData({ ...formData, frequencia: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mensal">Mensal</SelectItem>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="anual">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
