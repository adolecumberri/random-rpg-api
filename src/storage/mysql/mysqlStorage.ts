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
            await this.saveAttackRecords(actionRecord.attacks);
            await this.saveDefenceRecords(actionRecord.defences);
        }

    }

    async saveAttackRecords(attacks: AttackRecord[]): Promise<void> {
        if (attacks && attacks.length > 0) {
            const attackRecords = attacks.map((attack) => ({
                attackId: attack.id,
                attackType: attack.attackType,
                damage: attack.damage,
                characterId: attack.characterId,
            }));
            const query = `INSERT INTO attackRecord (attackId, attackType, damage, characterId) VALUES ?`;
            await this.executeQuery(query, [attackRecords.map(Object.values)]);
        }
    }

    async saveDefenceRecords(defences: DefenceRecord[]): Promise<void> {
        if (defences && defences.length > 0) {
            const defenceRecords = defences.map((defence) => ({
                attackId: defence.id,
                defenceType: defence.defenceType,
                damageReceived: defence.damageReceived,
                characterId: defence.characterId,
            }));
            const query = `INSERT INTO defenceRecord (attackId, defenceType, damageReceived, characterId) VALUES ?`;
            await this.executeQuery(query, [defenceRecords.map(Object.values)]);
        }
    }

    async saveHero(hero: Hero): Promise<any> {
        console.log('Saving character in the database');

        try {
            const values = 'heroId, name, surname, gender, className, hp, totalHp, attack, defence, crit, critMultiplier, accuracy, evasion, attackInterval, regeneration, isAlive, skillProbability';
            const hero_values = `'${hero.id}', '${hero.name}', '${hero.surname}', '${hero.gender}', '${hero.className}', '${hero.stats.hp}', '${hero.stats.totalHp}', '${hero.stats.attack}', '${hero.stats.defence}', '${hero.stats.crit}', '${hero.stats.critMultiplier}', '${hero.stats.accuracy}', '${hero.stats.evasion}', '${hero.stats.attackInterval}', '${hero.stats.regeneration}', '${Number(hero.isAlive)}', '${hero.skill.probability}'`;
            const query = `INSERT INTO Heroes (${values}) VALUES (${hero_values})`;

            const solution = await this.executeQuery<any>(query);

            if (hero.actionRecord) {
                await this.saveActionRecord(hero.actionRecord);
            }

            console.log('Character saved in the database');
            return solution;
        } catch (error) {
            console.error('Error while saving character:', error);
            throw error; // Rethrow the error for handling in the calling code
        }
    }

    async saveHeroes(heroes: Hero[]): Promise<void> {
        try {
            await Promise.all(heroes.map(async (hero) => {
                const values = 'heroId, name, surname, gender, className, hp, totalHp, attack, defence, crit, critMultiplier, accuracy, evasion, attackInterval, regeneration, isAlive';
                const hero_values = `'${hero.id}', '${hero.name}', '${hero.surname}', '${hero.gender}', '${hero.className}', '${hero.stats.hp}', '${hero.stats.totalHp}', '${hero.stats.attack}', '${hero.stats.defence}', '${hero.stats.crit}', '${hero.stats.critMultiplier}', '${hero.stats.accuracy}', '${hero.stats.evasion}', '${hero.stats.attackInterval}', '${hero.stats.regeneration}', '${Number(hero.isAlive)}'`;
                const query = `INSERT INTO Heroes (${values}) VALUES (${hero_values})`;

                await this.executeQuery(query)
            }));
        } catch (error) {
            console.error('Error while saving heroes:', error);
            throw error;
        }
    }

    async getHeroById(id: number): Promise<Hero | null> {
        try {
            const heroQuery = `SELECT * FROM Heroes WHERE heroId = ${id}`;
            const attackRecordQuery = `SELECT * FROM attackRecord WHERE characterId = ${id}`;
            const defenceRecordQuery = `SELECT * FROM defenceRecord WHERE characterId = ${id}`;

            const [heroResult, attackRecordResult, defenceRecordResult] = await Promise.all([
                this.executeQuery<RowDataPacket[]>(heroQuery),
                this.executeQuery<RowDataPacket[]>(attackRecordQuery),
                this.executeQuery<RowDataPacket[]>(defenceRecordQuery),
            ]);

            if (heroResult.length === 0) {
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
        } catch (error) {
            console.error('Error while retrieving hero:', error);
            throw error;
        }
    }


    async executeQuery<T>(query: string, values?: any[]): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            try {
                values ? mysqlClient.execute(query, values, (err, result) => {
                    if (err) throw (err);
                    resolve(result as unknown as T);
                }) : mysqlClient.execute(query, (err, result) => {
                    if (err) throw (err);
                    resolve(result as unknown as T);
                });
            } catch (error) {
                console.error('Error executing query:', error);
                reject(error);
            }
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

    async closeConnection(): Promise<void> {
        // Close the connection pool
        await mysqlClient.end();
    }
}

export default MysqlStorage;
