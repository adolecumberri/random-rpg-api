-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: heros2
-- ------------------------------------------------------
-- Server version	8.0.19

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
-- Table structure for table `class`
--

DROP TABLE IF EXISTS `class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `crew`
--

DROP TABLE IF EXISTS `crew`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `crew` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) DEFAULT NULL,
  `evento` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=307 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `event_journal`
--

DROP TABLE IF EXISTS `event_journal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_journal` (
  `id_event` int NOT NULL,
  `id_groupfight` int NOT NULL,
  `id_map` int NOT NULL,
  `event_turn` int DEFAULT NULL,
  KEY `id_event` (`id_event`),
  KEY `id_groupfight` (`id_groupfight`),
  KEY `id_map` (`id_map`),
  CONSTRAINT `event_journal_ibfk_1` FOREIGN KEY (`id_event`) REFERENCES `events` (`id`),
  CONSTRAINT `event_journal_ibfk_2` FOREIGN KEY (`id_groupfight`) REFERENCES `groupfight` (`id`),
  CONSTRAINT `event_journal_ibfk_3` FOREIGN KEY (`id_map`) REFERENCES `spainmap` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `fight1v1`
--

DROP TABLE IF EXISTS `fight1v1`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fight1v1` (
  `id` int NOT NULL AUTO_INCREMENT,
  `turns` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8467 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `fight1v1stats`
--

DROP TABLE IF EXISTS `fight1v1stats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fight1v1stats` (
  `id_hero` int NOT NULL,
  `id_fight` int NOT NULL,
  `hits` int DEFAULT NULL,
  `total_damage` int DEFAULT NULL,
  `crits` int DEFAULT NULL,
  `misses` int DEFAULT NULL,
  `hits_received` int DEFAULT NULL,
  `evasions` int DEFAULT NULL,
  `skills_used` int DEFAULT NULL,
  `currhp` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `groupfight`
--

DROP TABLE IF EXISTS `groupfight`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groupfight` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `drawed` tinyint DEFAULT '0',
  `turns` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `groupfightstats`
--

DROP TABLE IF EXISTS `groupfightstats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groupfightstats` (
  `id_hero` int NOT NULL,
  `id_fight` int NOT NULL,
  `turns` int DEFAULT NULL,
  `hits` int DEFAULT NULL,
  `total_damage` int DEFAULT NULL,
  `crits` int DEFAULT NULL,
  `misses` int DEFAULT NULL,
  `hits_received` int DEFAULT NULL,
  `evasions` int DEFAULT NULL,
  `skills_used` int DEFAULT NULL,
  `currhp` int DEFAULT NULL,
  `killed_by` int DEFAULT NULL,
  KEY `id_hero_fk_idx` (`id_hero`),
  CONSTRAINT `id_hero_fk` FOREIGN KEY (`id_hero`) REFERENCES `hero` (`id`),
  CONSTRAINT `id_killer_fk` FOREIGN KEY (`id_hero`) REFERENCES `hero` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hero`
--

DROP TABLE IF EXISTS `hero`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hero` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `surname` varchar(25) DEFAULT NULL,
  `gender` tinyint DEFAULT NULL,
  `id_class` int DEFAULT NULL,
  `hp` int DEFAULT NULL,
  `currentHp` int DEFAULT NULL,
  `dmg` int DEFAULT NULL,
  `def` int DEFAULT NULL,
  `crit` float DEFAULT NULL,
  `critDmg` float DEFAULT NULL,
  `accuracy` float DEFAULT NULL,
  `evasion` float DEFAULT NULL,
  `att_interval` int DEFAULT NULL,
  `reg` float DEFAULT NULL,
  `deaths` int DEFAULT '0',
  `kills` int DEFAULT '0',
  `isalive` tinyint DEFAULT '1',
  `alias` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_class` (`id_class`),
  CONSTRAINT `hero_ibfk_1` FOREIGN KEY (`id_class`) REFERENCES `class` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20001 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `heros_crew`
--

DROP TABLE IF EXISTS `heros_crew`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `heros_crew` (
  `id_crew` int NOT NULL,
  `id_hero` int NOT NULL,
  PRIMARY KEY (`id_crew`,`id_hero`),
  KEY `h_fk_idx` (`id_hero`),
  CONSTRAINT `c` FOREIGN KEY (`id_crew`) REFERENCES `crew` (`id`),
  CONSTRAINT `h_fk` FOREIGN KEY (`id_hero`) REFERENCES `hero` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `spainmap`
--

DROP TABLE IF EXISTS `spainmap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `spainmap` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `spainmapconnections`
--

DROP TABLE IF EXISTS `spainmapconnections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `spainmapconnections` (
  `origin` int NOT NULL,
  `destination` int NOT NULL,
  PRIMARY KEY (`origin`,`destination`),
  KEY `destiny_fk_idx` (`destination`),
  CONSTRAINT `destiny_fk` FOREIGN KEY (`destination`) REFERENCES `spainmap` (`id`),
  CONSTRAINT `origin_fk` FOREIGN KEY (`origin`) REFERENCES `spainmap` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `statistics`
--

DROP TABLE IF EXISTS `statistics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `statistics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_class` int DEFAULT NULL,
  `hp` int DEFAULT NULL,
  `dmg` int DEFAULT NULL,
  `def` int DEFAULT NULL,
  `crit` float DEFAULT NULL,
  `critDmg` float DEFAULT NULL,
  `accuracy` float DEFAULT NULL,
  `evasion` float DEFAULT NULL,
  `att_interval` int DEFAULT NULL,
  `reg` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `statistics_ibfk_1` (`id_class`),
  CONSTRAINT `statistics_ibfk_1` FOREIGN KEY (`id_class`) REFERENCES `class` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `version_stats`
--

DROP TABLE IF EXISTS `version_stats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `version_stats` (
  `id_class` int DEFAULT NULL,
  `version` int DEFAULT NULL,
  `fights_number` int DEFAULT NULL,
  `winrate` decimal(6,2) DEFAULT NULL,
  KEY `id_class` (`id_class`),
  CONSTRAINT `version_stats_ibfk_1` FOREIGN KEY (`id_class`) REFERENCES `class` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'heros2'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-12-11 14:31:44
