import {
  ResourceType,
  CompositionType,
  StellarBodySize,
  MineableResourceType,
} from "../../assets/data/stellar-bodies/Types";
import { getStellarBodyColorFromResourceType } from "./StellarBody";
import { StellarBodyPayload } from "./StellarBody";

/**
 * A planetary body or star that has other StellarBodies to rotate around it.
 * Other bodies must be smaller than the parent StellarBody
 */
export default class LargeStellarBody extends Phaser.GameObjects.Sprite {
  private resourceType: MineableResourceType;
  private remainingYield: number;
  private maxYield: number;

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
    onHarvest,
    onHarvestFailure,
    resourceType,
    maxYield,
    remainingYield,
  }: {
    scene: Phaser.Scene;
    x?: number;
    y?: number;
    size: StellarBodySize;
    color?: number;
    resourceType?: MineableResourceType;
    maxYield: number;
    remainingYield: number;
    onHarvest: (payload: StellarBodyPayload) => void;
    onHarvestFailure: () => void;
  }) {
    super(scene, x, y, "planet_large_single", 0);
    this.maxYield = maxYield;
    this.remainingYield = remainingYield;

    this.resourceType = resourceType;
    this.scene.add.existing(this);

    let baseSize = 50;
    let modifier = size + 1;

    this.displayHeight = baseSize * modifier;
    this.displayWidth = baseSize * modifier;
    this.setTint(color);
    if (resourceType) {
      this.setTint(
        getStellarBodyColorFromResourceType(resourceType, this.maxYield)
      );
    }

    if (onHarvest && resourceType) {
      this.setInteractive();

      this.on("pointerdown", () => {
        if (this.noYieldLeft()) {
          return onHarvestFailure();
        }

        onHarvest({
          resourceType,
          artifact: null,
          remainingYield: this.remainingYield,
        });
      });
    }
  }

  public decrementRemainingYield(value: number) {
    this.remainingYield = Math.max(0, this.remainingYield - value);
  }

  private noYieldLeft() {
    return this.remainingYield <= 0;
  }

  update(time: number, delta: number) {}
}
