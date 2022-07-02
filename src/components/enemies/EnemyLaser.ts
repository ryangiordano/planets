import { getAngleDegreesBetweenPoints } from "../../utility/Utility";

export default class EnemyLaser extends Phaser.Physics.Arcade.Sprite {
  public potency: number;
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
    potency,
    onReachDestination,
  }: {
    scene: Phaser.Scene;
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    potency: number;
    onReachDestination: (laser: EnemyLaser) => void;
  }) {
    super(scene, x, y, "large_laser", 0);
    this.potency = potency;
    const angleDeg = getAngleDegreesBetweenPoints(
      { x: targetX, y: targetY },
      { x, y }
    );
    const angle = angleDeg + 180;
    scene.physics.add.existing(this);
    scene.add.existing(this);
    this.setAngle(angle + 90);

    const distance = Math.sqrt(Math.abs(targetX - x) + Math.abs(targetY - y));
    this.scene.tweens.add({
      targets: [this],
      scale: { from: 0.1, to: 1 },
      duration: distance * 15,
      x: targetX,
      y: targetY,
      ease: "Cubic.easeIn",
      onComplete: () => {
        onReachDestination(this);
      },
    });
  }
}
