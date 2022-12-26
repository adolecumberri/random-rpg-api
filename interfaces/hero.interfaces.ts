import { CLASS_NAMES } from "../constants";

interface hero_stats {
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

interface hero_with_class_stats extends hero_stats {
    name: string,
    surname: string,
    class_name: typeof CLASS_NAMES[keyof typeof CLASS_NAMES],
    id_class: number,
}

export {
    hero_stats,
    hero_with_class_stats
}