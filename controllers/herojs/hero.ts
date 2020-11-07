import { IHeroStats, IHeroBase } from "../../interfaces/Hero.Interface";
import { connection } from "../../config/database";

//FUNCTION
export function Hero(data: any): any {
  let heroStats = {...data};
  let isDead = false;
  let {
    accuracy,
    currentHp,
    crit,
    critDmg,
    def,
    dmg,
    id,
    name,
    att_interval,
    evasion
  } = data;
  const initialData = data; // datos para resetear cuando viene un estado.
  let turnsWithStatsChanged = 0;

  let beginning = () => {};

  //Devuelve el tipo de golpe (miss, crit, normal)
  let hit = (callback: any) => {
    let solution: { name: string; type: string; dmg: number; state?: any } = {
      name: "",
      type: "",
      dmg: 0,
      state: {}
    };
    accuracy > getProb()
      ? // do it hit?
        crit > getProb()
        ? //is it critical?
          (solution = {
            name,
            type: "crit",
            dmg: rand(dmg * (critDmg + 1) * 0.85, dmg * (critDmg + 1) * 1.15)
          })
        : (solution = {
            name: name,
            type: "normal",
            dmg: rand(dmg * 0.85, dmg * 1.15)
          })
      : (solution = { name, type: "miss", dmg: 0 });

    callback ? (solution.state = callback()) : "";
    return solution;
  };

  //Recibe golpe
  let deffence = (damage: number, callback: any) => {
    let finalDamage = Math.floor(
      (damage * (100 - def * 0.9)) / 100 - def * 0.29
    );
   
    return {damage : finalDamage < 0 ? 1 : finalDamage , evaded : evasion < Math.random() ? 1 : 0}; //si es menos de 0, el daño es 1
  };

  //checkeo al final del turno
  let end = (newCurrentHp: number, callback: any) => {
    if (newCurrentHp <= 0) {
      isDead = true;
      heroDead();
    }

    //resto un turno, si es 0 o menor, reseteo
    if (turnsWithStatsChanged > 0) {
      turnsWithStatsChanged--;
      if(turnsWithStatsChanged == 0)
      resetState();
    }
    return isDead;
  };

  //si el heroe muere, cambio la bbdd
  let heroDead = () => {
    connection.query(`UPDATE hero SET isAlive = 0 WHERE id = ${id}`);
  };

  //Resetea estado cuando un efecto acaba
  let resetState = () => {
    accuracy = initialData.accuracy;
    crit = initialData.crit;
    dmg = initialData.dmg;
    def = initialData.def;
    att_interval = initialData.att_interval;
  };
  //cambia estados y añade los tiempos.
  let alterState = (
    {
      accuracy: newAc = 0,
      crit: newCrit = 0,
      dmg: newDmg = 0,
      def: newDef = 0,
      att_interval: newDex = 0
    }: {
      accuracy?: any;
      crit?: any;
      dmg?: any;
      def?: any;
      att_interval?: any;
    },
    turns: number
  ) => {
    newAc += accuracy;
    newDmg += dmg;
    newCrit += crit;
    newDef += def;
    newDex += att_interval;
    turnsWithStatsChanged = turns;
  };

  return {
    heroStats,
    beginning,
    hit,
    deffence,
    end,
    alterState,
    resetState,
    heroDead
  };
}

//function to generate rand numbers
const rand = (min: number, max: number) =>
  Math.round(Math.random() * (max - min) + min);

//function to load probabilities.
const getProb = () => Math.random();
