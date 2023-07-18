import { Character } from "rpg-ts";

interface StorageModule {
  saveData(character: Character): Promise<void>;
}

export default StorageModule;
