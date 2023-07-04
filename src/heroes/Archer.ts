import { Status, Character } from "rpg-ts";
import { ARCHER_SKILL_PROBABILITY } from "../constants";
import { getFemaleName, getMaleName, getProb, getStatsByClassId, getSurname, rand } from "../helpers";
import { CLASS_NAMES } from "../../old_proyect2/constants";
import { HeroOptions } from "../types";

const Haste = new Status({
    duration: { type: 'TEMPORAL', value: 1 },
    name: 'Haste',
    applyOn: 'AFTER_ATTACK',
    statsAffected: [{
        to: 'attackInterval',
        value: 2,
        type: 'DEBUFF_FIXED',
        from: 'attackInterval', // unnnecesary.
        recovers: true,
    }],
});

const ARCHER_SKILL = (character: Character) => {
    if (ARCHER_SKILL_PROBABILITY > getProb()) {
        character.statusManager?.addStatus(Haste);
    } else {
        character.statusManager?.removeStatusById(Haste.id);
    }
}


const createArcher = (options?: HeroOptions) => {
    let gender = options?.gender !== undefined ? options.gender : rand(0, 1);
    let name = options?.name || (gender ? getMaleName() : getFemaleName());
    let surname = options?.surname || getSurname();

    return new Character({
        name,
        surname,
        gender,
        skillProbability: ARCHER_SKILL_PROBABILITY,
        className: CLASS_NAMES.ARCHER,
        statusManager: true,
        actionRecord: true,
        callbacks: {
            criticalAttack: ARCHER_SKILL,
            normalAttack: ARCHER_SKILL,
        },
        stats: getStatsByClassId(1),
    });
}

export {
    createArcher
}
