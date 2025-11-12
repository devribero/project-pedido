'use server'

import prisma from '@/lib/prisma-client'
import { revalidatePath } from 'next/cache'

export async function criarPedido(formData: FormData) {
  const nomeCliente = formData.get('nome_cliente') as string
  const endereco = formData.get('endereco') as string
  const telefone = formData.get('telefone') as string
  const produtosJson = formData.get('produtos') as string

  if (!nomeCliente || nomeCliente.trim() === '') {
    return { error: 'Nome do cliente é obrigatório' }
  }

  let produtos: Array<{ id: string; quantidade: number }> = []
  try {
    produtos = JSON.parse(produtosJson || '[]')
  } catch {
    return { error: 'Formato de produtos inválido' }
  }

  if (produtos.length === 0) {
    return { error: 'Selecione pelo menos um produto' }
  }

  try {
    await prisma.pedidos.create({
      data: {
        nome_cliente: nomeCliente.trim(),
        endereco: endereco?.trim() || null,
        telefone: telefone?.trim() || null,
        produtos: {
          create: produtos.map(p => ({
            produtoId: p.id,
            quantidade: p.quantidade || 1,
          })),
        },
      },
    })

    revalidatePath('/painel/pedidos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    return { error: 'Erro ao criar pedido' }
  }
}

export async function editarPedido(id: string, formData: FormData) {
  const nomeCliente = formData.get('nome_cliente') as string
  const endereco = formData.get('endereco') as string
  const telefone = formData.get('telefone') as string
  const produtosJson = formData.get('produtos') as string

  if (!nomeCliente || nomeCliente.trim() === '') {
    return { error: 'Nome do cliente é obrigatório' }
  }

  let produtos: Array<{ id: string; quantidade: number }> = []
  try {
    produtos = JSON.parse(produtosJson || '[]')
  } catch {
    return { error: 'Formato de produtos inválido' }
  }

  if (produtos.length === 0) {
    return { error: 'Selecione pelo menos um produto' }
  }

  try {
    // Primeiro, deleta os produtos antigos
    await prisma.pedidosProdutos.deleteMany({
      where: { pedidoId: id },
    })

    // Depois, atualiza o pedido e cria os novos produtos
    await prisma.pedidos.update({
      where: { id },
      data: {
        nome_cliente: nomeCliente.trim(),
        endereco: endereco?.trim() || null,
        telefone: telefone?.trim() || null,
        produtos: {
          create: produtos.map(p => ({
            produtoId: p.id,
            quantidade: p.quantidade || 1,
          })),
        },
      },
    })

    revalidatePath('/painel/pedidos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao editar pedido:', error)
    return { error: 'Erro ao editar pedido' }
  }
}

export async function excluirPedido(id: string) {
  try {
    await prisma.pedidos.delete({
      where: { id },
    })

    revalidatePath('/painel/pedidos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao excluir pedido:', error)
    return { error: 'Erro ao excluir pedido' }
  }
}