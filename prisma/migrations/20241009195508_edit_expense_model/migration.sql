/*
  Warnings:

  - The values [food] on the enum `expense_category` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `expense` ADD COLUMN `description` VARCHAR(191) NULL,
    MODIFY `category` ENUM('wage', 'ingredient', 'other') NOT NULL;
