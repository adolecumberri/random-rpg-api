import fs from 'fs';
import path from 'path';
import StorageModule from './../storageModule';
import { Character } from 'rpg-ts';
import { Hero, StoredHero } from '../../types';
import { restoreStoredHero } from '../../controllers';

class FileStorage implements StorageModule {
    fileType: string = 'txt';
    filePath: string = path.join(__dirname, 'heroes');

    constructor(
        fileType = 'txt',
        filePath = path.join(__dirname, 'heroes')
    ) {
        this.fileType = fileType;
        this.filePath = filePath;
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
            ...hero.stats
        } as StoredHero

        const folderPath = path.join(this.filePath);
        const filePath = path.join(folderPath, `${hero.id}.${this.fileType}`);

        // Create the 'heroes' folder if it doesn't exist
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }

        // Save the file with the character's data
        fs.writeFileSync(filePath, JSON.stringify(data));
    }

    async saveHeroes(heroes: Hero[]): Promise<void> {
        const folderPath = path.join(this.filePath);
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
                ...hero.stats,
            } as StoredHero;

            const filePath = path.join(folderPath, `${hero.id}.${this.fileType}`);

            fs.writeFileSync(filePath, JSON.stringify(data));
        }
    }

    async getHeroById(id: number): Promise<StoredHero | null> {
        const filePath = path.join(this.filePath, `${id}.${this.fileType}`);

        let solution: StoredHero | null = null;

        // Check if the file exists
        if (fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath, 'utf8');
            solution = JSON.parse(fileData) as StoredHero;
        }

        return solution;
    }
}

export default FileStorage;
