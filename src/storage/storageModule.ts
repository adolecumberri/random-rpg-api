import { Character } from "rpg-ts";
import { StoredHero } from "../types";

interface StorageModule {
  saveHero(Hero: Character): Promise<void>;
  getHeroById(id: number): Promise<StoredHero | null>;
}

export default StorageModule;
