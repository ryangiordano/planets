import { getAngleDegreesBetweenPoints } from "../../utility/Utility";

export default class MiningLaser extends Phaser.Physics.Arcade.Sprite {
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
      scale: { from: 1, to: 0.1 },
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
  constructor(scene, x, y) {
    super(scene, x, y, null);
    scene.physics.add.existing(this);
    scene.add.existing(this);
    // this.setAlpha(0);

    setTimeout(() => {
      this.destroy?.();
    }, 1000);
  }
}
