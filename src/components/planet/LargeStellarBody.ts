import {
  ResourceType,
  CompositionType,
  StellarBodySize,
} from "../../assets/data/stellar-bodies/Types";
import { getStellarBodyColorFromComposition } from "./StellarBody";
import { StellarBodyPayload } from "./StellarBody";

/** Harvest content given an array of tuples of content types and chance to mine */
function handleHarvest(
  contentArray: [ResourceType, number][],
  callback: (payload: StellarBodyPayload) => void
) {
  contentArray.sort(([_, a], [__, b]) => a - b);
  const maxRoll = contentArray.reduce<number>(
    (acc, [_, value]) => (acc += value),
    0
  );

  const roll = Math.random() * maxRoll;

  let rollingSum = 0;

  const content = contentArray.find(([_, value], index, array) => {
    rollingSum += value;
    const hasNext = !!array[index + 1];
    if (hasNext) {
      return roll <= rollingSum;
    }
    return true;
  });

  callback({
    content,
    artifact: null,
  });
}

/**
 * A planetary body or star that has other StellarBodies to rotate around it.
 * Other bodies must be smaller than the parent StellarBody
 */
export default class StellarBody extends Phaser.Physics.Arcade.Sprite {
  public distanceFromCenter: number;
  private composition: CompositionType;
  static spriteDependencies: SpriteDependency[] = [
    {
      frameHeight: 512,
      frameWidth: 512,
      key: "planet_large",
      url: "/src/assets/sprites/planet_large.png",
    },
  ];
  constructor({
    scene,
    x = 0,
    y = 0,
    size,
    orbit = [],
    rotationSpeed,
    color = 0xffffff,
    id,
    onHarvest,
    composition,
  }: {
    scene: Phaser.Scene;
    x?: number;
    y?: number;
    orbit?: StellarBody[];
    distanceFromCenter?: number;
    rotationSpeed?: number;
    size: StellarBodySize;
    color?: number;
    id: number;
    composition?: CompositionType;
    onHarvest: (payload: StellarBodyPayload) => void;
  }) {
    super(scene, x, y, "planet_large", size);
    // if (orbit.length) {
    //TODO:Implement
    //   orbit.forEach((o) => this.addToOrbit(o));
    // }

    this.composition = composition;

    this.scene.add.existing(this);

    this.setTint(color);
    if (composition) {
      this.setTint(getStellarBodyColorFromComposition(composition));
    }

    if (onHarvest && composition) {
      this.setInteractive();
      this.on("pointerdown", () => {
        const contentArray = [
          ...this.composition.gas,
          ...this.composition.mineral,
        ];

        handleHarvest(contentArray, onHarvest);
      });
    }
  }

  generateHarvestFromComposition() {}

  update(time: number, delta: number) {}
}
