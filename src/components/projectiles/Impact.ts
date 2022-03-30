import { YELLOW } from "../../utility/Constants";
export default class Impact extends Phaser.GameObjects.Sprite {
  constructor({ scene, x, y }: { scene: Phaser.Scene; x: number; y: number }) {
    super(scene, x, y, "impact");
    this.scene.add.existing(this);
    this.anims.create({
      repeat: 0,
      key: "impact",
      frames: this.anims.generateFrameNumbers("impact", {
        frames: [4, 3, 2, 1, 0],
      }),
      frameRate: 20,
    });
    this.setTint(YELLOW.hex);
  }

  init() {
    this.anims.play("impact");
    this.on("animationcomplete", () => this.destroy());
  }

  static spriteDependencies: SpriteDependency[] = [
    {
      frameWidth: 64,
      frameHeight: 64,
      key: "impact",
      url: "src/assets/sprites/impact.png",
    },
  ];
}
