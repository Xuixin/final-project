-- DropForeignKey
ALTER TABLE `shipping` DROP FOREIGN KEY `Shipping_employeeId_fkey`;

-- AlterTable
ALTER TABLE `shipping` MODIFY `employeeId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Shipping` ADD CONSTRAINT `Shipping_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
