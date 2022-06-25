export enum BarType {
  horizontal,
  vertical,
}

export class UIBar extends Phaser.GameObjects.Container {
  private barBack: Phaser.GameObjects.Rectangle;
  private barFill: Phaser.GameObjects.Rectangle;
  private barBorder: Phaser.GameObjects.RenderTexture;
  private barType: BarType;
  private barWidth: number;
  private barHeight: number;
  private maxValue: number;
  private currentValue: number;

  private hasBackground: boolean;
  private color: number;
  static spriteDependencies: SpriteDependency[] = [
    {
      frameHeight: 128,
      frameWidth: 128,
      key: "UI_box",
      url: "/src/assets/sprites/UI_box.png",
    },
  ];
  constructor({
    scene,
    position,
    currentValue,
    maxValue,
    color,
    barWidth = 32,
    barHeight = 128,
    hasBackground = false,
  }: {
    scene: Phaser.Scene;
    position: Coords;
    currentValue: number;
    maxValue: number;
    color: number;
    barWidth?: number;
    barHeight?: number;
    hasBackground?: boolean;
  }) {
    super(scene, position.x, position.y);
    this.color = color;
    this.hasBackground = hasBackground;
    this.barWidth = barWidth;
    this.barHeight = barHeight;
    this.maxValue = maxValue;
    this.currentValue = currentValue;
    this.barType = barWidth > barHeight ? BarType.horizontal : BarType.vertical;

    this.barBorder = scene.add.nineslice(
      0,
      0,
      barWidth,
      barHeight,
      "UI_box",
      5
    );

    this.barBorder.setOrigin(0.5, 0.5);

    this.initBarFill();

    this.add(this.barBorder);
    this.bringToTop(this.barBorder);
    this.setBar();
  }

  private initBarFill() {
    const barFillWidth =
      this.barType === BarType.horizontal
        ? this.barWidth
        : this.barWidth - this.barWidth / 3;
    const barFillHeight =
      this.barType === BarType.horizontal
        ? this.barHeight - this.barHeight / 3
        : this.barHeight;
    this.barFill = new Phaser.GameObjects.Rectangle(
      this.scene,
      0,
      0,
      barFillWidth,
      barFillHeight,
      this.color,
      1
    );
    if (this.hasBackground) {
      this.barBack = new Phaser.GameObjects.Rectangle(
        this.scene,
        0,
        0,
        barFillWidth,
        barFillHeight,
        this.color,
        1
      );
      this.barBack.setAlpha(0.2);
      this.add(this.barBack);
    }
    // Depending on the dimensions of the bar, we fill the width or the height
    if (this.barWidth > this.barHeight) {
      this.barFill.width = 0;
    } else {
      this.barFill.height = 0;
      this.barFill.y = this.barBorder.height;
    }

    this.add(this.barFill);
    this.bringToTop(this.barFill);
  }

  public incrementBy(valueToIncrementBy) {
    this.setCurrentValue(this.currentValue + valueToIncrementBy);
  }

  public setCurrentValue(newValue: number): Promise<void> {
    return new Promise(async (resolve) => {
      this.currentValue = Math.max(0, Math.min(newValue, this.maxValue));
      await this.setBar();
      resolve();
    });
  }

  private setBar(): Promise<void> {
    return new Promise((resolve) => {
      const barValue = Math.max(this.barWidth, this.barHeight);
      const fill = barValue / (this.maxValue / this.currentValue);
      const toTween =
        this.barHeight > this.barWidth ? { height: -fill } : { width: fill };

      this.scene.tweens.add({
        targets: this.barFill,
        duration: 300,
        ...toTween,
        onComplete: () => {
          resolve();
        },
      });
    });
  }

  getMaxValue() {
    return this.maxValue;
  }
  setMaxValue(maxValue: number) {
    if (maxValue <= 0) {
      throw new Error(`maxValue cannot be less than 0, received ${maxValue}`);
    }
    this.maxValue = Math.max(maxValue, 1);
    if (this.currentValue > this.maxValue) {
      this.setCurrentValue(this.maxValue);
    }
  }
}
