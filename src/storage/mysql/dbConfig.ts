// mysqlClient.ts

import mysql from 'mysql2';

// Configuración de conexión a la base de datos MySQL
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'random_rpg_api',
};

// Crear una instancia del cliente de MySQL
const mysqlClient = mysql.createConnection(dbConfig);

export default mysqlClient;
