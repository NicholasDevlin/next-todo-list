/*
  Warnings:

  - You are about to drop the column `published` on the `Todos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Todos` DROP COLUMN `published`,
    ADD COLUMN `status` ENUM('PENDING', 'COMPLETED') NOT NULL DEFAULT 'PENDING';
