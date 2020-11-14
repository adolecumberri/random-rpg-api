import { IHeroStats, IHero } from "../../interfaces/Hero.Interface";
import { Hero } from "./hero_old";
import { Archer } from "./classes/archer";
import { Defender } from "./classes/defender";
import { Fencer } from "./classes/fencer";
import { Ninja } from "./classes/ninja";
import { Paladin } from "./classes/paladin";
import { Sniper } from "./classes/sniper";
import { Soldier } from "./classes/soldier";
import { Thieve } from "./classes/thieve";
import { Berserker } from "./classes/berserker";
import { connection } from "../../config/database";

const maleClass: string[] = [
  "Arquero",
  "Berserker",
  "Defensor",
  "Esgrimista",
  "Ninja",
  "Paladín",
  "Sniper",
  "Soldado",
  "Ladrón"
];
const femaleClass: string[] = [
  "Arquera",
  "Berserker",
  "Defensora",
  "Esgrimista",
  "Ninja",
  "Paladín",
  "Sniper",
  "Soldado",
  "Ladrona"
];

const getClass = (id_class: number, gender: number) =>
  gender ? maleClass[id_class - 1] : femaleClass[id_class - 1];

export class Fight2 {
  //LAS ESTADISTICAS :
  stats: {
    totalDmg1: number;
    totalDmg2: number;
    totalDmgStopped1: number;
    totalDmgStopped2: number;
    numHits1: number;
    numHits2: number;
    winner: number | null;
    loser: number | null;
  } = {
    totalDmg1: 0,
    totalDmg2: 0,
    totalDmgStopped1: 0,
    totalDmgStopped2: 0,
    numHits1: 0,
    numHits2: 0,
    winner: null,
    loser: null
  };

  //flags de la pelea
  flag1: boolean;
  flag2: boolean;
  //Contadores de la pelea
  nextTurnHero1: number = 0;
  nextTurnHero2: number = 0;

  hero1: any;
  hero2: any;
  constructor(heroA: IHero, heroB: IHero) {
    this.hero1 = switchClass(heroA);
    this.hero2 = switchClass(heroB);

    //Inicio de variables globales.
    this.flag1 = false;
    this.flag2 = false;
  }

  fight = () => {
    let { winner, loser } = this.stats;

    this.nextTurnHero1 = this.hero1.heroStats.att_interval;
    this.nextTurnHero2 = this.hero2.heroStats.att_interval;

    //SKILLS FROM SNIPERS.
    if (this.hero1.heroStats.id_class == 7) {
      let { totalDmgA, totalDmgD, totalDmgStopped, numHits } = this.beginning(
        this.hero1,
        this.hero2
      );

      this.stats = {
        ...this.stats,
        totalDmg1: totalDmgA,
        totalDmg2: totalDmgD,
        totalDmgStopped1: totalDmgStopped,
        numHits1 : numHits
      };
    }

    if (this.hero2.heroStats.id_class == 7) {
      let { totalDmgA, totalDmgD, totalDmgStopped, numHits } = this.beginning(this.hero2, this.hero1);
      this.stats = {
        ...this.stats,
        totalDmg2: totalDmgA,
        totalDmg1: totalDmgD,
        totalDmgStopped2: totalDmgStopped,
        numHits2 : numHits
      };
    }

    //END SKILLS FROM SNIPERS
    for (let i = 0; !this.flag1 && !this.flag2; i++) {
      //
      if (i == this.nextTurnHero1) {
        let { totalDmgA, totalDmgD, totalDmgStopped, numHits } = this.turn(this.hero1, this.hero2);
        this.stats = {
          ...this.stats,
          totalDmg1: totalDmgA,
          totalDmg2: totalDmgD,
          totalDmgStopped1: totalDmgStopped,
          numHits1 : numHits
        };
        this.nextTurnHero1 = this.hero1.calcNextTurn(this.nextTurnHero1);
      }
      if (i == this.nextTurnHero2) {
        let { totalDmgA, totalDmgD, totalDmgStopped, numHits } = this.turn(this.hero2, this.hero1);
        this.stats = {
          ...this.stats,
          totalDmg2: totalDmgA,
          totalDmg1: totalDmgD,
          totalDmgStopped2: totalDmgStopped,
          numHits2 : numHits
        };
        this.nextTurnHero2 = this.hero2.calcNextTurn(this.nextTurnHero2);
      }
    }

    //Final De La Pelea --- victoria y derrota
    if (this.flag1 && this.flag2) {
      //si se empata se les da otra oportunidad
    } else {
      if (this.flag1) {
        this.hero2.heroWins(); //GANA HEROE 2
        this.hero1.heroDead();
        loser = this.hero1.heroStats.id;
        winner = this.hero2.heroStats.id;
      } else {
        if (this.flag2) {
          this.hero1.heroWins(); //GANA HEROE 2
          this.hero2.heroDead();
          loser = this.hero2.heroStats.id;
          winner = this.hero1.heroStats.id;
        }
      }
    }
    //Guardar en la base de datos
    if (!this.flag1 || !this.flag2) {
      this.saveFight();
    }
  };

  ////////////----------------------- PRUEBA TURNO AISLADO :

