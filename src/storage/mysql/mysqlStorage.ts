import { ResultSetHeader, RowDataPacket } from 'mysql2';
import StorageModule from './../storageModule';
import mysqlClient from './dbConfig';
import { Hero } from '../../types';
import { ActionRecord, AttackRecord, Character, DefenceRecord, Team, TotalActionRecord } from 'rpg-ts';
import { rowOfTableHeroes } from './mysqlStorageTypes';
import { HEROES_NAMES } from '../../constants';
import { restoreHero } from './mysqlStorageUtils';

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

    async saveActionRecord(actionRecord: ActionRecord): Promise<void> {
        // Check if ActionRecord is not null

        if (actionRecord) {
            // Handle attacks
            if (actionRecord.attacks && actionRecord.attacks.length > 0) {
                const attackRecords = actionRecord.attacks.map((attack) => ({
                    attackId: attack.id,
                    attackType: attack.attackType,
                    damage: attack.damage,
                    characterId: attack.characterId,
                }));

                // Insert attackRecords into the attackRecord table
                const attackInsertQuery = `INSERT INTO attackRecord (attackId, attackType, damage, characterId) VALUES ?`;
                await mysqlClient.execute(attackInsertQuery, [attackRecords.map(Object.values)]);
            }

            // Handle defences
            if (actionRecord.defences && actionRecord.defences.length > 0) {
                const defenceRecords = actionRecord.defences.map((defence) => ({
                    attackId: defence.id,
                    defenceType: defence.defenceType,
                    damageReceived: defence.damageReceived,
                    characterId: defence.characterId,
                }));

                // Insert defenceRecords into the defenceRecord table
                const defenceInsertQuery = `INSERT INTO defenceRecord (attackId, defenceType, damageReceived, characterId) VALUES ?`;
                await mysqlClient.execute(defenceInsertQuery, [defenceRecords.map(Object.values)]);
            }
        }
    }

    async saveHero(hero: Hero): Promise<any> {
        console.log('Guardando personaje en la base de datos');
    
        const values = 'heroId, name, surname, gender, className, hp, totalHp, attack, defence, crit, critMultiplier, accuracy, evasion, attackInterval, regeneration, isAlive, skillProbability';
        const hero_values = `'${hero.id}', '${hero.name}', '${hero.surname}', '${hero.gender}', '${hero.className}', '${hero.stats.hp}', '${hero.stats.totalHp}', '${hero.stats.attack}', '${hero.stats.defence}', '${hero.stats.crit}', '${hero.stats.critMultiplier}', '${hero.stats.accuracy}', '${hero.stats.evasion}', '${hero.stats.attackInterval}', '${hero.stats.regeneration}', '${Number(hero.isAlive)}', '${hero.skill.probability}'`;
        const query = `INSERT INTO Heroes (${values}) VALUES (${hero_values})`;
    
        try {
            const solution = await this.executeQuery<any>(query);
    
            if (hero.actionRecord) {
                await this.saveActionRecord(hero.actionRecord);
            }
    
            console.log('Personaje guardado en la base de datos');
            return solution;
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

    async getHeroById(id: number): Promise<Hero | null> {
        const heroQuery = `SELECT * FROM Heroes WHERE heroId = ${id}`;
        const attackRecordQuery = `SELECT * FROM attackRecord WHERE characterId = ${id}`;
        const defenceRecordQuery = `SELECT * FROM defenceRecord WHERE characterId = ${id}`;

        const [heroResult, attackRecordResult, defenceRecordResult] = await Promise.all([
            this.executeQuery<RowDataPacket[]>(heroQuery),
            this.executeQuery<RowDataPacket[]>(attackRecordQuery),
            this.executeQuery<RowDataPacket[]>(defenceRecordQuery),
        ]);

        if(heroResult.length === 0) {
            return null;
        }

        const hero = this.restoreStoredHero(heroResult[0] as rowOfTableHeroes);


        // Process the attack records
        const attackRecords: AttackRecord[] = attackRecordResult.map((row) => ({
            id: row.id,
            attackId: row.attackId,
            attackType: row.attackType,
            damage: row.damage,
            characterId: row.characterId,
        }));

        // Process the defence records
        const defenceRecords: DefenceRecord[] = defenceRecordResult.map((row) => ({
            id: row.id,
            attackId: row.attackId,
            defenceType: row.defenceType,
            damageReceived: row.damageReceived,
            characterId: row.characterId,
        }));
        hero.actionRecord!.attacks = attackRecords;
        hero.actionRecord!.defences = defenceRecords;

        return hero;
    }


    async executeQuery<T>(query: string): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            mysqlClient.execute(query, (err, result) => {
                if (err) {
                    console.error('Error al ejecutar la consulta:', err);
                    reject(err);
                } else {
                    resolve(result as unknown as T);
                }
            });
        });
    }

    async saveTeam(team: Team<Hero>): Promise<void> {

        const insertTeamQuery = `INSERT INTO teams (teamId, name, members) VALUES ('${team.id}','${team.name}', '${team.members.length}')`;
        const teamResult = await this.executeQuery<ResultSetHeader>(insertTeamQuery);
        const teamId = teamResult.insertId;

        for (const member of team.members) {
            const heroResult: any = await this.saveHero(member as Hero);
            const heroId = heroResult.insertId;
            await this.addHeroToTeam(teamId, heroId);
            // await this.saveFightRecord(team.getEveryFightRecord()[member.id], teamId)
        }
    }


    async addHeroToTeam(teamId: number, heroId: number): Promise<void> {
        const insertMemberQuery = `INSERT INTO teams_heroes (teamId, heroId) VALUES (${teamId}, ${heroId})`;
        await this.executeQuery<ResultSetHeader>(insertMemberQuery);
    }

    restoreStoredHero = (storedHero: rowOfTableHeroes): Hero => {
        const createHeroFunc = restoreHero[storedHero.className.toUpperCase() as keyof typeof HEROES_NAMES];
        return createHeroFunc(storedHero);
    }

    //Pending to use.

    // async saveFightRecord(fightRecord: TotalActionRecord, teamId: number): Promise<void> {
    //     const { characterId, stats, attacks, defences } = fightRecord;

    //     const insertFightRecordQuery = `INSERT INTO fightRecords (teamId, characterId, stats) VALUES (${teamId}, ${characterId}, '${JSON.stringify(stats)}')`;
    //     const fightRecordResult = await this.executeQuery<ResultSetHeader>(insertFightRecordQuery);
    //     const fightRecordId = fightRecordResult.insertId;

    //     const insertAttackQuery = `INSERT INTO attacks (fightRecordId, attackType, value, total, NORMAL, CRITICAL, MISS, SKILL, TRUE_damage) VALUES
    //     (${fightRecordId}, 'NORMAL', ${attacks.NORMAL}, ${attacks.total}, ${attacks.NORMAL}, ${attacks.CRITICAL}, ${attacks.MISS}, ${attacks.SKILL}, ${attacks.TRUE})`;
    //     await this.executeQuery<ResultSetHeader>(insertAttackQuery);

    //     const insertDefenceQuery = `INSERT INTO defences (fightRecordId, defenceType, value, total, NORMAL, EVASION, MISS, SKILL, TRUE_damage) VALUES
    //     (${fightRecordId}, 'NORMAL', ${defences.NORMAL}, ${defences.total}, ${defences.NORMAL}, ${defences.EVASION}, ${defences.MISS}, ${defences.SKILL}, ${defences.TRUE})`;
    //     await this.executeQuery<ResultSetHeader>(insertDefenceQuery);
    // }
}

export default MysqlStorage;
