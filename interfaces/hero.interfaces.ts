import { CLASS_NAMES } from "../constants";

interface hero_stats {
    name?: typeof CLASS_NAMES[keyof typeof CLASS_NAMES],
    id?: number,
    hp: number,
    attack: number,
    defence: number,
    crit: number,
    crit_multiplier: number,
    accuracy: number,
    evasion: number,
    attack_interval: number,
    reg: number
}

export {
    hero_stats
}