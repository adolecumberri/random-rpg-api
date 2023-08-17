import { ResultSetHeader, RowDataPacket } from 'mysql2';
import StorageModule from './../storageModule';
import mysqlClient from './dbConfig';
import { Hero } from '../../types';
import { ActionRecord, AttackRecord, Battle, Character, DefenceRecord, Team, TotalActionRecord } from 'rpg-ts';
import { rowOfAttackRecord, rowOfDefenceRecord, rowOfTableHeroes, rowOfTableteams } from './mysqlStorageTypes';
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

    async addHeroToTeam(teamId: number, heroId: number): Promise<void> {
        const insertMemberQuery = `INSERT INTO teams_heroes (teamId, heroId) VALUES (${teamId}, ${heroId})`;
        await this.executeQuery<ResultSetHeader>(insertMemberQuery);
    }

    async closeConnection(): Promise<void> {
        // Close the connection pool
        await mysqlClient.end();
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

    async getHeroById(id: number): Promise<Hero | null> {
        try {
            const heroQuery = `SELECT * FROM Heroes WHERE characterId = ${id}`;
            const attackRecordQuery = `SELECT * FROM attackRecord WHERE characterId = ${id}`;
            const defenceRecordQuery = `SELECT * FROM defenceRecord WHERE characterId = ${id}`;

            const [heroResult, attackRecordResult, defenceRecordResult] = await Promise.all([
                this.executeQuery<rowOfTableHeroes[]>(heroQuery),
                this.executeQuery<rowOfAttackRecord[]>(attackRecordQuery),
                this.executeQuery<rowOfDefenceRecord[]>(defenceRecordQuery),
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
                attackId: row.defenceId,
                defenceType: row.defenceType,
                damageReceived: row.damageReceived,
                characterId: row.characterId,
                attackerId: row.attackerId,
            }));
            hero.actionRecord!.attacks = attackRecords;
            hero.actionRecord!.defences = defenceRecords;

            return hero;
        } catch (error) {
            console.error('Error while retrieving hero:', error);
            throw error;
        }
    }

    async getTeamById(teamId: number): Promise<Team<Hero> | null> {
        const teamQuery = `SELECT * FROM teams WHERE teamId = ${teamId}`;
        
        const [teamRow] = await this.executeQuery<[rowOfTableteams]>(teamQuery);

        if ( !teamRow ) {
            return null; // Team doesn't exist
        }
    
        const team = new Team<Hero>({
            name: teamRow.name,
            id: teamRow.teamId, //this id is the one that the Team creates the first time it's created
        });
    
        const membersQuery = `SELECT h.* FROM heroes h
                             JOIN teams_heroes th ON h.id = th.heroId
                             WHERE th.teamId = ${teamRow.id}`;
        const membersResult = await this.executeQuery<rowOfTableHeroes[]>(membersQuery);

        // Process heroes
        for (const heroRow of membersResult) {
            const hero = this.restoreStoredHero(heroRow);
            team.addMember(hero);
        }
    
        return team;
    }

    restoreStoredHero = (storedHero: rowOfTableHeroes): Hero => {
        const createHeroFunc = restoreHero[storedHero.className.toUpperCase() as keyof typeof HEROES_NAMES];
        return createHeroFunc(storedHero);
    }

    async saveActionRecord(actionRecord: ActionRecord): Promise<void> {
        // ... (other logic)
    
        if (actionRecord.attacks && actionRecord.attacks.length > 0) {
            for (const attack of actionRecord.attacks) {
                await this.saveAttackRecord(attack);
            }
        }
    
        if (actionRecord.defences && actionRecord.defences.length > 0) {
            for (const defence of actionRecord.defences) {
                await this.saveDefenceRecord(defence);
            }
        }
    }

    async saveAttackRecord(attackRecord: AttackRecord): Promise<void> {
        const { attackType, damage, characterId } = attackRecord;
    
        const insertQuery = `INSERT INTO attackRecord (attackType, damage, characterId) VALUES (?, ?, ?)`;
        const values = [attackType, damage, characterId];
    
        await this.executeQuery<ResultSetHeader>(insertQuery, values);
    }

    async saveBattleHeroes(battleId: number, battle: Battle, heroA: Hero, heroB: Hero): Promise<void> {
        await this.saveBattleLogs(battleId, battle);
       
        await this.saveHero(heroA);
        await this.saveHero(heroB);
    }

    async saveBattleLogs(battleId: number, battle: Battle) {
        const battleLogs = battle.logs.get(battleId);

        if( !battleLogs ) {
            throw new Error('Battle logs not found');
        }

        const insertBattleQuery = `INSERT INTO battles (battleId, battleType, battleDimension) VALUES (?, ?, ?)`;
        const values = [
            battleLogs.initialLog.battleId,
            battleLogs.initialLog.battleType,
            battleLogs.initialLog.battleDimension
        ];
        // saving 1st log
        await this.executeQuery<ResultSetHeader>(insertBattleQuery, values);

        // saving battle logs.
        try {
            await Promise.all( battleLogs.logs.map(async (log) => {
                const insertBattleLogQuery = `INSERT INTO battleLogs (battleId, intervalOfTurn, idAttackRecord, idDefenceRecord, attackerId, defenderId, attackerHp, defenderHp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                const battleLogsValues = [
                    battleLogs.initialLog.battleId,
                    log.intervalOfTurn,
                    log.idAttackRecord,
                    log.idDefenceRecord,
                    log.attackerId,
                    log.defenderId,
                    log.attackerHp,
                    log.defenderHp
                ];
    
                await this.executeQuery(insertBattleLogQuery, battleLogsValues);
            }));
        } catch (e){
            console.error('Error while saving battle logs:', e);
            throw e;
        }
       
    }

    async saveDefenceRecord(defenceRecord: DefenceRecord): Promise<void> {
        const { defenceType, damageReceived, characterId, attackerId } = defenceRecord;
    
        const insertQuery = `INSERT INTO defenceRecord (defenceType, damageReceived, characterId, attackId) VALUES (?, ?, ?, ?)`;
        const values = [defenceType, damageReceived, characterId, attackerId];
    
        await this.executeQuery<ResultSetHeader>(insertQuery, values);
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
                const values = 'heroId, name, surname, gender, className, hp, totalHp, attack, defence, crit, critMultiplier, accuracy, evasion, attackInterval, regeneration, isAlive, skillProbability';
                const hero_values = `'${hero.id}', '${hero.name}', '${hero.surname}', '${hero.gender}', '${hero.className}', '${hero.stats.hp}', '${hero.stats.totalHp}', '${hero.stats.attack}', '${hero.stats.defence}', '${hero.stats.crit}', '${hero.stats.critMultiplier}', '${hero.stats.accuracy}', '${hero.stats.evasion}', '${hero.stats.attackInterval}', '${hero.stats.regeneration}', '${Number(hero.isAlive)}'`;
                const query = `INSERT INTO Heroes (${values}) VALUES (${hero_values})`;

                await this.executeQuery(query)
            }));
        } catch (error) {
            console.error('Error while saving heroes:', error);
            throw error;
        }
    }

    async saveTeam(team: Team<Hero>): Promise<void> {

        const insertTeamQuery = `INSERT INTO teams (teamId, name, members) VALUES ('${team.id}','${team.name}', '${team.members.length}')`;
        await this.executeQuery<ResultSetHeader>(insertTeamQuery);

        for (const member of team.members) {
            await this.saveHero(member as Hero);
            await this.addHeroToTeam(team.id, member.id);
        }
    }

}

export default MysqlStorage;
