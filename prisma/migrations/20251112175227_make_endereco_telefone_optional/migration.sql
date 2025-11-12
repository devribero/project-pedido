/*
  Warnings:

  - Added the required column `categoriaId` to the `Produtos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pedidos` ADD COLUMN `endereco` VARCHAR(191) NULL,
    ADD COLUMN `telefone` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `produtos` ADD COLUMN `categoriaId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Produtos` ADD CONSTRAINT `Produtos_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `Categorias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
