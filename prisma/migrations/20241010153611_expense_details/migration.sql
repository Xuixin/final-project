-- CreateTable
CREATE TABLE `expense_detail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `expenseId` INTEGER NULL,
    `ingredientId` INTEGER NULL,
    `quantity` DOUBLE NOT NULL,
    `unit` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `expense_detail` ADD CONSTRAINT `Expens_expens_dt_fkey` FOREIGN KEY (`expenseId`) REFERENCES `expense`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `expense_detail` ADD CONSTRAINT `Igd_ingredientId_fkey` FOREIGN KEY (`ingredientId`) REFERENCES `ingredient`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
