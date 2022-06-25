import SaveRepository from "./SaveRepository";
import { save } from "./save";
import {
  getStarSystem,
  StarSystemObject,
} from "../star-systems/StarSystemRepository";
import { createRandomSystem } from "../star-systems/RandomGeneration";
import { ShipStatusObject } from "../../../scenes/StateScene/ShipManagement";
import { getDefaultShipStatus } from "./SaveRepository";

export type SaveObject = {
  id: number;
  startingSystem: StarSystemObject;
  /** id of the bodies the user has access to */
  access: number[];
  shipStatus: ShipStatusObject;
};

export function getSaveData(id?: number): SaveObject {
  if (id === undefined) {
    const startingSystem = generateInitialGameState([10, 10]);
    return {
      id: Math.random() * new Date().getTime(),
      startingSystem,
      access: [startingSystem.id],
      shipStatus: { ...getDefaultShipStatus().shipStatus },
    };
  }

  const sr = new SaveRepository(save);
  const saveData = sr.getById(id);
  const startingSystem = getStarSystem(saveData.startingSystem);
  return {
    id: saveData.id,
    startingSystem,
    access: saveData.access,
    shipStatus: saveData.shipStatus,
  };
}
/** In the absence of save data, generate a random world state */
export function generateInitialGameState(startingCoordinates) {
  const system = createRandomSystem(startingCoordinates, 1);
  return system;
}
