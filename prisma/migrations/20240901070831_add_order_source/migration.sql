/*
  Warnings:

  - Added the required column `order_sourceId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `order_sourceId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Order_source` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `source_name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Order_source_source_name_key`(`source_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_order_sourceId_fkey` FOREIGN KEY (`order_sourceId`) REFERENCES `Order_source`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
