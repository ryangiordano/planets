import ResourceModule, {
  UpgradeableModule,
} from "../../components/battle/ResourceModule";
import { ShipStatusObject } from "./types";
import { Combatable } from "../../components/battle/Combatant";

export enum ShipModules {
  shield,
  health,
  laser,
  storage,
  engine,
}

const EXPERIENCE_CURVE = 1.2;
const EXPERIENCE_TO_NEXT_LEVEL = 100;
//TODO: Refactor so that we can share code between ShipStatus and Combatant,
// there is a lot of copy and pasted code
export class ShipStatus implements Combatable {
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

  public incrementXP(value: number) {
    this.xpGainedThisLevel += value;
    if (this.xpGainedThisLevel >= this.getXPToNextLevel()) {
      while (this.getXPToNextLevel() <= this.xpGainedThisLevel) {
        this.levelUp();
      }
    }
  }

  public getXPToNextLevel() {
    return EXPERIENCE_TO_NEXT_LEVEL * this.shipLevel * EXPERIENCE_CURVE;
  }

  levelUp() {
    this.totalXP += this.xpGainedThisLevel;
    this.xpGainedThisLevel = this.xpGainedThisLevel - this.getXPToNextLevel();

    this.shipLevel++;
    this.onLevelUp(this.shipLevel);
  }

  private incrementHP(value: number) {
    this.healthModule.incrementValue(value);
  }

  private decrementHP(value: number) {
    this.healthModule.decrementValue(value);
  }

  private incrementShields(value: number) {
    this.shieldModule.incrementValue(value);
  }

  private decrementShields(value: number) {
    this.shieldModule.decrementValue(value);
  }

  public increaseModuleLevel(module: ShipModules, value: number) {
    this.moduleMap.get(module).level += value;
  }

  public takeDamage({
    potency,
    onDamageHealth,
    onDamageShield,
    onDeath,
  }: {
    potency: number;
    onDamageShield: () => void;
    onDamageHealth: () => void;
    onDeath: () => void;
  }) {
    if (
      this.shieldModule.currentValue <= 0 &&
      this.healthModule.currentValue - potency <= 0
    ) {
      onDeath();
      return;
    }
    if (this.shieldModule.currentValue <= 0) {
      this.decrementHP(potency);
      onDamageHealth();
      return;
    }
    this.decrementShields(potency);
    onDamageShield();
  }

  public recoverShield(potency: number) {
    this.incrementShields(potency);
  }

  public recoverHealth(potency: number) {
    this.incrementHP(potency);
  }
  public getAttackPower() {
    const potency =
      25 * (this.laserModule.level * this.laserModule.multiplier);
    return potency;
  }
}
