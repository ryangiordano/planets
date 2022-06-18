import { StarSystemObject } from "../../assets/data/star-systems/StarSystemRepository";
import { ResourceType } from "../../assets/data/stellar-bodies/Types";
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

  public starSystem: StarSystem;
  public playerHasAccess: boolean = false;
  public focusColor: number = 0xbddebd;
  public color: number = 0x6e6e6e;

  public coordinates: [number, number];
  public unlockRequirements: [ResourceType, number];
  public discovered: boolean = false;
  constructor({ scene, x, y }: { scene: Phaser.Scene; x: number; y: number }) {
    super(scene, 0, 0, "hex-tile");
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setTint(this.color);
    this.setX(!(y % 2) ? x * this.width + this.width / 2 : x * this.width);
    this.setY((y * this.height) / 1.4);
    this.setVisible(false);

    this.coordinates = [x, y];
    this.body.setCircle(50, 15, 15);
  }

  setUnexplored() {
    this.discovered = true;
    this.setVisible(true);
    this.setAlpha(0.1);
    this.setFrame(1);
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

  public setSelected(selected: boolean) {
    this.setTint(selected ? this.focusColor : this.color);
  }

  setPlayerHasAccess(hasAccess: boolean) {
    this.discovered = true;
    this.playerHasAccess = hasAccess;
    this.setAlpha(this.playerHasAccess ? 1 : 0.3);
    this.setFrame(this.playerHasAccess ? 0 : 1);
  }

  setUnlockRequirements(requirements: [ResourceType, number]) {
    this.unlockRequirements = requirements;
  }
}
