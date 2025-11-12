/*
  Warnings:

  - You are about to drop the column `produtoId` on the `pedidos` table. All the data in the column will be lost.
  - Added the required column `nome_cliente` to the `Pedidos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preco` to the `Produtos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `pedidos` DROP FOREIGN KEY `Pedidos_produtoId_fkey`;

-- DropIndex
DROP INDEX `Pedidos_produtoId_fkey` ON `pedidos`;

-- AlterTable
ALTER TABLE `pedidos` DROP COLUMN `produtoId`,
    ADD COLUMN `nome_cliente` VARCHAR(191) NOT NULL DEFAULT 'Cliente';

-- AlterTable
ALTER TABLE `produtos` ADD COLUMN `descricao` VARCHAR(191) NULL,
    ADD COLUMN `preco` DECIMAL(10, 2) NOT NULL DEFAULT 0.00;

-- CreateTable
CREATE TABLE `PedidosProdutos` (
    `id` VARCHAR(191) NOT NULL,
    `pedidoId` VARCHAR(191) NOT NULL,
    `produtoId` VARCHAR(191) NOT NULL,
    `quantidade` INTEGER NOT NULL DEFAULT 1,

    UNIQUE INDEX `PedidosProdutos_pedidoId_produtoId_key`(`pedidoId`, `produtoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PedidosProdutos` ADD CONSTRAINT `PedidosProdutos_pedidoId_fkey` FOREIGN KEY (`pedidoId`) REFERENCES `Pedidos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PedidosProdutos` ADD CONSTRAINT `PedidosProdutos_produtoId_fkey` FOREIGN KEY (`produtoId`) REFERENCES `Produtos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
