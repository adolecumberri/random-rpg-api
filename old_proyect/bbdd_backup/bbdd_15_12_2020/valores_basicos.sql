

/*Classes*/
INSERT INTO `class` VALUES (1,'Archer'),(2,'Berserker'),(3,'Deffender'),(4,'fencers'),(5,'Ninja'),(6,'Paladin'),(7,'Sniper'),(8,'Soldier'),(9,'Thieve');

/*estadisticcas*/
INSERT INTO `statistics` VALUES (1,NULL,70,10,7,0.1,1,0.9,0.1,12,0.6),(2,1,18,13,-1,0.3,0.3,-0.05,0.24,-5,0),(3,2,70,25,-2,0.05,0,-0.05,0.05,-1,0.2),(4,3,42,6,31,-0.1,0,0.04,-0.05,3,0.2),(5,4,34,16,11,0.1,0,-0.05,0.1,0,0),(6,5,-28,14,-2,0.4,0.25,0,0.33,-2,0),(7,6,50,19,21,0.1,0,0,0,-1,0.2),(8,7,5,33,-2,0.7,2.7,-0.6,0,14,-0.2),(9,8,35,21,16,0.2,0.1,0,0.1,0,0),(10,9,25,14,3,0.42,0.24,-0.19,0.22,-1,0.3);

/* estadisticas de las versiones*/
INSERT INTO `version_stats` VALUES (1,1,276,24.00),(1,1,276,24.00),(2,1,779,35.00),(3,1,1054,81.00),(4,1,864,43.00),(5,1,1210,72.00),(6,1,605,20.00),(7,1,792,59.00),(8,1,816,34.00),(9,1,445,29.00),(1,2,769,25.00),(2,2,1293,66.00),(3,2,1100,71.00),(4,2,1455,49.00),(5,2,1267,54.00),(6,2,1385,35.00),(7,2,1221,53.00),(8,2,1331,52.00),(9,2,720,37.00),(1,3,917,28.00),(2,3,1767,42.00),(3,3,1789,41.00),(4,3,1755,51.00),(5,3,1684,67.00),(6,3,1704,44.00),(7,3,1759,59.00),(8,3,1745,55.00),(9,3,864,62.00),(1,4,1865,52.00),(2,4,3600,50.00),(3,4,3700,73.00),(4,4,3673,55.00),(5,4,3581,31.00),(6,4,3710,54.00),(7,4,3494,34.00),(8,4,3606,53.00),(9,4,1668,48.00),(1,5,1462,55.00),(2,5,2815,47.00),(3,5,2752,61.00),(4,5,2670,54.00),(5,5,2684,34.00),(6,5,2348,52.00),(7,5,2848,48.00),(8,5,2629,55.00),(9,5,1220,48.00),(1,6,1001,81.51),(2,6,1371,53.16),(3,6,952,33.57),(4,6,1256,46.90),(5,6,1218,44.37),(6,6,1559,61.45),(7,6,1177,43.80),(8,6,1153,45.63),(9,6,854,67.51),(1,7,3306,52.66),(2,7,6552,54.33),(3,7,5784,59.75),(4,7,6569,50.98),(5,7,6197,39.35),(6,7,6395,54.15),(7,7,6435,40.83),(8,7,6490,46.39),(9,7,3273,56.61),(1,8,628,50.80),(2,8,1164,52.49),(3,8,1019,54.17),(4,8,1216,53.37),(5,8,1173,43.82),(6,8,1216,52.14),(7,8,1111,45.18),(8,8,1235,43.81),(9,8,666,58.86),(1,9,488,53.89),(2,9,951,51.63),(3,9,854,47.31),(4,9,1004,48.21),(5,9,877,46.86),(6,9,948,51.69),(7,9,976,49.18),(8,9,946,50.32),(9,9,494,54.66);

/* 1º mapa*/
INSERT INTO `map` VALUES( 1, 'spain');

/*genero mapa*/
insert into events values (	1, "Womens versus Mans", 1);

/*localizaciones del 1º mapa*/
INSERT INTO `map_locations` VALUES (1, 'albacete', 1),(2, 'almería', 1),(3, 'asturias', 1),(4, 'badajoz', 1),(5, 'barcelona', 1),(6, 'bilbao', 1),(7, 'ciudad real', 1),(8, 'huelva', 1),(9, 'madrid', 1),(10, 'malaga', 1),(11, 'murcia', 1),(12, 'palencia', 1),(13, 'salamanca', 1),(14, 'santiago de compostela', 1),(15, 'soria', 1),(16, 'valencia', 1),(17, 'zaragoza', 1) ;

/*conexiones del mapa*/
INSERT INTO `map_connections` values (1,7),(1,9),(1,11),(1,16),(2,10),(2,11),(3,6),(3,12),(3,14),(4,7),(4,8),(4,13),(5,15),(5,16),(5,17),(6,3),(6,12),(6,17),(7,1),(7,4),(7,9),(7,10),(8,4),(8,10),(9,1),(9,7),(9,12),(9,15),(10,2),(10,7),(10,8),(11,1),(11,2),(11,16),(12,3),(12,6),(12,9),(12,13),(13,4),(13,12),(13,14),(14,3),(14,13),(15,5),(15,9),(15,16),(15,17),(16,1),(16,5),(16,11),(16,15),(17,5),(17,6),(17,15);