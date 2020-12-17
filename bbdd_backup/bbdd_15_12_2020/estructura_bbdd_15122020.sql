use hero;


/* Class: tabla primaria de clases.*/
CREATE TABLE `class` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/* Map: tabla base de mapas. */
CREATE TABLE `map` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(225) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `hero` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `surname` varchar(25) DEFAULT NULL,
  `gender` tinyint DEFAULT NULL,
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
  `deaths` int DEFAULT '0',
  `kills` int DEFAULT '0',
  `isalive` tinyint DEFAULT '1',
  `alias` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_class` (`id_class`),
  CONSTRAINT `hero_ibfk_1` FOREIGN KEY (`id_class`) REFERENCES `class` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20001 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/* Map_locations: NM consigo misma (map).*/
CREATE TABLE `map_locations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `id_map` int NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `id_map_fk` FOREIGN KEY (`id_map`) REFERENCES `map` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Conexiones del mapa: NM consigo misma*/
CREATE TABLE `map_connections` (
  `origin` int NOT NULL,
  `destination` int NOT NULL,
  PRIMARY KEY (`origin`,`destination`),
  KEY `destiny_fk_idx` (`destination`),
  CONSTRAINT `destiny_fk` FOREIGN KEY (`destination`) REFERENCES `map_locations` (`id`),
  CONSTRAINT `origin_fk` FOREIGN KEY (`origin`) REFERENCES `map_locations` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `fight1v1` (
  `id` int NOT NULL AUTO_INCREMENT,
  `turns` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8467 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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

CREATE TABLE `groupfight` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `drawed` tinyint DEFAULT '0',
  `turns` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=329 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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

/* Version de la estadisticas */
CREATE TABLE `version_stats` (
  `id_class` int DEFAULT NULL,
  `version` int DEFAULT NULL,
  `fights_number` int DEFAULT NULL,
  `winrate` decimal(6,2) DEFAULT NULL,
  KEY `id_class` (`id_class`),
  CONSTRAINT `version_stats_ibfk_1` FOREIGN KEY (`id_class`) REFERENCES `class` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/* Statistics: tabla base de estadisticas en peleas simples. */
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

CREATE TABLE `crew` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) DEFAULT NULL,
  `evento` int DEFAULT NULL,
  `side` varchar(45) DEFAULT NULL,
  `ingame` tinyint DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=307 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `heros_crew` (
  `id_crew` int NOT NULL,
  `id_hero` int NOT NULL,
  `hero_isalive` tinyint DEFAULT '1',
  `currenthp` int DEFAULT '-1',
  PRIMARY KEY (`id_crew`,`id_hero`),
  KEY `h_fk_idx` (`id_hero`),
  CONSTRAINT `c` FOREIGN KEY (`id_crew`) REFERENCES `crew` (`id`),
  CONSTRAINT `h_fk` FOREIGN KEY (`id_hero`) REFERENCES `hero` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Eventos para las movidas.*/
CREATE TABLE `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `id_map` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_map_fk_idx` (`id_map`),
  CONSTRAINT `id_map_fk` FOREIGN KEY (`id_map`) REFERENCES `map` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `event_journal` (
  `id_event` int NOT NULL,
  `id_groupfight` int NOT NULL,
  `id_map` int NOT NULL,
  `event_turn` int DEFAULT NULL,
  KEY `event_journal_ibfk_2` (`id_groupfight`),
  KEY `event_journal_ibfk_3` (`id_map`),
  KEY `event_journal_ibfk_1_idx` (`id_event`),
  CONSTRAINT `event_journal_ibfk_1` FOREIGN KEY (`id_event`) REFERENCES `events` (`id`),
  CONSTRAINT `event_journal_ibfk_2` FOREIGN KEY (`id_groupfight`) REFERENCES `groupfight` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `event_journal_ibfk_3` FOREIGN KEY (`id_map`) REFERENCES `map_locations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;