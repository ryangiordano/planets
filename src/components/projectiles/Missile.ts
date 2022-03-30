import { YELLOW, RED } from "../../utility/Constants";
export default class Missile extends Phaser.Physics.Arcade.Sprite {
  private velocity: { x: number; y: number };

  shooter = undefined;

  constructor({
    scene,
    x,
    y,
    velocity,
    frame = 0,
    shooter,
  }: {
    scene: Phaser.Scene;
    x: number;
    y: number;
    velocity: { x: number; y: number };
    frame?: number;
    shooter: Phaser.Physics.Arcade.Sprite;
  }) {
    super(scene, x, y, "missile", frame);
    this.shooter = shooter;
    this.scene.physics.add.existing(this);

    this.velocity = velocity;
    this.setTint(RED.hex);
  }

  public init() {
    this.setVelocity(this.velocity.x, 0);

    setTimeout(() => {
      this.destroy();
    }, Math.max(this.velocity.x, 5000));
  }

  static spriteDependencies: SpriteDependency[] = [
    {
      frameWidth: 32,
      frameHeight: 32,
      key: "missile",
      url: "src/assets/sprites/missile.png",
    },
  ];
}
