import {
  UpgradeableModule,
  ResourceModuleObject,
  ShipStatusObject,
} from "./types";

class ResourceModule {
  public upgradeableModule: UpgradeableModule;
  public currentValue: number;
  public baseValue: number;
  constructor({
    upgradeableModule,
    currentValue,
    baseValue,
  }: ResourceModuleObject) {
    this.upgradeableModule = upgradeableModule;
    this.currentValue = currentValue;
    this.baseValue = baseValue;
  }

  incrementValue(value: number) {
    this.currentValue = Math.min(this.getMaxValue(), value + this.currentValue);
  }
  decrementValue(value: number) {
    this.currentValue = Math.max(0, value - this.currentValue);
  }

  incrementLevel() {
    this.upgradeableModule.level++;
  }

  getMaxValue() {
    return (
      this.baseValue +
      this.upgradeableModule.level *
        (this.baseValue * this.upgradeableModule.multiplier)
    );
  }
}

export enum ShipModules {
  shield,
  health,
  laser,
  storage,
  engine,
}

const EXPERIENCE_CURVE = 1.2;
const EXPERIENCE_TO_NEXT_LEVEL = 100;

export class ShipStatus {
  public shipLevel: number;
  public shieldModule: ResourceModule;
  public healthModule: ResourceModule;
  public totalXP: number;
  public xpGainedThisLevel: number = 0;
  public totalSkillPoints: number;

  public laserModule: UpgradeableModule;
  public storageModule: UpgradeableModule;
  public engineModule: UpgradeableModule;
  private onLevelUp: (currentLevel: number) => void;
  public moduleMap: Map<ShipModules, UpgradeableModule>;
  constructor(
    {
      shipLevel,
      totalXP,
      totalSkillPoints,
      shieldModuleObject,
      healthModuleObject,
      laserModule,
      storageModule,
      engineModule,
    }: ShipStatusObject,
    onLevelUp: (currentLevel: number) => void
  ) {
    this.shipLevel = shipLevel;
    this.totalXP = totalXP;
    this.totalSkillPoints = totalSkillPoints;
    this.laserModule = laserModule;
    this.shieldModule = new ResourceModule(shieldModuleObject);
    this.healthModule = new ResourceModule(healthModuleObject);
    this.storageModule = storageModule;
    this.engineModule = engineModule;
    this.onLevelUp = onLevelUp;

    this.moduleMap = new Map([
      [ShipModules.engine, this.engineModule],
      [ShipModules.shield, this.shieldModule.upgradeableModule],
      [ShipModules.health, this.healthModule.upgradeableModule],
      [ShipModules.laser, this.laserModule],
      [ShipModules.storage, this.storageModule],
    ]);
  }

  incrementXP(value: number) {
    this.xpGainedThisLevel += value;
    if (this.xpGainedThisLevel >= this.getXPToNextLevel()) {
      while (this.getXPToNextLevel() <= this.xpGainedThisLevel) {
        this.levelUp();
      }
    }
  }

  getXPToNextLevel() {
    return EXPERIENCE_TO_NEXT_LEVEL * this.shipLevel * EXPERIENCE_CURVE;
  }

  levelUp() {
    this.totalXP += this.xpGainedThisLevel;
    this.xpGainedThisLevel = this.xpGainedThisLevel - this.getXPToNextLevel();

    this.shipLevel++;
    this.onLevelUp(this.shipLevel);
  }
}
