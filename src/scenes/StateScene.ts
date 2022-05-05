import DependentScene from "./DependentScene";
import {
  ResourceType,
  StellarBodyPayload,
} from "../components/planet/StellarBody";

type State = {};

export type StateResourceObject = {
  current: number;
  max: number;
};
export class StateScene extends DependentScene {
  private purple: StateResourceObject = { max: 400, current: 0 };
  private orange: StateResourceObject = { max: 400, current: 0 };
  private green: StateResourceObject = { max: 400, current: 0 };
  private red: StateResourceObject = { max: 400, current: 0 };
  private blue: StateResourceObject = { max: 400, current: 0 };
  private yellow: StateResourceObject = { max: 400, current: 0 };

  private energy: StateResourceObject = { max: 400, current: 0 };
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
        const [resourceType, value] = content;
        this.incrementResource(resourceType, value);
      }
    );

    ["purple", "orange", "green", "red", "blue", "yellow"].forEach(
      (resource: ResourceType) => {
        this.setResourceMaxValue(resource, this[resource].max);
      }
    );
  }

  public incrementResource(key: ResourceType, value: number) {
    this.assertValue(key);
    this.setResource(key, value + this[key].current);
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
      resource,
      newMaxValue,
    });
  }

  public getValue(key: string) {
    this.assertValue(key);
    return this[key];
  }

  public getResource(resourceType: ResourceType) {
    return this[resourceType];
  }

  private assertValue(key: string) {
    if (this[key] === undefined) {
      throw new Error(`state property ${key} does not exist`);
    }
  }

  update(time: number, delta: number): void {}
}
