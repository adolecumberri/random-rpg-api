import { Team } from "rpg-ts";
import { Hero } from "../types";

interface StorageModule {
  saveHero(Hero: Hero): Promise<void>;
  saveHeroes(Heroes: Hero[]): Promise<void>;
  getHeroById(id: number): Promise<Hero | null>;
  saveTeam(team: Team): Promise<void>;
}

export default StorageModule;
