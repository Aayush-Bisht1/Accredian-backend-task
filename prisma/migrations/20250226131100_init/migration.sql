-- CreateTable
CREATE TABLE `Referral` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `referrerName` VARCHAR(100) NOT NULL,
    `referrerEmail` VARCHAR(100) NOT NULL,
    `recipientName` VARCHAR(100) NOT NULL,
    `recipientEmail` VARCHAR(100) NOT NULL,
    `recipientPhone` VARCHAR(100) NOT NULL,
    `course` VARCHAR(100) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
