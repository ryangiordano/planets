import SaveRepository from "./SaveRepository";
import { save } from "./save";
import {
  getStarSystem,
  StarSystemObject,
} from "../star-systems/StarSystemRepository";
import { createRandomSystem } from "../star-systems/RandomGeneration";

export type SaveObject = {
  id: number;
  startingSystem: StarSystemObject;
  /** id of the bodies the user has access to */
  access: number[];
};

export function getSaveData(id?: number): SaveObject {
  if (id === undefined) {
    const startingSystem = generateInitialGameState([10, 10]);
    return {
      id: Math.random() * new Date().getTime(),
      startingSystem,
      access: [startingSystem.id],
    };
  }

  const sr = new SaveRepository(save);
  const saveData = sr.getById(id);
  const startingSystem = getStarSystem(saveData.startingSystem);
  return {
    id: saveData.id,
    startingSystem,
    access: saveData.access,
  };
}
/** In the absence of save data, generate a random world state */
export function generateInitialGameState(startingCoordinates) {
  const system = createRandomSystem(startingCoordinates);
  return system;
}
