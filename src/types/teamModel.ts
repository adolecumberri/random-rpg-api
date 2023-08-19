import { HEROES_NAMES } from "../constants"


interface teamReqBody { 
    name: string, 
    totalHeroes: number, 
    heroTypes: string 
}

type parsedHeroTypes = { 
    [x in keyof typeof HEROES_NAMES]?: number 
}

export {
    teamReqBody,
    parsedHeroTypes
}