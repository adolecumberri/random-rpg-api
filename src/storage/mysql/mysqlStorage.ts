
import { Character } from 'rpg-ts';
import StorageModule from './../storageModule';
import mysqlClient from './dbConfig';

class MysqlStorage implements StorageModule {
  async saveData(character: Character & {surname: string, className: string} ): Promise<void> {
    // Lógica para guardar el personaje en la base de datos MySQL
    // Utiliza los valores necesarios del objeto Character
    const { id, isAlive, name, stats, surname, skill, className } = character;
    const query = `INSERT INTO characters (id, isAlive, name, stats, surname, skillProbability, className) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const params = [id, isAlive, name, JSON.stringify(stats), surname, skill.probability, className];

    // Ejecutar la consulta a la base de datos
    await mysqlClient.execute(query, params);
  }
}

export default MysqlStorage;
