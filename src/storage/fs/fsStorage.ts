import fs from 'fs';
import path from 'path';
import StorageModule from './../storageModule';
import { BaseCharacter, Battle, Team } from 'rpg-ts';
import { Hero } from '../../types';

const DIRS = {
    HEROES: 'heroes',
    TEAMS: 'teams',
    BATTLE: 'battle'
};

class FileStorage implements StorageModule {
    fileType: string = 'txt';
    heroFilePath: string;
    teamFilePath: string;
    battleFilePath: string;

    constructor(
        fileType = 'txt',
        heroFilePath = DIRS.HEROES,
        teamFilePath = DIRS.TEAMS,
        battleFilePath = DIRS.BATTLE,
    ) {
        this.fileType = fileType;
        this.heroFilePath = heroFilePath;
        this.teamFilePath = teamFilePath;
        this.battleFilePath = battleFilePath;

        if( !fs.existsSync(this.createRoute(this.heroFilePath))){
            fs.mkdirSync(this.createRoute(this.heroFilePath));
        }

        if (!fs.existsSync(this.createRoute(this.teamFilePath))) {
            fs.mkdirSync(this.createRoute(this.teamFilePath));
        }

        if (!fs.existsSync(this.createRoute(this.battleFilePath))) {
            fs.mkdirSync(this.createRoute(this.battleFilePath));
        }
    }

    createRoute(route: string): string {
        return path.join(__dirname, route);
    }

    async saveHero(hero: Hero): Promise<void> {
        const filePath = this.createRoute(path.join(this.heroFilePath, `${hero.id}.${this.fileType}`));

        // Save the file with the character's data
        fs.writeFileSync(filePath, hero.serialize());
    }

    async saveHeroes(heroes: Hero[]): Promise<void> {
        // Save each hero in a separate file
        for (const hero of heroes) {           
            const filePath = this.createRoute(path.join(this.heroFilePath, `${hero.id}.${this.fileType}`));
            fs.writeFileSync(filePath, hero.serialize());
        }
    }

    async getHeroById(id: number): Promise<Hero | null> {
        const filePath = this.createRoute(path.join(this.heroFilePath, `${id}.${this.fileType}`));

        let solution: Hero | null = null;

        // Check if the file exists
        if (fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath, 'utf8');
            solution = BaseCharacter.deserialize<Hero>(fileData);
        }

        return solution;
    }

    async saveTeam(team: Team<Hero>, rootPath: string = ''): Promise<void> {
        const teamFolderPath = this.createRoute(path.join(rootPath, this.teamFilePath, team.id.toString()));
        const membersFolderPath = path.join(teamFolderPath, 'members');

        if (!fs.existsSync(teamFolderPath)) {
            fs.mkdirSync(teamFolderPath, { recursive: true });
            fs.mkdirSync(membersFolderPath);
        }
    
        //creation of data folder
        const teamDataFilePath = path.join(teamFolderPath, `data.${this.fileType}`);

        fs.writeFileSync(teamDataFilePath, team.serialize());

        // Save each member in a separate file within the 'members' folder
        for (const member of team.members) {
            const memberFilePath = path.join(membersFolderPath, `${member.id}.${this.fileType}`);
            fs.writeFileSync(memberFilePath, member.serialize());
        }
    }

    async getTeamById(teamId: number): Promise<Team<Hero> | null> {
        const teamFolderPath = this.createRoute(path.join(this.teamFilePath, teamId.toString()));
        const membersFolderPath = path.join(teamFolderPath, 'members');
    
        if (!fs.existsSync(teamFolderPath)) {
            return null; // Team doesn't exist
        }
    
        const teamDataFilePath = path.join(teamFolderPath, `data.${this.fileType}`);
        if (!fs.existsSync(teamDataFilePath)) {
            return null; // Team data file doesn't exist
        }
    
        const teamData = fs.readFileSync(teamDataFilePath, 'utf-8');
        const parsedTeamData = JSON.parse(teamData);
    
        // Deserialize the team
        const team = Team.deserialize<Hero>(parsedTeamData);
    
        // Retrieve and deserialize each member
        if (fs.existsSync(membersFolderPath)) {
            const memberFiles = fs.readdirSync(membersFolderPath);
    
            for (const memberFile of memberFiles) {
                const memberFilePath = path.join(membersFolderPath, memberFile);
                const memberData = fs.readFileSync(memberFilePath, 'utf-8');
                const parsedMemberData = JSON.parse(memberData);
                const member = BaseCharacter.deserialize<Hero>(parsedMemberData); // Assuming you have a Character.deserialize method
                team.addMember(member);
            }
        }
        return team;
    }
    
    async saveBattleHeroes(battleId: number, battle: Battle, heroA: Hero, heroB: Hero): Promise<void> {
        const battleFilePath = this.createRoute(path.join(this.battleFilePath, battleId.toString()));

        if (!fs.existsSync(battleFilePath)) {
            fs.mkdirSync(battleFilePath, { recursive: true });
            fs.mkdirSync(path.join(battleFilePath, heroA.id.toString()));
            fs.mkdirSync(path.join(battleFilePath, heroB.id.toString()));
        }

        const battleDataFilePath = path.join(battleFilePath, `data.${this.fileType}`);
        fs.writeFileSync(battleDataFilePath, battle.serialize());

        const heroAFilePath = path.join(battleFilePath, heroA.id.toString(), `data.${this.fileType}`);
        fs.writeFileSync(heroAFilePath, heroA.serialize());

        const heroBFilePath = path.join(battleFilePath, heroB.id.toString(), `data.${this.fileType}`);
        fs.writeFileSync(heroBFilePath, heroB.serialize());

    }

    async saveBattleTeams(battleId: number, battle: Battle, teamA: Team<Hero>, teamB: Team<Hero>): Promise<void> {
        const battleFilePath = this.createRoute(path.join(this.battleFilePath, battleId.toString()));

        if (!fs.existsSync(battleFilePath)) {
            fs.mkdirSync(battleFilePath, { recursive: true });
        }
        // save data Battle:
        const battleDataFilePath = path.join(battleFilePath, `data.${this.fileType}`);
        fs.writeFileSync(battleDataFilePath, battle.serialize());

        this.saveTeam(teamA, "battle\\" + battleId.toString() );
        this.saveTeam(teamB, "battle\\" + battleId.toString() );
    }

}

export default FileStorage;
