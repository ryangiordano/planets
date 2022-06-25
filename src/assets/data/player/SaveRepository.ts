import { ShipStatusObject } from "../../../scenes/StateScene/types";
import { Repository } from "../repository/Repository";

export type SaveData = {
  id: number;
  startingSystem: number;
  access: number[];
  shipStatus: ShipStatusObject;
};

export default class SaveRepository extends Repository<SaveData> {
  constructor(saveData) {
    super(saveData);
  }
}

export function getDefaultShipStatus() {
  return {
    shipStatus: {
      shipLevel: 1,
      totalXP: 0,
      totalSkillPoints: 0,
      laserModule: {
        multiplier: 0.3,
        level: 1,
      },
      engineModule: {
        multiplier: 0.3,
        level: 1,
      },
      storageModule: {
        multiplier: 0.3,
        level: 1,
      },
      healthModuleObject: {
        upgradeableModule: {
          multiplier: 0.3,
          level: 1,
        },
        currentValue: 100,
        baseValue: 100,
      },
      shieldModuleObject: {
        upgradeableModule: {
          multiplier: 0.3,
          level: 1,
        },
        currentValue: 100,
        baseValue: 100,
      },
    },
  };
}
