import fs from 'fs';
import path from 'path';
import StorageModule from './../storageModule';
import { BaseCharacter, Battle, Team } from 'rpg-ts';
import { Hero } from '../../types';

class FileStorage implements StorageModule {
    fileType: string = 'txt';
    heroFilePath: string;
    teamFilePath: string;
    battleFilePath: string;

    constructor(
        fileType = 'txt',
        heroFilePath = path.join(__dirname, 'heroes'),
        teamFilePath = path.join(__dirname, 'teams'),
        battleFilePath = path.join(__dirname, 'battle')
    ) {
        this.fileType = fileType;
        this.heroFilePath = heroFilePath;
        this.teamFilePath = teamFilePath;
        this.battleFilePath = battleFilePath;

        if( !fs.existsSync(this.heroFilePath)){
            fs.mkdirSync(this.heroFilePath);
        }

        if (!fs.existsSync(this.teamFilePath)) {
            fs.mkdirSync(this.teamFilePath);
        }

        if (!fs.existsSync(this.battleFilePath)) {
            fs.mkdirSync(this.battleFilePath);
        }
    }

    async saveHero(hero: Hero): Promise<void> {
        const filePath = path.join(this.heroFilePath, `${hero.id}.${this.fileType}`);

        // Save the file with the character's data
        fs.writeFileSync(filePath, hero.serialize());
    }

    async saveHeroes(heroes: Hero[]): Promise<void> {
        // Save each hero in a separate file
        for (const hero of heroes) {           
            const filePath = path.join(this.heroFilePath, `${hero.id}.${this.fileType}`);
            fs.writeFileSync(filePath, hero.serialize());
        }
    }

    async getHeroById(id: number): Promise<Hero | null> {
        const filePath = path.join(this.heroFilePath, `${id}.${this.fileType}`);

        let solution: Hero | null = null;

        // Check if the file exists
        if (fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath, 'utf8');
            solution = BaseCharacter.deserialize<Hero>(fileData);
        }

        return solution;
    }

    async saveTeam(team: Team<Hero>): Promise<void> {
        const teamFolderPath = path.join(this.teamFilePath, team.id.toString());
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
        const teamFolderPath = path.join(this.teamFilePath, teamId.toString());
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
        const battleFilePath = path.join(this.battleFilePath, battleId.toString());

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



}

export default FileStorage;
