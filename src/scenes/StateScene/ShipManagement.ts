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

interface UpgradeableModule {
  multiplier: number;
  level: number;
}

interface ResourceModuleObject {
  upgradeableModule: UpgradeableModule;
  currentValue: number;
  /** Number that will be multiplied to get the max value */
  baseValue: number;
}

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
    if (this.xpGainedThisLevel > this.xpToNextLevel()) {
      while (this.xpToNextLevel() < this.xpGainedThisLevel) {
        this.levelUp();
      }
    }
  }

  xpToNextLevel() {
    return EXPERIENCE_TO_NEXT_LEVEL * this.shipLevel * EXPERIENCE_CURVE;
  }

  levelUp() {
    this.shipLevel++;
    this.totalXP += this.xpGainedThisLevel;
    this.xpGainedThisLevel = 0;
    this.onLevelUp(this.shipLevel);
  }
}

export function buildShipManagement(
  scene: Phaser.Scene,
  shipStatusObject: ShipStatusObject
) {
  const shipStatus = new ShipStatus(shipStatusObject, (currentLevel) => {
    scene.game.events.emit("player-level-up", { currentLevel });
  });

  function incrementHP(value: number) {
    shipStatus.healthModule.currentValue = Math.min(
      shipStatus.healthModule.getMaxValue(),
      shipStatus.healthModule.currentValue + value
    );

    scene.game.events.emit("player-health-decrease", {
      healthValue: shipStatus.healthModule.currentValue,
    });
  }

  function decrementHP(value: number) {
    shipStatus.healthModule.currentValue = Math.max(
      0,
      shipStatus.healthModule.currentValue - value
    );

    scene.game.events.emit("player-health-decrease", {
      healthValue: shipStatus.healthModule.currentValue,
    });
  }

  function incrementShields(value: number) {
    shipStatus.shieldModule.currentValue = Math.min(
      shipStatus.shieldModule.getMaxValue(),
      shipStatus.shieldModule.currentValue + value
    );

    scene.game.events.emit("player-shield-decrease", {
      shieldValue: shipStatus.shieldModule.currentValue,
    });
  }

  function decrementShields(value: number) {
    shipStatus.shieldModule.currentValue = Math.max(
      0,
      shipStatus.shieldModule.currentValue - value
    );

    scene.game.events.emit("player-shield-decrease", {
      shieldValue: shipStatus.shieldModule.currentValue,
    });
  }

  function increaseModuleLevel(module: ShipModules, value: number) {
    shipStatus.moduleMap.get(module).level += value;
    scene.game.events.emit("player-module-level-increase", {
      module,
      level: shipStatus.moduleMap.get(module).level,
    });
  }

  function incrementXP(value: number) {
    shipStatus.incrementXP(value);
    scene.game.events.emit("player-xp-increase", {
      currentXP: shipStatus.xpGainedThisLevel,
      xpToNextLevel: shipStatus.xpToNextLevel(),
    });
  }

  return {
    incrementHP,
    decrementHP,
    incrementShields,
    decrementShields,
    incrementXP,
    increaseModuleLevel,
    shipStatus,
  };
}

export type ShipStatusManager = ReturnType<typeof buildShipManagement>;
