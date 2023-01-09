
import { connection } from '../functions/bbdd';
import { hero_with_class_stats } from '../interfaces/hero.interfaces';

const getHeroSavedStats = () => {
    
}

const setHero = (hero: hero_with_class_stats) => {
    let values = 'name, surname, gender, id_class, hp, total_hp, attack, defence, crit, crit_multiplier, accuracy, evasion, attack_interval, regeneration'
    
    let hero_values = `'${hero.name}', '${hero.surname}', '${hero.gender}', '${hero.id_class}', '${hero.hp}', '${hero.total_hp}', '${hero.attack}', '${hero.defence}', '${hero.crit}', '${hero.crit_multiplier}', '${hero.accuracy}', '${hero.evasion}', '${hero.attack_interval}', '${hero.reg}'`
    connection.query(`INSERT INTO hero (${values}) VALUES (${hero_values})`, (err, rows, fields) => {
        if (err) throw err;
        console.log('The solution is: ', rows);
    });
}

export { getHeroSavedStats, setHero }
