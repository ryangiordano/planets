export default class Laser extends Phaser.Physics.Arcade.Sprite {
  static spriteDependencies: SpriteDependency[] = [
    {
      frameHeight: 16,
      frameWidth: 16,
      key: "laser",
      url: "/src/assets/sprites/laser.png",
    },
  ];
  constructor({
    scene,
    x,
    y,
    angle,
  }: {
    scene: Phaser.Scene;
    x: number;
    y: number;
    angle: number;
  }) {
    super(scene, x, y, "laser", 0);

    scene.physics.add.existing(this);
    scene.add.existing(this)
    const vec = scene.physics.velocityFromAngle(angle, 1);
    this.setAngle(angle + 90);
    
    const vx = vec.x * 1000;
    const vy = vec.y * 1000;

    this.setVelocity(vx, vy);
    
    setTimeout(() => {
      this.destroy();
    }, 3000);
  }
}
