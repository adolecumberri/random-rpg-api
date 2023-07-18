import { Character } from "rpg-ts";

interface StorageModule {
  saveData(character: Character): Promise<void>;
  restoreCharacterById(id: number): Promise<Character | null>;
}

export default StorageModule;
