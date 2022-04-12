import { tweenToAngle } from "./shared";
const SHIP_VELOCITY = 250;

export default class Ship extends Phaser.Physics.Arcade.Sprite {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private emitter: Phaser.GameObjects.Particles.ParticleEmitter;
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

    const particles = this.scene.add.particles("ship", 1);

    this.emitter = particles.createEmitter({
      scale: { start: 0.8, end: 0 },
      blendMode: "ADD",
      angle: -this.angle,
      frequency: 100,
      alpha: 0.5,
    });

    this.emitter.stop();
    this.emitter.startFollow(this);

    this.body.setCircle(12, this.height / 2.5, this.width / 2.5);
  }

  private stopEngine() {
    !this.keyIsDown() && this.emitter.stop();
  }

  private startEngine() {
    this.emitter.start();
  }

  public setInputs() {
    this.cursors = this.scene.input.keyboard.createCursorKeys();

    this.cursors.down.addListener("down", () => {
      this.startEngine();
      tweenToAngle(this.cursors, this.scene, this);
      this.setAccelerationY(SHIP_VELOCITY);
    });
    this.cursors.down.addListener("up", () => {
      this.stopEngine();
      this.setAccelerationY(0);
      tweenToAngle(this.cursors, this.scene, this);
    });

    this.cursors.up.addListener("down", () => {
      this.startEngine();
      tweenToAngle(this.cursors, this.scene, this);
      this.setAccelerationY(-SHIP_VELOCITY);
    });
    this.cursors.up.addListener("up", () => {
      this.stopEngine();
      this.setAccelerationY(0);
      tweenToAngle(this.cursors, this.scene, this);
    });

    this.cursors.left.addListener("down", () => {
      this.startEngine();
      tweenToAngle(this.cursors, this.scene, this);
      this.setAccelerationX(-SHIP_VELOCITY);
    });

    this.cursors.left.addListener("up", () => {
      this.stopEngine();
      this.setAccelerationX(0);
      tweenToAngle(this.cursors, this.scene, this);
    });

    this.cursors.right.addListener("down", () => {
      this.startEngine();
      tweenToAngle(this.cursors, this.scene, this);
      this.setAccelerationX(SHIP_VELOCITY);
    });

    this.cursors.right.addListener("up", () => {
      this.stopEngine();
      this.setAccelerationX(0);
      tweenToAngle(this.cursors, this.scene, this);
    });
  }
  keyIsDown() {
    return Object.keys(this.cursors).some((key) => {
      switch (key) {
        case "down":
        case "up":
        case "left":
        case "right":
          return this.cursors[key].isDown;
      }
    });
  }

  update() {}
}
