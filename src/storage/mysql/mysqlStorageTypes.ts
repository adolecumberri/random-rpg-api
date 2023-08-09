
/**
 * id int AI PK 
heroId bigint 
name varchar(255) 
surname varchar(255) 
gender varchar(10) 
className varchar(50) 
hp int 
totalHp int 
attack int 
defence int 
crit float 
critMultiplier float 
accuracy float 
evasion float 
attackInterval int 
regeneration float 
isAlive tinyint(1)
 */
type rowOfTableHeroes = {
    heroId: number;
    name: string;
    surname: string;
    gender: string;
    className: string;
    hp: number;
    totalHp: number;
    attack: number;
    defence: number;
    crit: number;
    critMultiplier: number;
    accuracy: number;
    evasion: number;
    attackInterval: number;
    regeneration: number;
    isAlive: number;
    skillProbability: number;
}

export {
    rowOfTableHeroes,
}

