import { Battle, Team } from "rpg-ts";
import { Hero } from "../types";

interface StorageModule {
  saveBattle(battle: Battle): Promise<void>;
  saveHero(Hero: Hero): Promise<void>;
  saveHeroes(Heroes: Hero[]): Promise<void>;
  saveTeam(team: Team): Promise<void>;
  getHeroById(id: number): Promise<Hero | null>;
  getTeamById(id: number): Promise<Team | null>;
}

export default StorageModule;
