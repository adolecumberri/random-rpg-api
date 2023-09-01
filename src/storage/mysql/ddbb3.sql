-- MySQL dump 10.13  Distrib 8.0.22, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: random_rpg_api
-- ------------------------------------------------------
-- Server version	8.0.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attackrecord`
--

DROP TABLE IF EXISTS `attackrecord`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attackrecord` (
  `id` int NOT NULL AUTO_INCREMENT,
  `attackrecordId` bigint NOT NULL,
  `attackType` enum('NORMAL','MISS','CRITICAL','TRUE','SKILL') NOT NULL,
  `damage` int NOT NULL,
  `damageDealt` int DEFAULT '-1',
  `characterId` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_characterId` (`characterId`),
  KEY `idx_attackrecordId` (`attackrecordId`),
  CONSTRAINT `fk_attackrecord_character` FOREIGN KEY (`characterId`) REFERENCES `heroes` (`characterId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3804 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `attacks`
--

DROP TABLE IF EXISTS `attacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `battlelogs`
--

DROP TABLE IF EXISTS `battlelogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `battlelogs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `battleId` bigint NOT NULL,
  `intervalOfTurn` int NOT NULL,
  `idAttackRecord` bigint NOT NULL,
  `idDefenceRecord` bigint NOT NULL,
  `attackerId` bigint NOT NULL,
  `defenderId` bigint NOT NULL,
  `attackerHp` int NOT NULL,
  `defenderHp` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_battleId_bl` (`battleId`),
  KEY `idx_attackerId` (`attackerId`),
  KEY `idx_defenderId` (`defenderId`),
  KEY `fk_battlelogs_attackrecord` (`idAttackRecord`),
  KEY `fk_battlelogs_defencerecord` (`idDefenceRecord`),
  CONSTRAINT `fk_battlelogs_attackrecord` FOREIGN KEY (`idAttackRecord`) REFERENCES `attackrecord` (`attackrecordId`) ON DELETE CASCADE,
  CONSTRAINT `fk_battlelogs_battle` FOREIGN KEY (`battleId`) REFERENCES `battles` (`battleId`) ON DELETE CASCADE,
  CONSTRAINT `fk_battlelogs_defencerecord` FOREIGN KEY (`idDefenceRecord`) REFERENCES `defencerecord` (`defencerecordId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2264 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `battles`
--

DROP TABLE IF EXISTS `battles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `battles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `battleId` bigint NOT NULL,
  `battleType` enum('INTERVAL_BASED','TURN_BASED') NOT NULL,
  `battleDimension` enum('Character','TEAM') NOT NULL,
  PRIMARY KEY (`id`,`battleId`),
  KEY `idx_battleId` (`battleId`)
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `defencerecord`
--

DROP TABLE IF EXISTS `defencerecord`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=3813 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `defences`
--

DROP TABLE IF EXISTS `defences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `fightrecords`
--

DROP TABLE IF EXISTS `fightrecords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fightrecords` (
  `id` int NOT NULL AUTO_INCREMENT,
  `teamId` bigint NOT NULL,
  `characterId` bigint NOT NULL,
  `stats` json NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_teamId` (`teamId`),
  KEY `idx_characterId` (`characterId`),
  CONSTRAINT `fk_fightrecords_character` FOREIGN KEY (`characterId`) REFERENCES `heroes` (`characterId`) ON DELETE CASCADE,
  CONSTRAINT `fk_fightrecords_team` FOREIGN KEY (`teamId`) REFERENCES `teams` (`teamId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `finalcharacterbattlelog`
--

DROP TABLE IF EXISTS `finalcharacterbattlelog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `finalcharacterbattlelog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `battleId` bigint NOT NULL,
  `draw` tinyint NOT NULL,
  `winnerId` bigint DEFAULT NULL,
  `looserId` bigint DEFAULT NULL,
  `characterAId` bigint NOT NULL,
  `characterAHp` int DEFAULT '0',
  `characterBId` bigint NOT NULL,
  `characterBHp` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_battleId` (`battleId`),
  KEY `idx_winnerId` (`winnerId`),
  KEY `idx_looserId` (`looserId`),
  KEY `idx_characterAId` (`winnerId`),
  KEY `idx_characterBId` (`looserId`),
  KEY `fk_finallog_characterAId` (`characterAId`),
  KEY `fk_finallog_characterBId` (`characterBId`),
  CONSTRAINT `fk_finallog_battleId` FOREIGN KEY (`battleId`) REFERENCES `battles` (`battleId`) ON DELETE CASCADE,
  CONSTRAINT `fk_finallog_characterAId` FOREIGN KEY (`characterAId`) REFERENCES `heroes` (`characterId`),
  CONSTRAINT `fk_finallog_characterBId` FOREIGN KEY (`characterBId`) REFERENCES `heroes` (`characterId`),
  CONSTRAINT `fk_finallog_looserId` FOREIGN KEY (`looserId`) REFERENCES `heroes` (`characterId`),
  CONSTRAINT `fk_finallog_winnerId` FOREIGN KEY (`winnerId`) REFERENCES `heroes` (`characterId`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `finalteambattlelog`
--

DROP TABLE IF EXISTS `finalteambattlelog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `finalteambattlelog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `battleId` bigint NOT NULL,
  `draw` tinyint NOT NULL,
  `winnerId` bigint DEFAULT NULL,
  `looserId` bigint DEFAULT NULL,
  `teamAId` bigint DEFAULT NULL,
  `teamADeadMembers` int DEFAULT NULL,
  `teamAAliveMembers` int DEFAULT NULL,
  `teamATotalMembers` int DEFAULT NULL,
  `teamBId` bigint DEFAULT NULL,
  `teamBDeadMembers` int DEFAULT NULL,
  `teamBAliveMembers` int DEFAULT NULL,
  `teamBTotalMembers` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_battleId` (`battleId`),
  KEY `idx_teamAId` (`winnerId`),
  KEY `idx_teamBId` (`looserId`),
  KEY `fk_finallog_tAId` (`teamAId`),
  KEY `fk_finallog_tBId` (`teamBId`),
  CONSTRAINT `fk_finallog_bId` FOREIGN KEY (`battleId`) REFERENCES `battles` (`battleId`) ON DELETE CASCADE,
  CONSTRAINT `fk_finallog_lId` FOREIGN KEY (`looserId`) REFERENCES `teams` (`teamId`),
  CONSTRAINT `fk_finallog_tAId` FOREIGN KEY (`teamAId`) REFERENCES `teams` (`teamId`),
  CONSTRAINT `fk_finallog_tBId` FOREIGN KEY (`teamBId`) REFERENCES `teams` (`teamId`),
  CONSTRAINT `fk_finallog_wId` FOREIGN KEY (`winnerId`) REFERENCES `teams` (`teamId`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `heroes`
--

DROP TABLE IF EXISTS `heroes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `heroes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `characterId` bigint DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `className` varchar(50) NOT NULL,
  `isAlive` tinyint(1) NOT NULL DEFAULT '1',
  `currentLevel` int NOT NULL DEFAULT '1',
  `experience` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_characterId` (`characterId`)
) ENGINE=InnoDB AUTO_INCREMENT=215 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `heroesstats`
--

DROP TABLE IF EXISTS `heroesstats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `heroesstats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `heroId` bigint NOT NULL,
  `originalStats` tinyint NOT NULL,
  `hp` int NOT NULL,
  `totalHp` int NOT NULL,
  `attack` int NOT NULL,
  `defence` int NOT NULL,
  `crit` int NOT NULL,
  `critMultiplier` int NOT NULL,
  `accuracy` int NOT NULL,
  `evasion` int NOT NULL,
  `attackInterval` int NOT NULL,
  `regeneration` int NOT NULL,
  `skillProbability` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_heroId` (`heroId`),
  CONSTRAINT `heroesstats_ibfk_1` FOREIGN KEY (`heroId`) REFERENCES `heroes` (`characterId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=427 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `teams`
--

DROP TABLE IF EXISTS `teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teams` (
  `id` int NOT NULL AUTO_INCREMENT,
  `teamId` bigint NOT NULL,
  `name` varchar(255) NOT NULL,
  `members` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_teamId` (`teamId`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `teams_heroes`
--

DROP TABLE IF EXISTS `teams_heroes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teams_heroes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `teamId` bigint NOT NULL,
  `characterId` bigint NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=252 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping events for database 'random_rpg_api'
--

--
-- Dumping routines for database 'random_rpg_api'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-09-02  0:16:51
