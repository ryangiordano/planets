import DependentScene from "../DependentScene";
import {
  buildResourceManagement,
  ResourceStateManager,
} from "./ResourceManagement";

//TODO: Make this a function of the ship's upgrades
const RESOURCE_GATHER_SIZE = 0.25;

export class StateScene extends DependentScene {
  private systemLevel: number = 1;
  public resourceGatherSize: number = RESOURCE_GATHER_SIZE;
  public resourceManager: ResourceStateManager;
  constructor() {
    super({
      key: "StateScene",
    });
  }

  preload(): void {}

  create(): void {
    this.resourceManager = buildResourceManagement(this);
  }

  public getAllResources() {}

  public incrementSystemLevel() {
    this.systemLevel++;
  }

  public decrementSystemLevel() {
    this.systemLevel = Math.max(0, this.systemLevel - 1);
  }

  public getSystemLevel() {
    return this.systemLevel;
  }

  update(time: number, delta: number): void {}
}
