import StellarBody from "../components/planet/StellarBody";
import DependentScene from "./DependentScene";

export class MainScene extends DependentScene {
  private sun: StellarBody;
  constructor() {
    super({
      key: "MainScene",
    });
  }

  static spriteDependencies: SpriteDependency[] = [
    ...StellarBody.spriteDependencies,
  ];
  static audioDependencies: AudioDependency[] = [];

  preload(): void {}

  create(): void {
    this.sun = new StellarBody({
      x: this.game.canvas.width / 2,
      y: this.game.canvas.height / 2,
      scene: this,
      size: 6,
    });

    const planet1 = new StellarBody({
      scene: this,
      distanceFromCenter: 150,
      rotationSpeed: 115,
      size: 3,
      parentBody: this.sun,
    });
    const moon = new StellarBody({
      scene: this,
      distanceFromCenter: 50,
      rotationSpeed: 415,
      size: 1,
      parentBody: planet1,
    });
    const planet2 = new StellarBody({
      scene: this,
      distanceFromCenter: 250,
      rotationSpeed: 55,
      size: 2,
      parentBody: this.sun,
    });
    const planet3 = new StellarBody({
      scene: this,
      distanceFromCenter: 350,
      rotationSpeed: 10,
      size: 4,
      parentBody: this.sun,
    });

    this.sun.addToOrbit([planet1, planet2, planet3]);
    planet1.addToOrbit(moon);
  }

  update(time: number, delta: number): void {
    this.sun.update(time, delta);
  }
}
