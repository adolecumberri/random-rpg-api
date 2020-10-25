
export interface IHeroStats{
    hp: number,
    currentHp: number,
    dmg: number,
    def: number,
    crit: number,
    critDmg: number,
    accuracy: number,
    evasion: number,
    att_interval: number,
    reg: number
}

export interface IHeroCreated extends IHeroStats {
    id: number;
    name: string;
    gender: string;
} 

export interface IHero { 
    id? : number,
    name : string,
    gender: boolean | undefined,
    id_class: number | undefined,
    isAlive: boolean | undefined,
    kills : number,
    kidnaped : number
}


export interface IHeroFight {
    id : number,
    name : string,
    gender: boolean,
    id_class: number,
    hp: number,
    currentHp: number,
    dmg: number,
    def: number,
    crit: number,
    critDmg: number,
    accuracy: number,
    evasion: number,
    att_interval: number,
    reg: number,
    isAlive: boolean,
    kills : number,
    kidnaped : number
}

export interface IHeroEfects {
    dex : number,
    dmg : number, 
    def : number
}