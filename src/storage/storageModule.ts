import { Battle, Team } from "rpg-ts";
import { Hero } from "../types";

interface StorageModule {
  saveBattleTeams(battleId: number, battle: Battle, teamA: Team, TeamB: Team): Promise<void>;
  saveBattleHeroes(battleId: number, battle: Battle, heroA: Hero, heroB: Hero, alreadyExist: boolean): Promise<void>;
  saveHero(Hero: Hero): Promise<void>;
  saveHeroes(Heroes: Hero[]): Promise<void>;
  saveTeam(team: Team): Promise<void>;
  getHeroById(id: number): Promise<Hero | null>;
  getTeamById(id: number): Promise<Team | null>;
}

export default StorageModule;
