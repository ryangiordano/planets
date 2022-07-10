import ResourceModule, { UpgradeableModule } from "./ResourceModule";

export interface Combatable {
  healthModule: ResourceModule;
  shieldModule: ResourceModule;
  laserModule: UpgradeableModule;
  storageModule: UpgradeableModule;
  engineModule: UpgradeableModule;
  takeDamage: (config: {
    potency: number;
    onDamageShield: () => void;
    onDamageHealth: () => void;
    onDeath?: () => void;
  }) => void;
  recoverShield: (potency: number) => void;
  recoverHealth: (potency: number) => void;
  getAttackPower: () => number;
  x?: number;
  y?: number;
}

export default class Combatant
  extends Phaser.Physics.Arcade.Sprite
  implements Combatable
{
  public healthModule: ResourceModule;
  public shieldModule: ResourceModule;
  public laserModule: UpgradeableModule;
  public storageModule: UpgradeableModule;
  public engineModule: UpgradeableModule;
  public level: number;

  constructor({
    scene,
    x,
    y,
    texture,
    healthModule,
    shieldModule,
    laserModule,
    storageModule,
    engineModule,
  }: {
    scene: Phaser.Scene;
    x: number;
    y: number;
    texture: string;
    healthModule: ResourceModule;
    shieldModule: ResourceModule;
    laserModule: UpgradeableModule;
    storageModule: UpgradeableModule;
    engineModule: UpgradeableModule;
  }) {
    super(scene, x, y, texture);
    this.setInteractive();
    this.healthModule = healthModule;
    this.shieldModule = shieldModule;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.laserModule = laserModule;
    this.storageModule = storageModule;
    this.engineModule = engineModule;
  }

  private incrementHP(value: number) {
    this.healthModule.currentValue = Math.min(
      this.healthModule.getMaxValue(),
      this.healthModule.currentValue + value
    );
  }

  private decrementHP(value: number) {
    this.healthModule.currentValue = Math.max(
      0,
      this.healthModule.currentValue - value
    );
  }

  private incrementShields(value: number) {
    this.shieldModule.currentValue = Math.min(
      this.shieldModule.getMaxValue(),
      this.shieldModule.currentValue + value
    );
  }

  private decrementShields(value: number) {
    this.shieldModule.currentValue = Math.max(
      0,
      this.shieldModule.currentValue - value
    );
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
      return onDeath();
    }
    if (this.shieldModule.currentValue <= 0) {
      onDamageShield();
      return this.decrementHP(potency);
    }
    onDamageHealth();
    this.decrementShields(potency);
  }

  public recoverShield(potency: number) {
    this.incrementShields(potency);
  }

  public recoverHealth(potency: number) {
    this.incrementHP(potency);
  }

  public getAttackPower() {
    return 10 * (this.laserModule.level * this.laserModule.multiplier);
  }
}
