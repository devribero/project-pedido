/*
  Warnings:

  - You are about to drop the column `nome` on the `pedidos` table. All the data in the column will be lost.
  - Added the required column `produtoId` to the `Pedidos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pedidos` DROP COLUMN `nome`,
    ADD COLUMN `produtoId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Pedidos` ADD CONSTRAINT `Pedidos_produtoId_fkey` FOREIGN KEY (`produtoId`) REFERENCES `Produtos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
