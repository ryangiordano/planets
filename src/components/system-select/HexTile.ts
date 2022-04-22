import { StarSystemObject } from "../../assets/data/repositories/StarSystemRepository";
import StarSystem from "./StarSystem";

export default class HexTile extends Phaser.Physics.Arcade.Sprite {
  static spriteDependencies: SpriteDependency[] = [
    {
      frameHeight: 128,
      frameWidth: 128,
      key: "hex-tile",
      url: "/src/assets/sprites/hex.png",
    },
  ];

  private starSystem: StarSystem;
  public playerHasAccess: boolean = false;

  constructor({ scene, x, y }: { scene: Phaser.Scene; x: number; y: number }) {
    super(scene, 0, 0, "hex-tile");
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setTint(0x6e6e6e);
    this.setX(!(y % 2) ? x * this.width + this.width / 2 : x * this.width);
    this.setY((y * this.height) / 1.4);
    this.setVisible(false);
  }

  setUnexplored() {
    this.setVisible(true);
    this.setAlpha(0.1);
  }

  addSystem(systemObject: StarSystemObject) {
    this.setVisible(true);
    this.setAlpha(1);
    this.starSystem = new StarSystem({
      scene: this.scene,
      x: this.x,
      y: this.y,
      systemObject,
    });
  }

  hasStarSystem() {
    return !!this.starSystem;
  }
}
