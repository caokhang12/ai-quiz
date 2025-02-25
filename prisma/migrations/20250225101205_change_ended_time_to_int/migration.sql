-- CreateTable
CREATE TABLE `Game` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `timeStarted` DATETIME(3) NOT NULL,
    `topic` VARCHAR(191) NOT NULL,
    `timeEnded` INTEGER NOT NULL,
    `gameType` ENUM('MULTI_CHOICE', 'OPEN_ENDED') NOT NULL,

    INDEX `Game_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Question` (
    `id` VARCHAR(191) NOT NULL,
    `question` VARCHAR(191) NOT NULL,
    `answer` VARCHAR(191) NOT NULL,
    `gameId` VARCHAR(191) NOT NULL,
    `options` JSON NULL,
    `percentageCorrect` DOUBLE NULL,
    `isCorrect` BOOLEAN NULL,
    `questionType` ENUM('MULTI_CHOICE', 'OPEN_ENDED') NOT NULL,
    `userAnswer` VARCHAR(191) NULL,

    INDEX `Question_gameId_idx`(`gameId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
