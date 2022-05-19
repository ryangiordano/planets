import DependentScene from "./DependentScene";
import { StellarBodyPayload } from "../components/planet/StellarBody";
import { ResourceType } from "../assets/data/stellar-bodies/Types";

type State = {};

export type StateResourceObject = {
  current: number;
  max: number;
};

//TODO: Make this a function of the ship's upgrades
const RESOURCE_GATHER_SIZE = 0.5;
export class StateScene extends DependentScene {
  private purple: StateResourceObject = { max: 3, current: 0 };
  private orange: StateResourceObject = { max: 3, current: 0 };
  private green: StateResourceObject = { max: 3, current: 0 };
  private red: StateResourceObject = { max: 3, current: 0 };
  private blue: StateResourceObject = { max: 3, current: 0 };
  private yellow: StateResourceObject = { max: 3, current: 0 };

  private energy: StateResourceObject = { max: 3, current: 0 };

  constructor() {
    super({
      key: "StateScene",
    });
  }

  preload(): void {}

  create(): void {
    this.game.events.on(
      "resource-gathered",
      ({ content }: StellarBodyPayload) => {
        const [resourceType] = content;
        this.incrementResource(resourceType, RESOURCE_GATHER_SIZE);
      }
    );

    this.game.events.on(
      "resource-spent",
      (resource: [ResourceType, number]) => {
        const [resourceType, value] = resource;
        this.decrementResource(resourceType, value);
      }
    );

    ["purple", "orange", "green", "red", "blue", "yellow"].forEach(
      (resource: ResourceType) => {
        this.setResourceMaxValue(resource, this[resource].max);
      }
    );
  }

  public incrementResource(key: ResourceType, value: number) {
    this.setResource(key, value + this[key].current);
  }

  public decrementResource(key: ResourceType, value: number) {
    this.setResource(key, this[key].current - value);
  }

  public setResource(key: ResourceType, value: number) {
    this.assertValue(key);
    this[key].current = Math.max(0, Math.min(value, this[key].max));
    this.game.events.emit("resource-value-change", {
      key,
      resource: this[key],
    });
  }

  public setResourceMaxValue(resource: ResourceType, newMaxValue: number) {
    if (newMaxValue <= 0) {
      throw new Error(`New maxValue for Resource cannot be ${newMaxValue}`);
    }
    this.game.events.emit("resource-max-value-change", {
      key: resource,
      newMaxValue,
    });
  }

  public getValue(key: string): number {
    this.assertValue(key);
    return this[key].current;
  }

  public getResource(resourceType: ResourceType) {
    return this[resourceType];
  }

  private assertValue(key: string) {
    if (this[key] === undefined) {
      throw new Error(`state property ${key} does not exist`);
    }
  }

  public getAllResources(): [ResourceType, number][] {
    return ["purple", "orange", "green", "red", "blue", "yellow", "energy"].map(
      (resourceType: ResourceType) => {
        return [resourceType, this.getValue(resourceType)];
      }
    );
  }

  update(time: number, delta: number): void {}
}
