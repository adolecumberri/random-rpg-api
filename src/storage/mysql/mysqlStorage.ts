import StorageModule from './../storageModule';
import mysqlClient from './dbConfig';
import { Hero, StoredHero } from '../../types';
import { RowDataPacket } from 'mysql2';

class MysqlStorage implements StorageModule {
    constructor() {
        // Conectar al servidor MySQL
        mysqlClient.connect((err) => {
            if (err) {
                console.error('Error al conectar a la base de datos:', err);
                return;
            }
            console.log('Conexión exitosa a la base de datos MySQL');
        });
    }
    async saveHero(hero: Hero): Promise<void> {
        // Lógica para guardar el personaje en la base de datos MySQL
        // Utiliza los valores necesarios del objeto Hero
        console.log('Guardando personaje en la base de datos');

        const values = 'heroId, name, surname, gender, className, hp, totalHp, attack, defence, crit, critMultiplier, accuracy, evasion, attackInterval, regeneration, isAlive';

        const hero_values = `'${hero.id}', '${hero.name}', '${hero.surname}', '${hero.gender}', '${hero.className}', '${hero.stats.hp}', '${hero.stats.totalHp}', '${hero.stats.attack}', '${hero.stats.defence}', '${hero.stats.crit}', '${hero.stats.critMultiplier}', '${hero.stats.accuracy}', '${hero.stats.evasion}', '${hero.stats.attackInterval}', '${hero.stats.regeneration}', '${Number(hero.isAlive)}'`;

        const query = `INSERT INTO Heroes (${values}) VALUES (${hero_values})`;

        try {
            await new Promise<void>((resolve, reject) => {
                mysqlClient.execute(query, (err, result) => {
                    if (err) {
                        console.error('Error al guardar el personaje en la base de datos:', err);
                        reject(err);
                        return;
                    }
                    console.log('Personaje guardado en la base de datos');
                    resolve();
                });
            });
        } catch (error) {
            throw error;
        }
    }

    async saveHeroes(heroes: Hero[]): Promise<void> {
        // Logic to save an array of Heroes in the MySQL database
        // Use the necessary values from each Hero object

        try {
            for (const hero of heroes) {
                const values = 'heroId, name, surname, gender, className, hp, totalHp, attack, defence, crit, critMultiplier, accuracy, evasion, attackInterval, regeneration, isAlive';

                const hero_values = `'${hero.id}', '${hero.name}', '${hero.surname}', '${hero.gender}', '${hero.className}', '${hero.stats.hp}', '${hero.stats.totalHp}', '${hero.stats.attack}', '${hero.stats.defence}', '${hero.stats.crit}', '${hero.stats.critMultiplier}', '${hero.stats.accuracy}', '${hero.stats.evasion}', '${hero.stats.attackInterval}', '${hero.stats.regeneration}', '${Number(hero.isAlive)}'`;

                const query = `INSERT INTO Heroes (${values}) VALUES (${hero_values})`;

                await new Promise<void>((resolve, reject) => {
                    mysqlClient.execute(query, (err, result) => {
                        if (err) {
                            console.error('Error al guardar el personaje en la base de datos:', err);
                            reject(err);
                            return;
                        }
                        console.log('Personaje guardado en la base de datos');
                        resolve();
                    });
                });
            }
        } catch (error) {
            throw error;
        }
    }

    async getHeroById(id: number): Promise<StoredHero | null> {
        const query = `SELECT * FROM Heroes WHERE heroId = ${id}`;

        return new Promise<StoredHero | null>((resolve, reject) => {
            mysqlClient.execute<RowDataPacket[]>(query, (err, result) => {
                if (err) {
                    console.error('Error al ejecutar la consulta:', err);
                    reject(err);
                    return;
                }

                if (Array.isArray(result) && result.length > 0) {
                    // Aquí puedes hacer el mapeo o ajustes necesarios para la variable solution
                    const solution = result[0] as StoredHero;
                    console.log('entro?', solution);
                    resolve(solution);
                } else {
                    resolve(null);
                }
            });
        });
    }
}

export default MysqlStorage;
