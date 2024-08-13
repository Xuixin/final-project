/*
  Warnings:

  - Added the required column `wageperday` to the `Role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wagepermonth` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `role` ADD COLUMN `wageperday` INTEGER NOT NULL,
    ADD COLUMN `wagepermonth` INTEGER NOT NULL;
