import { getRandomInt } from "../../utility/Utility";
import { rotatePoint } from "./shared";

export type StellarBodySize = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * A planetary body or star that has other StellarBodies to rotate around it.
 * Other bodies must be smaller than the parent StellarBody
 */
export default class StellarBody extends Phaser.Physics.Arcade.Sprite {
  public distanceFromCenter: number;
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
  }) {
    super(scene, x, y, "planet_large", size);
    // if (orbit.length) {
    //TODO:Implement
    //   orbit.forEach((o) => this.addToOrbit(o));
    // }

    this.scene.add.existing(this);
    this.setTint(color);
  }

  update(time: number, delta: number) {}
}
