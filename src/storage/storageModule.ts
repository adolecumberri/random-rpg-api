import { Team } from "rpg-ts";
import { Hero, StoredHero } from "../types";

interface StorageModule {
  saveHero(Hero: Hero): Promise<void>;
  saveHeroes(Heroes: Hero[]): Promise<void>;
  getHeroById(id: number): Promise<StoredHero | null>;
  saveTeam(team: Team): Promise<void>;
}

export default StorageModule;
