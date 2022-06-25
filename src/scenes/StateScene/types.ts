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

export interface UpgradeableModule {
  multiplier: number;
  level: number;
}

export interface ResourceModuleObject {
  upgradeableModule: UpgradeableModule;
  currentValue: number;
  /** Number that will be multiplied to get the max value */
  baseValue: number;
}
