import { rotatePoint } from "./shared";

export type StellarBodySize = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * A planetary body or star that has other StellarBodies to rotate around it.
 * Other bodies must be smaller than the parent StellarBody
 */
export default class StellarBody extends Phaser.GameObjects.Sprite {
  private orbit: StellarBody[] = [];
  private distanceFromCenter: number;
  private rotationSpeed: number;
  private parentBody?: StellarBody;
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
    parentBody,
  }: {
    scene: Phaser.Scene;
    x?: number;
    y?: number;
    orbit?: StellarBody[];
    distanceFromCenter?: number;
    rotationSpeed?: number;
    size: StellarBodySize;
    parentBody?: StellarBody;
  }) {
    super(scene, x, y, "planet", size);
    this.orbit = orbit;
    this.distanceFromCenter = distanceFromCenter;
    this.rotationSpeed = rotationSpeed;
    this.parentBody = parentBody;

    this.scene.add.existing(this);
  }

  private isRotatingWithSatelites() {
    return Boolean(this.rotationSpeed && this.orbit.length);
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

  private _addToOrbit(stellarBody: StellarBody) {
    stellarBody.setX(this.getX() + stellarBody.distanceFromCenter);
    stellarBody.setY(this.getY() + stellarBody.distanceFromCenter);
    this.orbit.push(stellarBody);
    if (this.isRotatingWithSatelites()) {
      this.orbitContainer.add(stellarBody);
    }
  }

  update(time: number, delta: number) {
    // Tell StellarBodies in orbit to update
    this.orbit.forEach((sb) => sb.update(time, delta));

    // Update your own position if you're rotating around a StellarBody
    if (this.rotationSpeed) {
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
