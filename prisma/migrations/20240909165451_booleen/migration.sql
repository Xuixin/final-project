/*
  Warnings:

  - You are about to alter the column `status` on the `attendance` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `attendance` MODIFY `status` BOOLEAN NOT NULL;
