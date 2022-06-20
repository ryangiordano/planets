import { AnimationHelper } from "../../utility/tweens/animation-helper";
import {
  getAngleDegreesBetweenPoints,
  getRandomInt,
} from "../../utility/Utility";

export default class LargeLaser extends Phaser.Physics.Arcade.Sprite {
  static spriteDependencies: SpriteDependency[] = [
    {
      frameHeight: 128,
      frameWidth: 128,
      key: "large_laser",
      url: "/src/assets/sprites/large_laser.png",
    },
  ];
  constructor({
    scene,
    x,
    y,
    targetX,
    targetY,
  }: {
    scene: Phaser.Scene;
    x: number;
    y: number;
    targetX: number;
    targetY: number;
  }) {
    super(scene, x, y, "large_laser", 0);
    const angleDeg = getAngleDegreesBetweenPoints(
      { x: targetX, y: targetY },
      { x, y }
    );
    const angle = angleDeg + 180;
    scene.physics.add.existing(this);
    scene.add.existing(this);
    const vec = scene.physics.velocityFromAngle(angle, 1);
    this.setAngle(angle + 90);

    const vx = vec.x * 2500;
    const vy = vec.y * 2500;

    this.setVelocity(vx, vy);

    const distance = Math.sqrt(Math.abs(targetX - x) + Math.abs(targetY - y));
    this.scene.tweens.add({
      targets: [this],
      scale: { from: 1.5, to: 0.1 },
      duration: distance * 10,
    });
  }
}

export class LaserTarget extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, null);
    scene.physics.add.existing(this);
    scene.add.existing(this);
    this.setAlpha(0);
  }
}

export class LaserImpact extends Phaser.Physics.Arcade.Sprite {
  public isActive = true;
  static spriteDependencies: SpriteDependency[] = [
    {
      frameHeight: 128,
      frameWidth: 128,
      key: "impact",
      url: "/src/assets/sprites/impact.png",
    },
  ];
  constructor(
    scene,
    x,
    y,
    //TODO: set this via game state
    public potency = 20
  ) {
    super(scene, x, y, null);
    scene.physics.add.existing(this);
    scene.add.existing(this);
    this.setAlpha(0);

    this.setAngle(getRandomInt(0, 359));
    const animationHelper = new AnimationHelper(this.scene);
    animationHelper.createGameAnimations([
      {
        key: "impact",
        frames: {
          typeOfGeneration: 1,
          frames: [0, 1, 2, 3, 4],
          key: "impact",
        },
        repeat: 0,
        frameRate: 45,
      },
    ]);
    setTimeout(() => {
      this.destroy?.();
    }, 500);
  }

  public handleImpact() {
    const impact = this.scene.add.existing(
      new LaserImpact(this.scene, this.x, this.y)
    ) as LaserImpact;
    impact.explode();
    this.destroy();
  }

  public explode() {
    this.setAlpha(0.4);
    this.setScale(Math.random() * (1 - 0.5) + 0.5);
    this.isActive = false;
    this.anims.play("impact");
    this.on("animationcomplete", () => {
      this.destroy?.();
    });
  }
}
