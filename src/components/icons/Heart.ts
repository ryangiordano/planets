export default class Heart extends Phaser.GameObjects.Sprite {
  static spriteDependencies: SpriteDependency[] = [
    {
      frameHeight: 32,
      frameWidth: 32,
      key: "icons",
      url: "/src/assets/sprites/icons.png",
    },
  ];
  constructor({
    scene,
    x,
    y,
    fill,
  }: {
    scene: Phaser.Scene;
    x: number;
    y: number;
    fill: number;
  }) {
    super(scene, x, y, "icons", 1);
    this.setTint(fill);
  }
}
