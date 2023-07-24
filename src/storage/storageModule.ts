import { Character } from "rpg-ts";

interface StorageModule {
  saveHero(Hero: Character): Promise<void>;
  restoreHeroById(id: number): Promise<Character | null>;
}

export default StorageModule;
