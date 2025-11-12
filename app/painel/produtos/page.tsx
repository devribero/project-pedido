import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import prisma from '@/lib/prisma-client'
import AddProdutos from '@/app/painel/produtos/_components/add-produtos'
import EditProduto from '@/app/painel/produtos/_components/edit-produtos'
import DeleteProduto from '@/app/painel/produtos/_components/delete-produtos'

export default async function ProdutosPage() {
  const [produtos, categorias] = await Promise.all([
    prisma.produtos.findMany({
      orderBy: {
        nome: 'asc'
      },
      include: {
        categoria: true
      }
    }),
    prisma.categorias.findMany({
      orderBy: {
        nome: 'asc'
      }
    })
  ])

  return (
    <div className="space-y-6">
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>Produtos</h1>
        <AddProdutos categorias={categorias} />
      </div>

      {produtos.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-2 rounded-md border border-dashed p-8 text-center text-muted-foreground'>
          <p>Nenhum produto cadastrado</p>
          <p className="text-sm">Clique em "Adicionar Produto" para criar seu primeiro produto.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {produtos.map(produto => (
            <Card key={produto.id} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="line-clamp-1 text-lg">{produto.nome}</CardTitle>
              </CardHeader>
              <CardContent className="pb-3 space-y-1">
                <p className="text-sm text-muted-foreground">Categoria: {produto.categoria.nome}</p>
                {produto.descricao && <p className="text-sm text-muted-foreground">{produto.descricao}</p>}
                <p className="text-sm font-semibold">R$ {parseFloat(produto.preco.toString()).toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">ID: {produto.id}</p>
              </CardContent>
              <CardFooter className='flex items-center justify-end gap-2'>
                <EditProduto produto={produto} categorias={categorias} />
                <DeleteProduto produto={produto} />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}