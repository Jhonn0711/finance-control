"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Meta } from "@/lib/types"

interface MetaFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  meta?: Meta
}

export function MetaForm({ open, onOpenChange, onSuccess, meta }: MetaFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    descricao: meta?.descricao || "",
    valor_alvo: meta?.valor_alvo || "",
    valor_atual: meta?.valor_atual || "",
    data_inicio: meta?.data_inicio
      ? new Date(meta.data_inicio).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    data_fim: meta?.data_fim ? new Date(meta.data_fim).toISOString().split("T")[0] : "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = meta ? `/api/metas/${meta.id}` : "/api/metas"
      const method = meta ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          usuario_id: 1,
          valor_alvo: Number.parseFloat(formData.valor_alvo.toString()),
          valor_atual: Number.parseFloat(formData.valor_atual.toString() || "0"),
        }),
      })

      if (response.ok) {
        onSuccess()
        onOpenChange(false)
      }
    } catch (error) {
      console.error("[v0] Erro ao salvar meta:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{meta ? "Editar Meta" : "Nova Meta"}</DialogTitle>
          <DialogDescription>Defina uma meta financeira para alcançar</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Ex: Reserva de emergência, Viagem, Compra de carro"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor_alvo">Valor Alvo</Label>
              <Input
                id="valor_alvo"
                type="number"
                step="0.01"
                value={formData.valor_alvo}
                onChange={(e) => setFormData({ ...formData, valor_alvo: e.target.value })}
                placeholder="0,00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor_atual">Valor Atual</Label>
              <Input
                id="valor_atual"
                type="number"
                step="0.01"
                value={formData.valor_atual}
                onChange={(e) => setFormData({ ...formData, valor_atual: e.target.value })}
                placeholder="0,00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="data_fim">Data Limite</Label>
              <Input
                id="data_fim"
                type="date"
                value={formData.data_fim}
                onChange={(e) => setFormData({ ...formData, data_fim: e.target.value })}
                required
              />
            </div>
          </div>

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
