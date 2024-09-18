/*
  Warnings:

  - Added the required column `type` to the `Table` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `table` ADD COLUMN `type` ENUM('inside', 'outside') NOT NULL;
