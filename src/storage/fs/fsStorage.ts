// storage/fileStorage.ts

import fs from 'fs';
import path from 'path';
import StorageModule from './../storageModule';
import { Character } from 'rpg-ts';

class FileStorage implements StorageModule {
    async saveData(character: Character & { surname: string, className: string }): Promise<void> {
        // Lógica para guardar el personaje en un archivo de texto
        // Utiliza los valores necesarios del objeto Character
        const { id, isAlive, name, stats, surname, skill, className } = character;

        const data = {
            id,
            isAlive,
            name,
            stats,
            surname,
            skillProbability: skill.probability,
            className,
        };

        const folderPath = path.join(__dirname, 'heroes');
        const filePath = path.join(folderPath, `${id}.txt`);

        // Crear la carpeta 'heroes' si no existe
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }

        // Guardar el archivo con los datos del personaje
        fs.writeFileSync(filePath, JSON.stringify(data));
    }
}

export default FileStorage;
