
import { defaultCharacter } from "rpg-ts/dist/classes/Character"

export const CLASS_SKILLS = {

    HASTE: {
        name: 'Haste',
        description: 'Increase the speed of the hero',
        prob: 0.23,
        //la skill recibe un Character y le reduce el attack_speed en 2
        p: (character: defaultCharacter) => {
            character.setStat('attack_speed', character.getStat('attack_speed') - 2)
        }
         
    }

}