create database random_rpg_api;
use random_rpg_api;

DROP TABLE IF EXISTS `teams`;
CREATE TABLE `teams` (
  `id` int NOT NULL AUTO_INCREMENT,
  `teamId` bigint NOT NULL,
  `name` varchar(255) NOT NULL,
  `members` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_teamId` (`teamId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `heroes`;
CREATE TABLE `heroes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `characterId` bigint DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `className` varchar(50) NOT NULL,
  `hp` int NOT NULL DEFAULT '1',
  `totalHp` int NOT NULL DEFAULT '1',
  `attack` int NOT NULL DEFAULT '1',
  `defence` int NOT NULL DEFAULT '0',
  `crit` int NOT NULL DEFAULT '0',
  `critMultiplier` int NOT NULL DEFAULT '0',
  `accuracy` int NOT NULL DEFAULT '100',
  `evasion` int NOT NULL DEFAULT '0',
  `attackInterval` int NOT NULL DEFAULT '1',
  `regeneration` int NOT NULL DEFAULT '0',
  `isAlive` tinyint(1) NOT NULL DEFAULT '1',
  `skillProbability` int DEFAULT '100',
  PRIMARY KEY (`id`),
  KEY `idx_characterId` (`characterId`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table structure for table `teams_heroes`

DROP TABLE IF EXISTS `teams_heroes`;
CREATE TABLE `teams_heroes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `teamId` int NOT NULL,
  `characterId` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table structure for table `attackrecord`
DROP TABLE IF EXISTS `attackrecord`;
CREATE TABLE `attackrecord` (
  `id` int NOT NULL AUTO_INCREMENT,
  `attackrecordId` int NOT NULL,
  `attackType` enum('NORMAL','MISS','CRITICAL','TRUE','SKILL') NOT NULL,
  `damage` int NOT NULL,
  `characterId` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_characterId` (`characterId`),
  KEY `idx_attackrecordId` (`attackrecordId`),
  CONSTRAINT `fk_attackrecord_character` FOREIGN KEY (`characterId`) REFERENCES `heroes` (`characterId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table structure for table `defencerecord`
DROP TABLE IF EXISTS `defencerecord`;
CREATE TABLE `defencerecord` (
  `id` int NOT NULL AUTO_INCREMENT,
  `defencerecordId` bigint NOT NULL,
  `defenceType` enum('NORMAL','EVASION','MISS','TRUE','SKILL') NOT NULL,
  `damageReceived` int NOT NULL,
  `characterId` bigint DEFAULT NULL,
  `attackerId` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_characterId` (`characterId`),
  KEY `idx_defencerecordId` (`defencerecordId`),
  CONSTRAINT `fk_defencerecord_character` FOREIGN KEY (`characterId`) REFERENCES `heroes` (`characterId`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table structure for table `fightrecords`
DROP TABLE IF EXISTS `fightrecords`;
CREATE TABLE `fightrecords` (
  `id` int NOT NULL AUTO_INCREMENT,
  `teamId` bigint NOT NULL,
  `characterId` bigint NOT NULL,
  `stats` json NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_teamId` (`teamId`),
  KEY `idx_characterId` (`characterId`),
  CONSTRAINT `fk_fightrecords_team` FOREIGN KEY (`teamId`) REFERENCES `teams` (`teamId`) ON DELETE CASCADE,
  CONSTRAINT `fk_fightrecords_character` FOREIGN KEY (`characterId`) REFERENCES `heroes` (`characterId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table structure for table `attacks` comes from teams.
DROP TABLE IF EXISTS `attacks`;
CREATE TABLE `attacks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fightRecordId` bigint NOT NULL,
  `value` int NOT NULL,
  `total` int NOT NULL,
  `NORMAL` int NOT NULL,
  `CRITICAL` int NOT NULL,
  `MISS` int NOT NULL,
  `SKILL` int NOT NULL,
  `TRUE_damage` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_fightRecordId` (`fightRecordId`),
  CONSTRAINT `fk_attacks_fightrecord` FOREIGN KEY (`id`) REFERENCES `fightrecords` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table structure for table `defences`
DROP TABLE IF EXISTS `defences`;
CREATE TABLE `defences` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fightRecordId` bigint NOT NULL,
  `value` int NOT NULL,
  `total` int NOT NULL,
  `NORMAL` int NOT NULL,
  `EVASION` int NOT NULL,
  `MISS` int NOT NULL,
  `SKILL` int NOT NULL,
  `TRUE_damage` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_fightRecordId` (`fightRecordId`),
  CONSTRAINT `fk_defences_fightrecord` FOREIGN KEY (`id`) REFERENCES `fightrecords` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table structure for table `battles`
DROP TABLE IF EXISTS `battles`;
CREATE TABLE `battles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `battleId` bigint NOT NULL,
  `battleType` enum('INTERVAL_BASED','TURN_BASED') NOT NULL,
  `battleDimension` enum('Character','TEAM') NOT NULL,
  PRIMARY KEY (`id`,`battleId`),
  KEY `idx_battleId` (`battleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table structure for table `battlelogs`
DROP TABLE IF EXISTS `battlelogs`;
CREATE TABLE `battlelogs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `battleId` bigint NOT NULL,
  `intervalOfTurn` int NOT NULL,
  `idAttackRecord` int NOT NULL,
  `idDefenceRecord` bigint NOT NULL,
  `attackerId` bigint NOT NULL,
  `defenderId` bigint NOT NULL,
  `attackerHp` int NOT NULL,
  `defenderHp` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_battleId_bl` (`battleId`),
  KEY `idx_attackerId` (`attackerId`),
  KEY `idx_defenderId` (`defenderId`),
  CONSTRAINT `fk_battlelogs_battle` FOREIGN KEY (`battleId`) REFERENCES `battles` (`battleId`) ON DELETE CASCADE,
  CONSTRAINT `fk_battlelogs_attackrecord` FOREIGN KEY (`idAttackRecord`) REFERENCES `attackrecord` (`attackrecordId`) ON DELETE CASCADE,
  CONSTRAINT `fk_battlelogs_defencerecord` FOREIGN KEY (`idDefenceRecord`) REFERENCES `defencerecord` (`defencerecordId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table structure for table `finallog`
DROP TABLE IF EXISTS `finallog`;
CREATE TABLE `finallog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `battleId` bigint NOT NULL,
  `winnerId` bigint NOT NULL,
  `winnerHp` int NOT NULL,
  `looserId` bigint NOT NULL,
  `looserHp` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_battleId` (`battleId`), -- Index for battleId
  KEY `idx_winnerId` (`winnerId`), -- Index for winnerId
  KEY `idx_looserId` (`looserId`), -- Index for looserId
  CONSTRAINT `fk_finallog_battleId` FOREIGN KEY (`battleId`) REFERENCES `battles` (`battleId`) ON DELETE CASCADE,
  CONSTRAINT `fk_finallog_winnerId` FOREIGN KEY (`winnerId`) REFERENCES `heroes` (`characterId`),
  CONSTRAINT `fk_finallog_looserId` FOREIGN KEY (`looserId`) REFERENCES `heroes` (`characterId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

