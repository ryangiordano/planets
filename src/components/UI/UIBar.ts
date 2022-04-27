import { WHITE } from "../../utility/Constants";

export enum BarType {
  horizontal,
  vertical,
}

export class UIBar extends Phaser.GameObjects.Container {
  private barBack: Phaser.GameObjects.Rectangle;
  private barFill: Phaser.GameObjects.Rectangle;
  private barBorder: Phaser.GameObjects.RenderTexture;
  private barType: BarType;
  static spriteDependencies: SpriteDependency[] = [
    {
      frameHeight: 128,
      frameWidth: 128,
      key: "UI_box",
      url: "/src/assets/sprites/UI_box.png",
    },
  ];
  constructor(
    scene: Phaser.Scene,
    position: Coords,
    private currentValue: number,
    private maxValue: number,
    color: number,
    private barWidth: number = 32,
    private barHeight: number = 128
  ) {
    super(scene, position.x, position.y);

    this.barType = barWidth > barHeight ? BarType.horizontal : BarType.vertical;
    // this.barBack = new Phaser.GameObjects.Rectangle(
    //   scene,
    //   0,
    //   0,
    //   this.barWidth,
    //   this.barHeight,
    //   WHITE.hex,
    //   1
    // );

    this.barBorder = scene.add.nineslice(
      0,
      0,
      barWidth,
      barHeight,
      "UI_box",
      5
    );

    this.barBorder.setOrigin(0.5, 0.5);

    this.barFill = new Phaser.GameObjects.Rectangle(
      scene,
      0,
      0,
      this.barType === BarType.horizontal
        ? this.barWidth
        : this.barWidth - this.barWidth / 3,

      this.barType === BarType.horizontal
        ? this.barHeight - this.barHeight / 3
        : this.barHeight,

      color,
      1
    );
    // Depending on the dimensions of the bar, we fill the width or the height
    if (this.barWidth > this.barHeight) {
      this.barFill.width = 0;
    } else {
      this.barFill.height = 0;
      this.barFill.y = this.barBorder.height;
    }

    this.add(this.barFill);
    this.bringToTop(this.barFill);
    this.add(this.barBorder);
    this.bringToTop(this.barBorder);
    this.setBar();
  }

  setCurrentValue(newValue: number): Promise<void> {
    return new Promise(async (resolve) => {
      this.currentValue = Math.max(0, newValue);
      await this.setBar();
      resolve();
    });
  }
  setBar(): Promise<void> {
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
}
