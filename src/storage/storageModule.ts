import { Character } from "rpg-ts";
import { Hero, StoredHero } from "../types";

interface StorageModule {
  saveHero(Hero: Hero): Promise<void>;
  saveHeroes(Heroes: Hero[]): Promise<void>;
  getHeroById(id: number): Promise<StoredHero | null>;
}

export default StorageModule;
