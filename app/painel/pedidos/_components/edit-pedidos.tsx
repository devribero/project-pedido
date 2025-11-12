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
import { Edit, X } from 'lucide-react'
import { useState, useTransition } from 'react'
import { editarPedido } from '../actions'
import { toast } from 'sonner'
import type { Produtos } from '@/generated/prisma/client'

interface ProdutoSelecionado {
  id: string
  quantidade: number
}

interface EditPedidoProps {
  pedido: any
  produtos: Produtos[]
}

export default function EditPedido({ pedido, produtos }: EditPedidoProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [produtosSelecionados, setProdutosSelecionados] = useState<ProdutoSelecionado[]>(
    pedido.produtos?.map((pp: any) => ({ id: pp.produtoId, quantidade: pp.quantidade })) || []
  )
  const [nomeCliente, setNomeCliente] = useState(pedido.nome_cliente || '')
  const [produtoAtual, setProdutoAtual] = useState('')
  const [quantidadeAtual, setQuantidadeAtual] = useState('1')

  const adicionarProduto = () => {
    if (!produtoAtual) {
      toast.error('Selecione um produto')
      return
    }

    const jaAdicionado = produtosSelecionados.find(p => p.id === produtoAtual)
    if (jaAdicionado) {
      toast.error('Produto já adicionado')
      return
    }

    setProdutosSelecionados([
      ...produtosSelecionados,
      { id: produtoAtual, quantidade: parseInt(quantidadeAtual) || 1 }
    ])
    setProdutoAtual('')
    setQuantidadeAtual('1')
  }

  const removerProduto = (id: string) => {
    setProdutosSelecionados(produtosSelecionados.filter(p => p.id !== id))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.append('produtos', JSON.stringify(produtosSelecionados))
    
    startTransition(async () => {
      const result = await editarPedido(pedido.id, formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Pedido atualizado com sucesso!')
        setOpen(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Pedido</DialogTitle>
          <DialogDescription>
            Altere os dados do pedido.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome_cliente">Nome do Cliente</Label>
              <Input
                id="nome_cliente"
                name="nome_cliente"
                value={nomeCliente}
                onChange={(e) => setNomeCliente(e.target.value)}
                placeholder="João Silva"
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label>Produtos</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <select
                    value={produtoAtual}
                    onChange={(e) => setProdutoAtual(e.target.value)}
                    disabled={isPending}
                    className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Selecione um produto</option>
                    {produtos.map((produto) => (
                      <option key={produto.id} value={produto.id}>
                        {produto.nome}
                      </option>
                    ))}
                  </select>
                  <Input
                    type="number"
                    min="1"
                    value={quantidadeAtual}
                    onChange={(e) => setQuantidadeAtual(e.target.value)}
                    placeholder="Qtd"
                    className="w-16"
                    disabled={isPending}
                  />
                  <Button
                    type="button"
                    onClick={adicionarProduto}
                    disabled={isPending}
                    variant="outline"
                  >
                    +
                  </Button>
                </div>

                {produtosSelecionados.length > 0 && (
                  <div className="border rounded-md p-2 space-y-1 max-h-40 overflow-y-auto">
                    {produtosSelecionados.map((ps) => {
                      const prod = produtos.find(p => p.id === ps.id)
                      return (
                        <div key={ps.id} className="flex justify-between items-center text-sm bg-muted p-2 rounded">
                          <span>{prod?.nome} (x{ps.quantidade})</span>
                          <button
                            type="button"
                            onClick={() => removerProduto(ps.id)}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço (opcional)</Label>
              <Input
                id="endereco"
                name="endereco"
                defaultValue={pedido.endereco || ''}
                placeholder="Rua Tiringa, 123"
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone (opcional)</Label>
              <Input
                id="telefone"
                name="telefone"
                defaultValue={pedido.telefone || ''}
                placeholder="(11) 99999-9999"
                disabled={isPending}
              />
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
              {isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}