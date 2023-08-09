import fs from 'fs';
import path from 'path';
import StorageModule from './../storageModule';
import { BaseCharacter, Character, Team } from 'rpg-ts';
import { Hero } from '../../types';

class FileStorage implements StorageModule {
    fileType: string = 'txt';
    heroFilePath: string;
    teamFilePath: string;

    constructor(
        fileType = 'txt',
        heroFilePath = path.join(__dirname, 'heroes'),
        teamFilePath = path.join(__dirname, 'teams')
    ) {
        this.fileType = fileType;
        this.heroFilePath = heroFilePath;
        this.teamFilePath = teamFilePath;

        if( !fs.existsSync(this.heroFilePath)){
            fs.mkdirSync(this.heroFilePath);
        }

        if (!fs.existsSync(this.teamFilePath)) {
            fs.mkdirSync(this.teamFilePath);
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
            solution = BaseCharacter.deserialize(fileData);
        }

        return solution;
    }

    async saveTeam(team: Team<Hero>): Promise<void> {
        const teamFolderPath = path.join(this.teamFilePath, team.id.toString());
        const membersFolderPath = path.join(teamFolderPath, 'members');
    
        if (!fs.existsSync(teamFolderPath)) {
            fs.mkdirSync(teamFolderPath, { recursive: true });
        }
    
        if (!fs.existsSync(membersFolderPath)) {
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


}

export default FileStorage;
