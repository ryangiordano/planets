export class Bar extends Phaser.GameObjects.Container {
  private barFill: Phaser.GameObjects.Rectangle;
  private barWidth: number = 90;
  constructor(
    scene: Phaser.Scene,
    position: Coords,
    private currentValue: number,
    private maxValue: number
  ) {
    super(scene, position.x, position.y);
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
      const fill = this.barWidth / (this.maxValue / this.currentValue);
      const tween = this.scene.tweens.add({
        targets: this.barFill,
        duration: 300,
        width: fill,
        onComplete: () => {
          resolve();
        },
      });
    });
  }
}
