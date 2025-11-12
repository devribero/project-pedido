'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState, useTransition } from 'react'
import { criarProduto } from '../actions'
import { toast } from 'sonner'

interface AddProdutosProps {
  categorias: Array<{ id: string; nome: string }>
}

export default function AddProdutos({ categorias }: AddProdutosProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [selectedCategoria, setSelectedCategoria] = useState<string>('')

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await criarProduto(formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Produto criado com sucesso!')
        setOpen(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Adicionar Produto</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Produto</DialogTitle>
          <DialogDescription>
            Crie um novo produto para organizar seus produtos.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Produto</Label>
              <Input
                id="nome"
                name="nome"
                placeholder="Ex: Pizzas, Bebidas, Sobremesas..."
                required
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                name="descricao"
                placeholder="Descrição do produto (opcional)"
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preco">Preço</Label>
              <Input
                id="preco"
                name="preco"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                required
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoriaId">Categoria</Label>
              <select
                id="categoriaId"
                name="categoriaId"
                value={selectedCategoria}
                onChange={(e) => setSelectedCategoria(e.target.value)}
                required
                disabled={isPending}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Criando...' : 'Criar Produto'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}