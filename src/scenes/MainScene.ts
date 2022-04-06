import StellarBody from "../components/planet/StellarBody";
import DependentScene from "./DependentScene";
import { getStarSystem } from "../assets/data/repositories/StarSystemRepository";
import { buildStarSystem } from "../assets/data/controllers/StarSystemController";

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
    this.sun = buildStarSystem(this, 0);
  }

  update(time: number, delta: number): void {
    this.sun.update(time, delta);
  }
}
