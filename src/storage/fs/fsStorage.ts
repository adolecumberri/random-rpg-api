// storage/fileStorage.ts

import fs from 'fs';
import path from 'path';
import StorageModule from './../storageModule';
import { Character } from 'rpg-ts';
import { HeroIdentity, StoredHero } from '../../types';
import { RestoreCharacter } from '../../controllers';

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

    async saveData(character: Character & HeroIdentity & {className: string}): Promise<void> {
        // Logic to save the character in a text file
        // Use the necessary values from the Character object
        const { id, isAlive, name, stats, surname, className, gender } = character;

        const data = {
            id,
            isAlive,
            name,
            stats,
            surname,
            className,
            gender,
        };

        const folderPath = path.join(this.filePath);
        const filePath = path.join(folderPath, `${id}.${this.fileType}`);

        // Create the 'heroes' folder if it doesn't exist
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }

        // Save the file with the character's data
        fs.writeFileSync(filePath, JSON.stringify(data));
    }

    async restoreCharacterById(id: number): Promise<Character | null> {
        const filePath = path.join(this.filePath, `${id}.${this.fileType}`);

        let solution: Character | null = null;

        // Check if the file exists
        if (fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath, 'utf8');
            const characterData = JSON.parse(fileData) as StoredHero;

            // Restore the character using the RestoreCharacter function
            solution = RestoreCharacter(characterData);
        }
        
        return solution;
    }
}

export default FileStorage;
