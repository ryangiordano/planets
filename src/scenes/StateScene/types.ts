import {
  UpgradeableModule,
  ResourceModuleObject,
} from "../../components/battle/ResourceModule";

/** Handle gaining xp, reaching new levels, spending skill points */
export type ShipStatusObject = {
  shipLevel: number;
  totalXP: number;
  totalSkillPoints: number;
  laserModule: UpgradeableModule;
  engineModule: UpgradeableModule;
  storageModule: UpgradeableModule;
  healthModuleObject: ResourceModuleObject;
  shieldModuleObject: ResourceModuleObject;
};
