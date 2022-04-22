import SaveRepository from "../repositories/SaveRepository";
import { save } from "../player/save";
import {
  getStarSystem,
  StarSystemObject,
} from "../repositories/StarSystemRepository";
import { StellarBodyObject } from "../repositories/StellarBodyRepository";

export type SaveObject = {
  id: number;
  startingSystem: StarSystemObject;
  /** id of the bodies the user has access to */
  access: number[];
};

export function getSaveData(id: number): SaveObject {
  const sr = new SaveRepository(save);
  const saveData = sr.getById(id);
  const startingSystem = getStarSystem(saveData.startingSystem);

  
  return {
    id: saveData.id,
    startingSystem,
    access: saveData.access,
  };
}
