/*
  Warnings:

  - You are about to drop the `banner` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `attendance` MODIFY `createdAt` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- DropTable
DROP TABLE `banner`;
