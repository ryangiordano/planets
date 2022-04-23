import { StarSystemObject } from "../../assets/data/repositories/StarSystemRepository";
export default class StarSystem extends Phaser.Physics.Arcade.Sprite {
  public systemObject: StarSystemObject;
  static spriteDependencies: SpriteDependency[] = [
    {
      frameHeight: 128,
      frameWidth: 128,
      key: "star",
      url: "/src/assets/sprites/star.png",
    },
  ];
  constructor({
    scene,
    x,
    y,
    systemObject,
  }: {
    scene: Phaser.Scene;
    x: number;
    y: number;
    systemObject: StarSystemObject;
  }) {
    super(scene, x, y, "star", 2);
    this.scene.add.existing(this);
    this.systemObject = systemObject;

    this.setTint(systemObject.sun.color);
  }
}
