-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: heros
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
-- Table structure for table `battle_information`
--

DROP TABLE IF EXISTS `battle_information`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `battle_information` (
  `id_hero1` int DEFAULT NULL,
  `id_hero2` int DEFAULT NULL,
  `id_winner` int DEFAULT NULL,
  `id_loser` int DEFAULT NULL,
  `id_class1` int DEFAULT NULL,
  `totalDmg1` int DEFAULT '0',
  `totalDmgStopped1` int DEFAULT '0',
  `numHits1` int DEFAULT '0',
  `id_class2` int DEFAULT NULL,
  `totalDmg2` int DEFAULT '0',
  `totalDmgStopped2` int DEFAULT '0',
  `numHits2` int DEFAULT '0',
  `version` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
-- Table structure for table `hero`
--

DROP TABLE IF EXISTS `hero`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hero` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
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
  `isAlive` tinyint DEFAULT '1',
  `kills` int DEFAULT '0',
  `kidnaped` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `id_class` (`id_class`),
  CONSTRAINT `hero_ibfk_1` FOREIGN KEY (`id_class`) REFERENCES `class` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16139 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  `winrate` int DEFAULT NULL,
  KEY `id_class` (`id_class`),
  CONSTRAINT `version_stats_ibfk_1` FOREIGN KEY (`id_class`) REFERENCES `class` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'heros'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-10-23 19:14:53
