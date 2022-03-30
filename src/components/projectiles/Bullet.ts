import { Projectible } from "./Projectible";
export default class Bullet
  extends Phaser.Physics.Arcade.Sprite
  implements Projectible
{
  private velocity: { x: number; y: number };
  constructor({
    scene,
    x,
    y,
    shooter,
  }: {
    scene: Phaser.Scene;
    x: number;
    y: number;
    shooter: Phaser.Physics.Arcade.Sprite;
  }) {
    super(scene, x, y, null);
    this.setAlpha(0);
    this.setScale(500, 1);
    this.scene.physics.add.existing(this);
    this.setOrigin(0, 0);
    this.shooter = shooter;
  }

  public init() {
    setTimeout(() => {
      this.destroy();
    }, 100);
  }

  shooter = undefined;

  static spriteDependencies: SpriteDependency[] = [
    {
      frameWidth: 32,
      frameHeight: 32,
      key: "bullet",
      url: "src/assets/sprites/bullet.png",
    },
  ];
}
