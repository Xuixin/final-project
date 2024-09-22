-- AlterTable
ALTER TABLE `payment` ADD COLUMN `imgQr` VARCHAR(191) NULL,
    MODIFY `method` ENUM('Cash', 'PayPal', 'QRCode') NOT NULL DEFAULT 'PayPal';
