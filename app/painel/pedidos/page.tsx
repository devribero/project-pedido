import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import prisma from '@/lib/prisma-client'
import AddPedido from '@/app/painel/pedidos/_components/add-pedidos'
import EditPedido from '@/app/painel/pedidos/_components/edit-pedidos'
import DeletePedido from '@/app/painel/pedidos/_components/delete-pedidos'
import type { Pedidos } from '@/generated/prisma/client'

export default async function PedidosPage() {
  const [pedidos, produtos] = await Promise.all([
    prisma.pedidos.findMany({
      include: {
        produtos: {
          include: {
            produto: true
          }
        }
      },
      orderBy: {
        id: 'desc'
      }
    }),
    prisma.produtos.findMany({
      orderBy: {
        nome: 'asc'
      }
    })
  ])

  return (
    <div className="space-y-6">
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>Pedidos</h1>
        <AddPedido produtos={produtos} />
      </div>

      {pedidos.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-2 rounded-md border border-dashed p-8 text-center text-muted-foreground'>
          <p>Nenhum pedido cadastrado</p>
          <p className="text-sm">Clique em "Adicionar Pedido" para criar seu primeiro pedido.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pedidos.map((pedido) => (
            <Card key={pedido.id} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="line-clamp-1 text-lg">{pedido.nome_cliente}</CardTitle>
              </CardHeader>
              <CardContent className="pb-3 space-y-2">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Produtos:</p>
                  {pedido.produtos.map((pp) => (
                    <p key={pp.id} className="text-sm text-muted-foreground">
                      {pp.produto.nome} (x{pp.quantidade})
                    </p>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">ID: {pedido.id}</p>
              </CardContent>
              <CardContent className="pb-3">
                <p className="text-sm text-muted-foreground">Endereço: {pedido.endereco || '-'}</p>
              </CardContent>
              <CardContent className="pb-3">
                <p className="text-sm text-muted-foreground">Telefone: {pedido.telefone || '-'}</p>
              </CardContent>
              <CardFooter className='flex items-center justify-end gap-2'>
                <EditPedido pedido={pedido} produtos={produtos} />
                <DeletePedido pedido={pedido} />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}