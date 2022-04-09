import StellarBody from "../components/planet/StellarBody";
import DependentScene from "./DependentScene";
import { getStarSystem } from "../assets/data/repositories/StarSystemRepository";
import { buildStarSystem } from "../assets/data/controllers/StarSystemController";
import Ship from "../components/player/Ship";

export class MainScene extends DependentScene {
  private sun: StellarBody;
  private ship: Ship;
  constructor() {
    super({
      key: "MainScene",
    });
  }

  static spriteDependencies: SpriteDependency[] = [
    ...StellarBody.spriteDependencies,
    ...Ship.spriteDependencies,
  ];
  static audioDependencies: AudioDependency[] = [];

  preload(): void {}

  create(): void {
    this.sun = buildStarSystem(this, 0);
    this.ship = new Ship({ scene: this, x: 500, y: 500 });
  }

  update(time: number, delta: number): void {
    this.sun.update(time, delta);
  }
}
