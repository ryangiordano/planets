import { tweenToAngle } from "./shared";
const SHIP_VELOCITY = 250;

export default class Ship extends Phaser.Physics.Arcade.Sprite {
  static spriteDependencies: SpriteDependency[] = [
    {
      frameHeight: 128,
      frameWidth: 128,
      key: "ship",
      url: "/src/assets/sprites/ship.png",
    },
  ];
  constructor({ scene, x, y }: { scene: Phaser.Scene; x: number; y: number }) {
    super(scene, x, y, "ship");
    scene.physics.add.existing(this);
    scene.add.existing(this);
    this.setDrag(250);
    this.setMaxVelocity(250);
    this.setInputs();
  }

  /** Add listeners for player movement,
   * let callback handle any side effects of movement */
  public setInputs() {
    const cursors = this.scene.input.keyboard.createCursorKeys();

    cursors.down.addListener("down", () => {
      tweenToAngle(cursors, this.scene, this);
      this.setAccelerationY(SHIP_VELOCITY);
    });
    cursors.down.addListener("up", () => {
      this.setAccelerationY(0);
      tweenToAngle(cursors, this.scene, this);
    });

    cursors.up.addListener("down", () => {
      tweenToAngle(cursors, this.scene, this);
      this.setAccelerationY(-SHIP_VELOCITY);
    });
    cursors.up.addListener("up", () => {
      this.setAccelerationY(0);
      tweenToAngle(cursors, this.scene, this);
    });

    cursors.left.addListener("down", () => {
      tweenToAngle(cursors, this.scene, this);
      this.setAccelerationX(-SHIP_VELOCITY);
    });

    cursors.left.addListener("up", () => {
      this.setAccelerationX(0);
      tweenToAngle(cursors, this.scene, this);
    });

    cursors.right.addListener("down", () => {
      tweenToAngle(cursors, this.scene, this);
      this.setAccelerationX(SHIP_VELOCITY);
    });

    cursors.right.addListener("up", () => {
      this.setAccelerationX(0);
      tweenToAngle(cursors, this.scene, this);
    });
  }
}
