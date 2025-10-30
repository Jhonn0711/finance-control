"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Categoria, Receita } from "@/lib/types"

interface ReceitaFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  categorias: Categoria[]
  receita?: Receita
}

export function ReceitaForm({ open, onOpenChange, onSuccess, categorias, receita }: ReceitaFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    categoria_id: receita?.categoria_id || "",
    descricao: receita?.descricao || "",
    valor: receita?.valor || "",
    data_recebimento: receita?.data_recebimento
      ? new Date(receita.data_recebimento).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    recorrente: receita?.recorrente || false,
    frequencia: receita?.frequencia || "mensal",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = receita ? `/api/receitas/${receita.id}` : "/api/receitas"
      const method = receita ? "PUT" : "POST"

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
      console.error("[v0] Erro ao salvar receita:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{receita ? "Editar Receita" : "Nova Receita"}</DialogTitle>
          <DialogDescription>Adicione ou edite uma receita no seu controle financeiro</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Ex: Salário, Freelance, etc"
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
                value={formData.data_recebimento}
                onChange={(e) => setFormData({ ...formData, data_recebimento: e.target.value })}
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
            <Label htmlFor="recorrente">Receita Recorrente</Label>
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
