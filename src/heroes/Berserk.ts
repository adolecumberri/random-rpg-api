import { Status, Character } from "rpg-ts";
import { getFemaleName, getMaleName, getProb, getStatsByClassId, getSurname, rand } from "../helpers";
import { CLASS_NAMES } from "../../old_proyect2/constants";
import { HeroOptions } from "../types";

const createBerserk = (options?: HeroOptions) => {
    //Rage y Berserk_skill se crean aquí para no compartir referencia cada vez que cree un personaje.
    const Rage = new Status({
        duration: { type: 'PERMANENT' },
        name: 'Rage',
        applyOn: 'AFTER_RECEIVE_DAMAGE',
        usageFrequency: 'ONCE',
        statsAffected: [{
            to: 'attack',
            value: 22,
            type: 'BUFF_FIXED',
            from: 'attack', // unnnecesary.
            recovers: true,
        },
        {
            to: 'defence',
            value: -16,
            type: 'BUFF_FIXED',
            from: 'defence', // unnnecesary.
            recovers: true,
        }, {
            to: 'attackInterval',
            value: -4,
            type: 'BUFF_FIXED',
            from: 'attackInterval', // unnnecesary.
            recovers: true,
        }],
    });

    const BERSERK_SKILL = (character: Character) => {
        if (
            character.stats.hp <= character.stats.totalHp * 0.3 &&
            !character.statusManager?.statusList.includes(Rage) &&
            character.isAlive
        ) {
            character.statusManager?.addStatus(Rage);
            character.statusManager?.activate('AFTER_RECEIVE_DAMAGE');
        }
    };

    let gender = options?.gender !== undefined ? options.gender : rand(0, 1);
    let name = options?.name || (gender ? getMaleName() : getFemaleName());
    let surname = options?.surname || getSurname();

    return new Character({
        name,
        surname,
        gender,
        className: CLASS_NAMES.BERSERKER,
        statusManager: true,
        actionRecord: true,
        callbacks: {
            receiveDamage: BERSERK_SKILL,
        },
        stats: getStatsByClassId(1),
    });
}

export {
    createBerserk
}
