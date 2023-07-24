import { Character } from 'rpg-ts';
import StorageModule from './../storageModule';
import mysqlClient from './dbConfig';
import { Hero, StoredHero } from '../../types';
import { restoreStoredHero } from '../../controllers';

class MysqlStorage implements StorageModule {
    constructor() {
        console.log("MysqlStorage constructor");
    }
    async saveHero(Hero: Hero): Promise<void> {
        // Lógica para guardar el personaje en la base de datos MySQL
        // Utiliza los valores necesarios del objeto Hero
        console.log('Guardando personaje en la base de datos');

        const { id, isAlive, name, stats, surname, className, gender } = Hero;
        const query = `INSERT INTO Heroes (id, isAlive, name, stats, surname, className, gender) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const params = [id, isAlive, name, stats, surname, className, gender];

        // Ejecutar la consulta a la base de datos
        const solucion = await mysqlClient.execute(query, params, (err, result) => {
            if (err) {
                console.error('Error al guardar el personaje en la base de datos:', err);
                return err;
            }
            console.log('Personaje guardado en la base de datos');
            return result;
        });

        console.log('done con sql', solucion);
    }

    async restoreHeroById(id: number): Promise<Character | null> {
        const query = 'SELECT * FROM Heroes WHERE id = ?';
        const params = [id];

        let solution: Character | null = null;
        await mysqlClient.execute(query, params, (err, result) => {
            if (Array.isArray(result) && result.length > 0) {
                const heroData = result[0] as StoredHero;
    
                // Restore the character using the RestoreCharacter function
                solution = restoreStoredHero(heroData);
            } else {
                return null;
            }
        });

        return solution;

    }
}

export default MysqlStorage;
