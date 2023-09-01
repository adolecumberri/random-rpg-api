import { ATTACK_TYPE_CONST, AttackResult, BaseCharacter, Character, CharacterCallbacks, DEFENCE_TYPE_CONST, Status, getDefaultDefenceObject } from "rpg-ts";
import { getRandomInt } from "../../helpers";


const haste = ({ atacker: c }: AttackResult) => {
    if (!c) return undefined;
    const hasteStatus = new Status({
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

    if (c.skill.probability >= getRandomInt(0, 100) && !c.skill.isUsed) {
        c.statusManager?.addStatus(hasteStatus, c);
    }
};

const rage: CharacterCallbacks['receiveDamage'] = ({ c }) => {
    const rage = new Status({
        duration: { type: 'PERMANENT' },
        name: 'Rage',
        applyOn: 'AFTER_RECEIVE_DAMAGE',
        usageFrequency: 'ONCE',
        onAdd: (c) => {
            c.skill.isUsed = true;
        },
        onRemove: (c) => {
            c.skill.isUsed = false;
        },
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

    if (!c) return;

    if (
        c.stats.hp <= c!.stats.totalHp * 0.3 &&
        !c.skill.isUsed &&
        c.isAlive
    ) {
        c.statusManager?.addStatus(rage, c);
        c.statusManager?.activate('AFTER_RECEIVE_DAMAGE', c);
    }
};

const skipeShield: CharacterCallbacks['afterAnyDefence'] = ({ c, defence, attack }) => {
    if (!defence || !c) return undefined;
    const spikeShield = (attackValue: number) => Math.floor(7 + attackValue * 0.2);

    if (defence.type === 'MISS' || defence.type === 'EVASION') return;
    const damage = spikeShield(attack.value);
    
    // El defender genera un ataque de la skill
    c.actionRecord?.recordAttack('SKILL', damage, c.id);
    //el attacante genera una defensa de la skill
    attack.atacker?.actionRecord?.recordDefence('SKILL', damage, attack.atacker.id, c.id);

    attack.atacker!.receiveDamage({
        type: 'SKILL',
        value: damage,
        attacker: c,
    });
};

const riposte: CharacterCallbacks['afterAnyDefence'] = ({ c, attack, defence }) => {
    // Verificar que los parametros existen
    if (!defence || !attack || !attack.atacker) return;

    if (
        defence?.type === DEFENCE_TYPE_CONST.MISS ||
        defence?.type === DEFENCE_TYPE_CONST.EVASION
    ) return;

    if (c.skill.probability <= getRandomInt(0, 100)) return defence; // if skill miss returns default defence

    const calculateReflectedDamage = (value: number) => getRandomInt(value * 0.85, value * 1.15);

    const damageReflected = calculateReflectedDamage(attack?.value);
    
    // El defender genera un ataque de la skill
    c.actionRecord?.recordAttack('SKILL', damageReflected, c.id);
    //el attacante genera una defensa de la skill
    attack.atacker?.actionRecord?.recordDefence('SKILL', damageReflected, attack.atacker.id, c.id);


    const defenceResult = attack.atacker!.defend({
        type: ATTACK_TYPE_CONST.SKILL,
        value: damageReflected,
        atacker: c as BaseCharacter,
    });
    attack?.atacker?.receiveDamage(defenceResult);

    const solution = getDefaultDefenceObject({
        recordId: defence.recordId,
        type: ATTACK_TYPE_CONST.SKILL,
        value: 0,
    });

    return solution;
};

const tripleAttack = ({ atacker, recordId }: AttackResult) => {
    if (!atacker) return undefined;
    if (atacker!.skill.probability < getRandomInt()) return undefined;
    const results: AttackResult = { 
        type: ATTACK_TYPE_CONST.SKILL, 
        value: 0, 
        atacker,
        recordId
    };

    for (let i = 0; i < 3; i++) {
        const accuracyRoll = getRandomInt(); // Genera un número entre 0 y 100.
        const critRoll = getRandomInt(); // Genera un número entre 0 y 100.

        let newAttackValue = 0;

        if (atacker.stats.accuracy < accuracyRoll) {
            newAttackValue = atacker.calculateDamage('MISS', atacker.stats);
        } else if (atacker!.stats.crit > critRoll) {
            newAttackValue = atacker.calculateDamage('CRITICAL', atacker.stats);
        } else {
            newAttackValue = atacker.calculateDamage('NORMAL', atacker.stats);
        }

        results.value += newAttackValue * 0.7;
    }
    return results;
};

const holyLight: CharacterCallbacks['afterTurn'] = (c) => {
    if (
        c!.stats.hp <= c!.stats.totalHp * 0.3 &&
        c!.skill.probability >= getRandomInt(0, 100) &&
        c!.isAlive
    ) {
        c!.updateHp(getRandomInt(
            c!.stats.totalHp * 0.3,
            c!.stats.totalHp * 0.4,
        ));
    }
};

const unoticedShot: CharacterCallbacks['beforeBattle'] = (c) => {
    if (!c) return;
    if (
        c.skill.probability >= getRandomInt(0, 100) &&
        !c.skill.isUsed
    ) {
        c!.skill.isUsed = true;
        return c.attack();
    }
};

const shieldGesture: CharacterCallbacks['afterTurn'] = (c) => {
    if (!c) return;
    const shieldGesture = new Status({
        duration: { type: 'TEMPORAL', value: 3 },
        name: 'Haste',
        applyOn: 'AFTER_TURN',
        usageFrequency: 'ONCE',
        statsAffected: [{
            to: 'defence',
            value: 18,
            type: 'BUFF_FIXED',
            from: 'defence', // unnnecesary.
            recovers: true,
        }],
        onAdd: (c) => {
            c.skill.isUsed = true;
        },
        onRemove: (c) => {
            c.skill.isUsed = false;
        },
    });

    if (
        c.skill.probability >= getRandomInt(0, 100) &&
        c.isAlive &&
        !c.skill.isUsed
    ) {
        c.statusManager?.addStatus(shieldGesture, c);
    }
};

const fervor = ({ c }: { c?: BaseCharacter }) => {
    if (!c) return undefined;
    const fervor = new Status({
        duration: { type: 'PERMANENT' },
        name: 'Fervor',
        applyOn: 'AFTER_RECEIVE_DAMAGE',
        usageFrequency: 'ONCE',
        onAdd: (c) => {
            c.skill.isUsed = true;
        },
        onRemove: (c) => {
            c.skill.isUsed = false;
        },
        statsAffected: [{
            to: 'attack',
            value: 30,
            type: 'BUFF_PERCENTAGE',
            from: 'attack', // unnnecesary.
            recovers: true,
        },
        {
            to: 'defence',
            value: 30,
            type: 'BUFF_PERCENTAGE',
            from: 'defence', // unnnecesary.
            recovers: true,
        }, {
            to: 'attackInterval',
            value: 30,
            type: 'BUFF_PERCENTAGE',
            from: 'attackInterval', // unnnecesary.
            recovers: true,
        }],
    });

    if (
        c.skill.probability >= getRandomInt(0, 100) &&
        !c.skill.isUsed &&
        c.isAlive
    ) {
        c.statusManager?.addStatus(fervor, c);
        c.statusManager?.activate('AFTER_RECEIVE_DAMAGE', c);
    }
};


export {
    haste,
    rage,
    skipeShield,
    riposte,
    tripleAttack,
    holyLight,
    unoticedShot,
    shieldGesture,
    fervor,
}