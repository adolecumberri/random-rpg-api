import fs from 'fs';
import path from 'path';
import StorageModule from './../storageModule';
import { Character, Team } from 'rpg-ts';
import { Hero, StoredHero } from '../../types';
import { restoreStoredHero } from '../../controllers';

class FileStorage implements StorageModule {
    fileType: string = 'txt';
    heroFilePath: string = path.join(__dirname, 'heroes');
    teamFilePath: string = path.join(__dirname, 'teams');

    constructor(
        fileType = 'txt',
        heroFilePath = path.join(__dirname, 'heroes')
    ) {
        this.fileType = fileType;
        this.heroFilePath = heroFilePath;
    }

    async saveHero(hero: Hero): Promise<void> {
        // Logic to save the Hero in a text file
        // Use the necessary values from the Hero object

        const data = {
            id: Number(String(new Date().getTime()) + String(hero.id)),
            heroId: hero.id,
            isAlive: hero.isAlive,
            name: hero.name,
            surname: hero.surname,
            className: hero.className,
            gender: hero.gender,
            actionRecordAttacks: hero.actionRecord?.attacks,
            actionRecordDefences: hero.actionRecord?.defences,
            ...hero.stats,
        } as StoredHero

        const folderPath = path.join(this.heroFilePath);
        const filePath = path.join(folderPath, `${hero.id}.${this.fileType}`);

        // Create the 'heroes' folder if it doesn't exist
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }

        // Save the file with the character's data
        fs.writeFileSync(filePath, JSON.stringify(data));
    }

    async saveHeroes(heroes: Hero[]): Promise<void> {
        const folderPath = path.join(this.heroFilePath);
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }

        // Save each hero in a separate file
        for (const hero of heroes) {
            const data = {
                id: hero.id, //cant keep track. id can not be unique
                heroId: hero.id,
                isAlive: hero.isAlive,
                name: hero.name,
                surname: hero.surname,
                className: hero.className,
                gender: hero.gender,
                actionRecordAttacks: hero.actionRecord?.attacks,
                actionRecordDefences: hero.actionRecord?.defences,
                ...hero.stats,
            } as StoredHero;

            const filePath = path.join(folderPath, `${hero.id}.${this.fileType}`);

            fs.writeFileSync(filePath, JSON.stringify(data));
        }
    }

    async getHeroById(id: number): Promise<StoredHero | null> {
        const filePath = path.join(this.heroFilePath, `${id}.${this.fileType}`);

        let solution: StoredHero | null = null;

        // Check if the file exists
        if (fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath, 'utf8');
            solution = JSON.parse(fileData) as StoredHero;
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
        const teamData = {
            id: team.id,
            name: team.name,
            members: team.members.length
        }
        fs.writeFileSync(teamDataFilePath, JSON.stringify(teamData));

        // Save each member in a separate file within the 'members' folder
        for (const member of team.members) {
            const data = {
                id: member.id, //cant keep track. id can not be unique
                heroId: member.id,
                isAlive: member.isAlive,
                name: member.name,
                surname: member.surname,
                className: member.className,
                gender: member.gender,
                actionRecordAttacks: member.actionRecord?.attacks,
                actionRecordDefences: member.actionRecord?.defences,
                ...member.stats,
            } as StoredHero;

    
            const memberFilePath = path.join(membersFolderPath, `${member.id}.${this.fileType}`);
    
            fs.writeFileSync(memberFilePath, JSON.stringify(data));
        }
    }


}

export default FileStorage;
