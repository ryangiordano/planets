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

export default class ResourceModule {
  public upgradeableModule: UpgradeableModule;
  public currentValue: number;
  public baseValue: number;
  constructor({ upgradeableModule, baseValue }: ResourceModuleObject) {
    this.upgradeableModule = upgradeableModule;
    this.baseValue = baseValue;
    this.currentValue = this.getMaxValue();
  }

  incrementValue(value: number) {
    this.currentValue = Math.min(this.getMaxValue(), value + this.currentValue);
  }
  decrementValue(value: number) {
    this.currentValue = Math.max(0, this.currentValue - value);
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

  getPercentage() {
    return this.currentValue / this.getMaxValue();
  }
}
