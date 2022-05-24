import DependentScene from "./DependentScene";
import { StellarBodyPayload } from "../components/planet/StellarBody";
import {
  ResourceType,
  MineableResourceType,
} from "../assets/data/stellar-bodies/Types";

export type StateResourceObject = {
  current: number;
  max: number;
};

//TODO: Make this a function of the ship's upgrades
const RESOURCE_GATHER_SIZE = 0.25;
export class StateScene extends DependentScene {
  private purple: StateResourceObject = { max: 20, current: 0 };
  private orange: StateResourceObject = { max: 20, current: 0 };
  private green: StateResourceObject = { max: 20, current: 0 };
  private red: StateResourceObject = { max: 20, current: 0 };
  private blue: StateResourceObject = { max: 20, current: 0 };
  private yellow: StateResourceObject = { max: 20, current: 0 };

  private energy: StateResourceObject = { max: 20, current: 0 };

  private systemLevel: number = 1;
  public resourceGatherSize: number = RESOURCE_GATHER_SIZE;
  constructor() {
    super({
      key: "StateScene",
    });
  }

  preload(): void {}

  create(): void {
    this.game.events.on(
      "resource-gathered",
      ({
        resourceType,
        totalMined,
      }: {
        resourceType: MineableResourceType;
        totalMined: number;
      }) => {
        this.incrementResource(resourceType, totalMined);
      }
    );

    this.game.events.on("set-resource", (resource: [ResourceType, number]) => {
      const [resourceType, value] = resource;
      this.setResource(resourceType, value);
    });

    this.game.events.on(
      "resource-spent",
      (resource: [ResourceType, number]) => {
        const [resourceType, value] = resource;
        this.decrementResource(resourceType, value);
      }
    );

    ["purple", "orange", "green", "red", "blue", "yellow", "energy"].forEach(
      (resource: ResourceType) => {
        this.setResourceMaxValue(resource, this[resource].max);
      }
    );

    setInterval(() => {
      this.incrementResource("energy", 0.1);
    }, 1000);
  }

  public incrementResource(key: ResourceType, valueToAdd: number) {
    this.setResource(key, valueToAdd + this[key].current);
  }

  public decrementResource(key: ResourceType, valueToSubtract: number) {
    this.setResource(key, this[key].current - valueToSubtract);
  }

  public incrementSystemLevel() {
    this.systemLevel++;
  }

  public decrementSystemLevel() {
    this.systemLevel = Math.max(0, this.systemLevel - 1);
  }

  public getSystemLevel() {
    return this.systemLevel;
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
