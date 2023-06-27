// fileSystemService.ts
import fs from 'fs';

export const fileSystemService = {
  getData: () => {
    return new Promise((resolve, reject) => {
      fs.readFile('data.txt', 'utf8', (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }
};
