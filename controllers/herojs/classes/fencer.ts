import { connection } from "../../../config/database";
import { IHeroFight, IHeroEfects } from "../../../interfaces/Hero.Interface";

export class Fencer {
  constructor(data: IHeroFight) {
    this.heroStats = { ...data };
    this.heroEfects = {
      dmg: 0,
      def: 0,
      dex: 0
    };
  }

  //Propiedades.
  heroStats: IHeroFight; //Estadisticas
  heroEfects: IHeroEfects; //E stados cambiados
  isDead = false;

  //Counter
  skillProb: number = 0.22;
  skill: any = (damage: number) => this.hit(damage);

  //Beginning -> function executed when the figth starts. just 1 time.
  beginning: any = () => {};

  //START
  start: any = () => {};

  //HIT
  hit: any = (): { type: string; dmg: number } => {
    let solution: { type: string; dmg: number; state?: any } = {
      type: "",
      dmg: 0,
      state: {}
    };
    let { accuracy, crit, critDmg, dmg } = this.heroStats;
    let { dmg: dmgEf } = this.heroEfects;
    accuracy > getProb()
      ? // do it hit?
        crit > getProb()
        ? //is it critical?
          (solution = {
            type: "crit",
            dmg: rand(
              (dmg + dmgEf) * (critDmg + 1) * 0.85,
              (dmg + dmgEf) * (critDmg + 1) * 1.15
            )
          })
        : (solution = {
            type: "normal",
            dmg: rand((dmg + dmgEf) * 0.85, (dmg + dmgEf) * 1.15)
          })
      : (solution = { type: "miss", dmg: 0 });

    return solution;
  };

  //CALC DAMAGE AFTER BLOCKING
  isHitted: any = (
    damage: number
  ): { evaded: boolean; dmg: number; skill?: number } => {
    let { def, evasion } = this.heroStats;
    let { def: defEf } = this.heroEfects;
    let finalDamage = Math.floor(
      (damage * (100 - (def + defEf) * 0.9)) / 100 - (def + defEf) * 0.29
    );

    let solution: { evaded: boolean; dmg: number; skill?: number };

    this.skillProb < getProb()
      ? (solution = {
          dmg: finalDamage <= 0 ? 1 : finalDamage,
          evaded: evasion >= getProb() ? true : false
        })
      : (solution = {
          dmg: 0,
          evaded: false,
          skill: this.skill(damage).dmg
        });
    return solution;
  };

  //SET new HP
  setHp: any = (newHp: number) => {
    this.heroStats = { ...this.heroStats, currentHp : newHp};
  };

  //END
  end: any = (newCurHp: number) : boolean => {
    if (newCurHp <= 0) {
      this.isDead = true;
    }
    return this.isDead;
  };

  //HERO DIES
  heroDead : any = () => {
    connection.query(
      `UPDATE hero SET isAlive = 0 WHERE id = ${this.heroStats.id}`
    );
  };

   //HERO WINS
   heroWins: any = () =>
   connection.query(
     `UPDATE hero SET kills = ${this.heroStats.kills + 1} WHERE id = ${
       this.heroStats.id
     }`
   );


  calcNextTurn = (curDex: number) => (curDex += this.heroStats.dexterity);
}

//function to generate rand numbers
const rand = (min: number, max: number) =>
  Math.round(Math.random() * (max - min) + min);

//function to load probabilities.
const getProb = () => Math.random();
