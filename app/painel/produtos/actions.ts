'use server'

import prisma from '@/lib/prisma-client'
import { revalidatePath } from 'next/cache'

export async function criarProduto(formData: FormData) {
  const nome = formData.get('nome') as string
  const categoriaId = formData.get('categoriaId') as string
  const preco = formData.get('preco') as string
  const descricao = formData.get('descricao') as string

  if (!nome || nome.trim() === '') {
    return { error: 'Nome do produto é obrigatório' }
  }

  if (!categoriaId) {
    return { error: 'Categoria é obrigatória' }
  }

  if (!preco || parseFloat(preco) < 0) {
    return { error: 'Preço válido é obrigatório' }
  }

  try {
    await prisma.produtos.create({
      data: {
        nome: nome.trim(),
        categoriaId,
        preco: parseFloat(preco),
        descricao: descricao?.trim() || null,
      },
    })

    revalidatePath('/painel/produtos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao criar produto:', error)
    return { error: 'Erro ao criar produto' }
  }
}

export async function editarProduto(id: string, formData: FormData) {
  const nome = formData.get('nome') as string
  const categoriaId = formData.get('categoriaId') as string
  const preco = formData.get('preco') as string
  const descricao = formData.get('descricao') as string

  if (!nome || nome.trim() === '') {
    return { error: 'Nome do produto é obrigatório' }
  }

  if (!categoriaId) {
    return { error: 'Categoria é obrigatória' }
  }

  if (!preco || parseFloat(preco) < 0) {
    return { error: 'Preço válido é obrigatório' }
  }

  try {
    await prisma.produtos.update({
      where: { id },
      data: {
        nome: nome.trim(),
        categoriaId,
        preco: parseFloat(preco),
        descricao: descricao?.trim() || null,
      },
    })

    revalidatePath('/painel/produtos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao editar produto:', error)
    return { error: 'Erro ao editar produto' }
  }
}

export async function excluirProduto(id: string) {
  try {
    await prisma.produtos.delete({
      where: { id },
    })

    revalidatePath('/painel/produtos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao excluir produto:', error)
    return { error: 'Erro ao excluir produto' }
  }
}