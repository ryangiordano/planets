import {
  getCanvasPosition,
  getAngleDegreesBetweenPoints,
} from "../../utility/Utility";
import Laser from "./Laser";
import { tweenToAngle } from "./shared";
import { createShipAttackModule } from "./ShipAttack";
const SHIP_VELOCITY = 250;

export default class Ship extends Phaser.Physics.Arcade.Sprite {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private emitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private canFire: boolean = false;
  private onFire: (laser: Laser) => void;
  static spriteDependencies: SpriteDependency[] = [
    {
      frameHeight: 128,
      frameWidth: 128,
      key: "ship",
      url: "/src/assets/sprites/ship.png",
    },
    ...Laser.spriteDependencies,
  ];
  constructor({
    scene,
    x,
    y,
    onFire,
    canFire = true,
  }: {
    scene: Phaser.Scene;
    x: number;
    y: number;
    onFire?: (laser: Laser) => void;
    canFire?: boolean;
  }) {
    super(scene, x, y, "ship");
    scene.physics.add.existing(this);
    scene.add.existing(this);
    this.setDrag(250);
    this.setMaxVelocity(250);
    this.onFire = onFire;
    this.canFire = canFire;
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
    this.cursors = {
      up: this.scene.input.keyboard.addKey("W"),
      left: this.scene.input.keyboard.addKey("A"),
      down: this.scene.input.keyboard.addKey("S"),
      right: this.scene.input.keyboard.addKey("D"),
      space: this.scene.input.keyboard.addKey("space"),
      shift: this.scene.input.keyboard.addKey("shift"),
    };

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

    if (this.canFire) {
      const throttledFire = createShipAttackModule(500, (pointer) => {
        const pos = getCanvasPosition(this.scene.cameras.main, this);
        const angleDeg = getAngleDegreesBetweenPoints(pointer, pos);
        const laser = new Laser({
          scene: this.scene,
          angle: angleDeg + 180,
          x: this.x,
          y: this.y,
        });
        this.onFire(laser);
      });

      this.scene.input.on("pointerdown", (pointer) => {
        throttledFire(pointer);
      });
    }
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
