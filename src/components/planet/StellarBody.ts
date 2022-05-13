import { getRandomInt } from "../../utility/Utility";
import { rotatePoint } from "./shared";

export type StellarBodySize = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export const MAX_STELLAR_BODY_SIZE = 7;
export type GasType = "blue" | "yellow" | "red";

export type MineralType = "green" | "orange" | "purple";

export type ResourceType = GasType | MineralType | "energy";

export type CompositionType = {
  /** Array of tuples of GasType and value*/
  gas: [GasType, number][];
  /** Array of tuples of MineralType and value*/
  mineral: [MineralType, number][];
};

const COLOR_MAP = {
  red: [0xdb9b97, 0xde8883, 0xde665f, 0xde473e, 0x9c3028],
  yellow: [0xd9d9a5, 0xd6d986, 0xcfd453, 0xd1d930, 0xb4bd08],
  blue: [0xa5c4d9, 0x86bbd9, 0x536dd4, 0x233975, 0x0856bd],
  green: [0xa6d9a5, 0x8ad986, 0x53d462, 0x4cd930, 0x06990b],
  purple: [0xc9a5d9, 0xc786d9, 0xa753d4, 0xa930d9, 0x610699],
  orange: [0xd9c4a5, 0xd9b786, 0xd4a353, 0xd99930, 0x996806],
};

export function getStellarBodyColorFromComposition(
  composition: CompositionType
) {
  const dominantType = [...composition.gas, ...composition.mineral].reduce<
    [ResourceType, number]
  >((acc, k) => {
    if (!acc || k[1] > acc?.[1]) {
      acc = k;
    }
    return acc;
  }, undefined);

  const colorArr = COLOR_MAP[dominantType[0]];
  const index = Math.floor(dominantType[1] * (colorArr.length - 1));
  const randomColor = colorArr[index];

  return randomColor;
}

export type StellarBodyPayload = { content: [ResourceType, number] } & {
  /** TODO: the ID of an artifact mined from the planet */
  artifact: number | null;
};
/**
 * A planetary body or star that has other StellarBodies to rotate around it.
 * Other bodies must be smaller than the parent StellarBody
 */
export default class StellarBody extends Phaser.Physics.Arcade.Sprite {
  public orbit: StellarBody[] = [];
  public distanceFromCenter: number;
  private rotationSpeed: number;
  private parentBody?: StellarBody;
  public id: number;
  private composition: CompositionType;

  static spriteDependencies: SpriteDependency[] = [
    {
      frameHeight: 128,
      frameWidth: 128,
      key: "planet",
      url: "/src/assets/sprites/planet.png",
    },
  ];
  // Used for when a rotating planet has bodies rotating around it
  private orbitContainer: Phaser.GameObjects.Container;
  constructor({
    scene,
    x = 0,
    y = 0,
    size,
    orbit = [],
    distanceFromCenter,
    rotationSpeed,
    color = 0xffffff,
    id,
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
  }) {
    super(scene, x, y, "planet", size);
    if (orbit.length) {
      orbit.forEach((o) => this.addToOrbit(o));
    }
    this.distanceFromCenter = distanceFromCenter;
    this.rotationSpeed = rotationSpeed;

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setTint(color);
    if (composition) {
      this.setTint(getStellarBodyColorFromComposition(composition));
    }
    this.id = id;
    this.composition = composition;
  }

  private isRotatingWithSatelites() {
    return Boolean(
      this.rotationSpeed && this.orbit.length && this.orbitContainer
    );
  }

  getX() {
    return this.isRotatingWithSatelites() ? this.orbitContainer.x : this.x;
  }

  getY() {
    return this.isRotatingWithSatelites() ? this.orbitContainer.y : this.y;
  }

  setX(value: number) {
    if (this.isRotatingWithSatelites()) {
      this.orbitContainer.x = value;
    } else {
      this.x = value;
    }
    return this;
  }

  setY(value: number) {
    if (this.isRotatingWithSatelites()) {
      this.orbitContainer.y = value;
    } else {
      this.y = value;
    }
    return this;
  }

  getOrbitSize() {
    return this.distanceFromCenter * 1.4;
  }

  private buildOrbitContainer() {
    this.orbitContainer = new Phaser.GameObjects.Container(
      this.scene,
      this.x,
      this.y
    );
    this.scene.add.existing(this.orbitContainer);
    this.orbitContainer.add(this);
    this.x = 0;
    this.y = 0;
  }

  addToOrbit(stellarBody: StellarBody | StellarBody[]) {
    if (this.rotationSpeed && !this.orbitContainer) {
      this.buildOrbitContainer();
    }
    if (Array.isArray(stellarBody)) {
      stellarBody.forEach((sb) => {
        this._addToOrbit(sb);
      });
    } else {
      this._addToOrbit(stellarBody);
    }
    return this;
  }

  /** Add the bodies to the orbit at a random quadrant */
  private _addToOrbit(stellarBody: StellarBody) {
    stellarBody.setX(
      this.getX() +
        stellarBody.distanceFromCenter * (getRandomInt(1, 3) % 2 === 0 ? 1 : -1)
    );
    stellarBody.setY(
      this.getY() +
        stellarBody.distanceFromCenter * (getRandomInt(1, 3) % 2 === 0 ? 1 : -1)
    );
    this.orbit.push(stellarBody);
    stellarBody.parentBody = this;
    if (this.isRotatingWithSatelites()) {
      this.orbitContainer.add(stellarBody);
    }
  }

  public setFocused(focused: boolean) {
    //TODO: Add juice to this
    this.setAlpha(focused ? 0.5 : 1);
  }

  update(time: number, delta: number) {
    // Tell StellarBodies in orbit to update
    this.orbit.forEach((sb) => sb.update(time, delta));

    // Update your own position if you're rotating around a StellarBody
    if (this.rotationSpeed && this.parentBody) {
      const rotateBy = ((90 * delta) / 500000) * this.rotationSpeed;
      const currentPosition = {
        x: this.getX(),
        y: this.getY(),
      };

      const newPosition = rotatePoint(
        currentPosition,
        this.parentBody,
        rotateBy
      );
      this.setX(newPosition.x);
      this.setY(newPosition.y);
    }
  }
}