  //Execute the turn
  turn: any = (attacante: any, defensor: any) => {
    //ATTRIBUTOS DE LOS HEROES
    let {
      heroStats: { currentHp: curHpA },
      setHp: setHpA,
      hit: hitA,
      id: idA,
      skill: skillA,
      calcNextTurn: calcNextTurnA,
      end: endA
    } = attacante;

    let {
      isHitted: isHittedD,
      heroStats: { currentHp: curHpD },
      setHp: setHpD,
      id: idD,
      end: endD
    } = defensor;

    //RETURN DE LAS ESTADISTICAS.
    let totalDmgA: number = 0;
    let totalDmgD: number = 0;
    let totalDmgStopped: number = 0;
    let numHits: number = 0;

    let hit = hitA(); //golpeo return {type, dmg }
    let hitDeffended = isHittedD(hit.dmg); //actualizo el golpe. (damage) => { evaded, dmg }

    !hitDeffended.evaded //No ha sido evadido ? golpeo. sino nada
      ? setHpD(curHpD - hitDeffended.dmg)
      : "";

    //setting Stats Basicas
    if (!hitDeffended.evaded && hit.type !== "miss") {
      totalDmgA += hit.dmg; // --------- Stats
      totalDmgStopped += hit.dmg - hitDeffended.dmg; // --------- Stats
      numHits; // --------------Stats
    }

    //SKILL DEFENDER
    if ((idD == 3 || idD == 4) && hitDeffended.skill !== undefined) {
      setHpA = setHpA(curHpA - hitDeffended.skill); //al pj 1 se hiere al atacar un Defencer
      // console.log(`${name1} hitted by thornmail - ${hitDeffended.skill}`);
      totalDmgD += hitDeffended.skill; // ------------------Stats
    }

    //SKILL PALADIN
    if (idA == 6) {
      curHpA = skillA(curHpA);
    }

    //Al final del turno
    this.flag1 = endA(curHpA);
    this.flag2 = endD(curHpD);

    return {
      totalDmgA,
      totalDmgD,
      totalDmgStopped,
      numHits
    };
  };

  //Beginning
  beginning: any = (attacante: any, defensor: any) => {
    let {
      heroStats: { currentHp: curHpA },
      setHp: setHpA,
      id: idA,
      skill: skillA,
      end: endA
    } = attacante;

    let {
      isHitted: isHittedD,
      heroStats: { currentHp: curHpD },
      setHp: setHpD,
      id: idD,
      end: endD
    } = defensor;

    //RETURN DE LAS ESTADISTICAS.
    let totalDmgA: number = 0;
    let totalDmgD: number = 0;
    let totalDmgStopped: number = 0;
    let numHits: number = 0;

    if (idA == 7) {
      let hit = skillA();
      let hitDeffended = isHittedD(hit.dmg); //actualizo el golpe. (damage) => { evaded, dmg }
      !hitDeffended.evaded //No ha sido evadido ? golpeo. sino nada
        ? setHpD(curHpD - hitDeffended.dmg)
        : "";

      //Stats Basicas
      if (!hitDeffended.evaded && hit.type !== "miss") {
        totalDmgA += hit.dmg; // --------- Stats
        totalDmgStopped += hit.dmg - hitDeffended.dmg; // --------- Stats
        numHits; // --------------Stats
      }

      //SKILL DEFENDER && SKILL FENCER
      if ((idD == 3 || idD == 4) && hitDeffended.skill !== undefined) {
        setHpA = setHpA(curHpA - hitDeffended.skill); //al pj 1 se hiere al atacar un Defencer
        totalDmgD += hitDeffended.skill; // ------------------Stats
        // console.log(`${name1} hitted by thornmail - ${hitDeffended.skill}`);
      }

      //Al final del turno
      this.flag1 = endA(curHpA);
      this.flag2 = endD(curHpD);

      //Re-set stats
      return { totalDmgA, totalDmgD, totalDmgStopped, numHits };
    }
  };

  // To Save DATA
  saveFight: any = () => {
    let {
      winner,
      loser,
      totalDmg1,
      totalDmg2,
      numHits1,
      numHits2,
      totalDmgStopped1,
      totalDmgStopped2
    } = this.stats;
    let sqlMovidas = `INSERT INTO battle_information 
  VALUES (${this.hero1.heroStats.id}, ${
      this.hero2.heroStats.id
    }, ${winner}, ${loser}, ${this.hero1.heroStats.id_class}, ${Math.floor(
      totalDmg1
    )}, ${Math.floor(totalDmgStopped1)}, ${numHits1},${
      this.hero2.heroStats.id_class
    }, ${Math.floor(totalDmg2)}, ${Math.floor(
      totalDmgStopped2
    )}, ${numHits2}, null) ;`;
    console.log(sqlMovidas);

    connection.query(sqlMovidas);
  };
}
///**** */
/// OUT OF THE OBJECT
///**** */

let switchClass = (hero: any) => {
  let solution: any;
  switch (hero.id_class) {
    case 1:
      solution = new Archer(hero);
      break;
    case 2:
      solution = new Berserker(hero);
      break;
    case 3:
      solution = new Defender(hero);
      break;
    case 4:
      solution = new Fencer(hero);
      break;
    case 5:
      solution = new Ninja(hero);
      break;
    case 6:
      solution = new Paladin(hero);
      break;
    case 7:
      solution = new Sniper(hero);
      break;
    case 8:
      solution = new Soldier(hero);
      break;
    case 9:
      solution = new Thieve(hero);
      break;
  }
  return solution;
};
