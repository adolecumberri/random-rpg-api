import { Character } from 'rpg-ts';
import StorageModule from './../storageModule';
import mysqlClient from './dbConfig';
import { Hero, StoredHero } from '../../types';
import { restoreStoredHero } from '../../controllers';

class MysqlStorage implements StorageModule {
    constructor() {
        console.log("MysqlStorage constructor");
    }
    async saveHero(hero: Hero): Promise<void> {
        // Lógica para guardar el personaje en la base de datos MySQL
        // Utiliza los valores necesarios del objeto Hero
        console.log('Guardando personaje en la base de datos');



        let values = 'heroId, name, surname, gender, className, hp, totalHp, attack, defence, crit, critMultiplier, accuracy, evasion, attackInterval, regeneration, isAlive';
    
        let hero_values = `'${hero.id}', '${hero.name}', '${hero.surname}', '${hero.gender}', '${hero.className}', '${hero.stats.hp}', '${hero.stats.totalHp}', '${hero.stats.attack}', '${hero.stats.defence}', '${hero.stats.crit}', '${hero.stats.critMultiplier}', '${hero.stats.accuracy}', '${hero.stats.evasion}', '${hero.stats.attackInterval}', '${hero.stats.regeneration}', '${Number(hero.isAlive)}'`;

        const query = `INSERT INTO Heroes (${values}) 
                   VALUES (${hero_values})`;

        // Ejecutar la consulta a la base de datos
        const solucion = await mysqlClient.execute(query, (err, result) => {
            if (err) {
                console.error('Error al guardar el personaje en la base de datos:', err);
                throw err;
            }
            console.log('Personaje guardado en la base de datos');
            return result;
        });
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
