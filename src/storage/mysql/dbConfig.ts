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

// Conectar al servidor MySQL
mysqlClient.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL');
});

export default mysqlClient;
