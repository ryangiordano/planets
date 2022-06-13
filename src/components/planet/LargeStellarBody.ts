import {
  ResourceType,
  CompositionType,
  StellarBodySize,
  MineableResourceType,
} from "../../assets/data/stellar-bodies/Types";
import { getStellarBodyColorFromResourceType } from "./StellarBody";
import { getCanvasPosition } from "../../utility/Utility";

/**
 * A planetary body or star that has other StellarBodies to rotate around it.
 * Other bodies must be smaller than the parent StellarBody
 */
export default class LargeStellarBody extends Phaser.Physics.Arcade.Sprite {
  public resourceType: MineableResourceType;
  public remainingYield: number;
  private maxYield: number;
  public stellarBodyId: number;
  public color: number;
  private stellarBodySize: StellarBodySize;
  static spriteDependencies: SpriteDependency[] = [
    {
      frameHeight: 512,
      frameWidth: 512,
      key: "planet_large_single",
      url: "/src/assets/sprites/planet_large_single.png",
    },
  ];
  constructor({
    scene,
    x = 0,
    y = 0,
    size,
    color = 0xffffff,
    resourceType,
    maxYield,
    remainingYield,
    stellarBodyId,
  }: {
    scene: Phaser.Scene;
    x?: number;
    y?: number;
    size: StellarBodySize;
    color?: number;
    resourceType?: MineableResourceType;
    maxYield: number;
    remainingYield: number;
    stellarBodyId: number;
  }) {
    super(scene, x, y, "planet_large_single", 0);
    this.maxYield = maxYield;
    this.remainingYield = remainingYield;
    this.stellarBodyId = stellarBodyId;

    this.resourceType = resourceType;
    scene.physics.add.existing(this);
    scene.add.existing(this);
    const baseSize = 50;
    const modifier = size + 1;

    this.displayHeight = baseSize * modifier;
    this.displayWidth = baseSize * modifier;
    this.stellarBodySize = size;
    this.color = color;
    if (resourceType) {
      this.color = getStellarBodyColorFromResourceType(
        resourceType,
        this.maxYield
      );
    }
    this.setTint(this.color);
  }

  public decrementRemainingYield(value: number) {
    this.remainingYield = Math.max(0, this.remainingYield - value);
  }

  public noYieldLeft() {
    return this.remainingYield <= 0;
  }

  public bodyExhausted() {
    const sprite = this.scene.add.sprite(this.x, this.y, "planet_large_single");
    sprite.displayHeight = this.displayHeight;
    sprite.displayWidth = this.displayWidth;
    sprite.setTint(this.color);
    this.parentContainer.add(sprite);
    this.scene.add.tween({
      targets: sprite,
      ease: "Quint.easeOut",
      scale: {
        from: 0,
        to: Math.max(2, this.stellarBodySize / 1.5),
      },
      alpha: {
        from: 0.7,
        to: 0,
      },
      duration: 1000,
      onComplete: () => {
        sprite.destroy();
      },
    });
  }

  update(time: number, delta: number) {}
}
