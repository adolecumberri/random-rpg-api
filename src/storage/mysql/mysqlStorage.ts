import { ResultSetHeader, RowDataPacket } from 'mysql2';
import StorageModule from './../storageModule';
import mysqlClient from './dbConfig';
import { Hero } from '../../types';
import { ActionRecord, AttackRecord, Battle, Character, DefenceRecord, Stats, Team, characterBattleLastLog, teamBattleLastLog } from 'rpg-ts';
import { heroWithStatsFromTable, rowOfAttackRecord, rowOfDefenceRecord, rowOfTableHeroes, rowOfTableStats, rowOfTableteams } from './mysqlStorageTypes';
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
        const insertMemberQuery = `INSERT INTO teams_heroes (teamId, characterId) VALUES (${teamId}, ${heroId})`;
        await this.executeQuery<ResultSetHeader>(insertMemberQuery);
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
            const statsQuery = `SELECT * FROM heroesstats WHERE heroId = ${id} ORDER BY originalStats ASC;`;

            const [heroResult, attackRecordResult, defenceRecordResult, statsResult] = await Promise.all([
                this.executeQuery<rowOfTableHeroes[]>(heroQuery),
                this.executeQuery<rowOfAttackRecord[]>(attackRecordQuery),
                this.executeQuery<rowOfDefenceRecord[]>(defenceRecordQuery),
                this.executeQuery<rowOfTableStats[]>(statsQuery)
            ]);

            if (heroResult.length === 0) {
                return null;
            }

            const hero = this.restoreStoredHero({...heroResult[0], stats: statsResult[0], originalStats: statsResult[1]});

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

        if (!teamRow) {
            return null; // Team doesn't exist
        }

        const team = new Team<Hero>({
            name: teamRow.name,
            id: teamRow.teamId, //this id is the one that the Team creates the first time it's created
        });

        const membersQuery = `SELECT h.*, hs.* FROM heroes h
                             INNER JOIN heroesstats hs ON h.characterId = hs.heroId
                             JOIN teams_heroes th ON h.characterId = th.heroId
                             WHERE th.teamId = ${teamRow.id}`;
        const membersResult = await this.executeQuery<heroWithStatsFromTable[]>(membersQuery);

        // Process heroes
        for (const heroRow of membersResult) {
            const hero = this.restoreStoredHero(heroRow);
            team.addMember(hero);
        }

        return team;
    }

    restoreStoredHero = (storedHero: heroWithStatsFromTable): Hero => {
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
        const { attackType, damage, characterId, id } = attackRecord;

        const insertQuery = `INSERT INTO attackrecord (attackrecordId, attackType, damage, characterId) VALUES (?, ?, ?, ?)`;
        const values = [id, attackType, damage, characterId];

        await this.executeQuery<ResultSetHeader>(insertQuery, values);
    }

    async saveBattleHeroes(battleId: number, battle: Battle,  heroA: Hero, heroB: Hero): Promise<void> {
        let ha = await this.saveHero(heroA);
        let hb = await this.saveHero(heroB);

        let c = await this.saveBattleLogs(battleId, battle);
    }

    async saveBattleLogs(battleId: number, battle: Battle) {
        const battleLogs = battle.logs.get(battleId);

        if (!battleLogs) {
            throw new Error('Battle logs not found');
        }

        const insertBattleQuery = `INSERT INTO battles (battleId, battleType, battleDimension) VALUES (?, ?, ?)`;
        let values: string[] = [
            battleLogs.initialLog.battleId as unknown as string,
            battleLogs.initialLog.battleType,
            battleLogs.initialLog.battleDimension
        ];
        // saving 1st log
        await this.executeQuery<ResultSetHeader>(insertBattleQuery, values);

        // saving battle logs.
        try {
            await Promise.all(battleLogs.logs.map(async (log) => {
                const insertBattleLogQuery = `INSERT INTO battlelogs (battleId, intervalOfTurn, idAttackRecord, idDefenceRecord, attackerId, defenderId, attackerHp, defenderHp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
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
        } catch (e) {
            console.error('Error while saving battle logs:', e);
            throw e;
        }

        //saving final logs
        if (battleLogs.initialLog.battleDimension === 'Character') {
            const insertCharacterBattleLogQuery = `
                INSERT INTO finalcharacterbattlelog (battleId, draw, winnerId, looserId, characterAId, characterAHp, characterBId, characterBHp)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const characterBattleLogValues = [
                battleId,
                battleLogs.finalLog.draw ? 1 : 0,
                battleLogs.finalLog.winnerId,
                battleLogs.finalLog.looserId,
                (battleLogs.finalLog as characterBattleLastLog).characterAId,
                (battleLogs.finalLog as characterBattleLastLog).characterAHp,
                (battleLogs.finalLog as characterBattleLastLog).characterBId,
                (battleLogs.finalLog as characterBattleLastLog).characterBHp,
            ];

            await this.executeQuery<ResultSetHeader>(insertCharacterBattleLogQuery, characterBattleLogValues);

        } else {
            const insertTeamBattleLogQuery = `
                INSERT INTO finalteambattlelog (
                    battleId, draw, winnerId, looserId, teamAId, teamADeadMembers, teamAAliveMembers, teamATotalMembers,
                    teamBId, teamBDeadMembers, teamBAliveMembers, teamBTotalMembers
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const teamBattleLogValues = [
                battleId,
                battleLogs.finalLog.draw ? 1 : 0,
                battleLogs.finalLog.winnerId,
                battleLogs.finalLog.looserId,
                (battleLogs.finalLog as teamBattleLastLog).teamAId,
                (battleLogs.finalLog as teamBattleLastLog).teamADeadMembers,
                (battleLogs.finalLog as teamBattleLastLog).teamAAliveMembers,
                (battleLogs.finalLog as teamBattleLastLog).teamATotalMembers,
                (battleLogs.finalLog as teamBattleLastLog).teamBId,
                (battleLogs.finalLog as teamBattleLastLog).teamBDeadMembers,
                (battleLogs.finalLog as teamBattleLastLog).teamBAliveMembers,
                (battleLogs.finalLog as teamBattleLastLog).teamBTotalMembers
            ];

            await this.executeQuery<ResultSetHeader>(insertTeamBattleLogQuery, teamBattleLogValues);
        }
    }

    async saveBattleTeams(battleId: number,  battle: Battle, teamA: Team<Hero>, teamB: Team<Hero>): Promise<void> {
        await this.saveTeam(teamA);
        await this.saveTeam(teamB);

        await this.saveBattleLogs(battleId, battle);
    }
    
    async saveDefenceRecord(defenceRecord: DefenceRecord): Promise<void> {
        const { defenceType, damageReceived, characterId, attackerId, id } = defenceRecord;

        const insertQuery = `INSERT INTO defencerecord (defencerecordId, defenceType, damageReceived, characterId, attackerId) VALUES (?, ?, ?, ?, ?)`;
        const values = [id, defenceType, damageReceived, characterId, attackerId];

        await this.executeQuery<ResultSetHeader>(insertQuery, values);
    }

    async saveHero(hero: Hero): Promise<any> {
        try {
            const values = 'characterId, name, surname, gender, className, isAlive';
            const hero_values = `'${hero.id}', '${hero.name}', '${hero.surname}', '${hero.gender}', '${hero.className}', '${Number(hero.isAlive)}'`;
            const query = `INSERT INTO heroes (${values}) VALUES (${hero_values})`;
            const solution = await this.executeQuery<any>(query);

            if (solution.insertId) {
                const statsQuery = `INSERT INTO heroesstats (heroId, originalStats, hp, totalHp, attack, defence, crit, critMultiplier, accuracy, evasion, attackInterval, regeneration, skillProbability) 
                                   VALUES (${hero.id}, 0, '${hero.stats.hp}', '${hero.stats.totalHp}', '${hero.stats.attack}', '${hero.stats.defence}', '${hero.stats.crit}', '${hero.stats.critMultiplier}', '${hero.stats.accuracy}', '${hero.stats.evasion}', '${hero.stats.attackInterval}', '${hero.stats.regeneration}', '${hero.skill.probability}'), 
                                          (${hero.id}, 1, '${hero.stats.hp}', '${hero.stats.totalHp}', '${hero.stats.attack}', '${hero.stats.defence}', '${hero.stats.crit}', '${hero.stats.critMultiplier}', '${hero.stats.accuracy}', '${hero.stats.evasion}', '${hero.stats.attackInterval}', '${hero.stats.regeneration}', '${hero.skill.probability}')`;
                
                // Insertar estadísticas actuales y originales en la tabla `heroes_stats`
                await this.executeQuery<any>(statsQuery);
            }

            if (hero.actionRecord) {
                await this.saveActionRecord(hero.actionRecord);
            }
            return solution;
        } catch (error) {
            console.error('Error while saving character:', error);
            throw error; // Rethrow the error for handling in the calling code
        }
    }

    async saveHeroes(heroes: Hero[]): Promise<void> {
        try {
            await Promise.all(heroes.map(async (hero) => {
                const values = 'characterId, name, surname, gender, className, isAlive, skillProbability';
                const hero_values = `'${hero.id}', '${hero.name}', '${hero.surname}', '${hero.gender}', '${hero.className}', '${Number(hero.isAlive)}', '${hero.skill.probability}'`;
                const query = `INSERT INTO heroes (${values}) VALUES (${hero_values})`;
                const solution = await this.executeQuery<any>(query);
    
                console.log({
                    solution
                })
                if (solution.insertId || solution) {
                    const statsQuery = `INSERT INTO heroes_stats (heroId, hp, totalHp, attack, defence, crit, critMultiplier, accuracy, evasion, attackInterval, regeneration, originalStats) 
                                       VALUES (${hero.id}, '${hero.stats.hp}', '${hero.stats.totalHp}', '${hero.stats.attack}', '${hero.stats.defence}', '${hero.stats.crit}', '${hero.stats.critMultiplier}', '${hero.stats.accuracy}', '${hero.stats.evasion}', '${hero.stats.attackInterval}', '${hero.stats.regeneration}', 0), 
                                              (${hero.id}, '${hero.stats.hp}', '${hero.stats.totalHp}', '${hero.stats.attack}', '${hero.stats.defence}', '${hero.stats.crit}', '${hero.stats.critMultiplier}', '${hero.stats.accuracy}', '${hero.stats.evasion}', '${hero.stats.attackInterval}', '${hero.stats.regeneration}', 1)`;
                    
                    // Insertar estadísticas actuales y originales en la tabla `heroes_stats`
                    const statsInsertResult = await this.executeQuery<any>(statsQuery);
                }
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
