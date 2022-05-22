//TODO: Not in use. Replace logic in StateScene with this 
// so we can unit test it.

import { ResourceType } from "../../assets/data/stellar-bodies/Types";

export type StateResourceObject = {
  current: number;
  max: number;
};

export type PlayerStateMap = Map<ResourceType, StateResourceObject>;

const defaultState: PlayerStateMap = new Map([
  ["purple", { max: 3, current: 0 }],
  ["orange", { max: 3, current: 0 }],
  ["green", { max: 3, current: 0 }],
  ["red", { max: 3, current: 0 }],
  ["blue", { max: 3, current: 0 }],
  ["yellow", { max: 3, current: 0 }],
  ["energy", { max: 3, current: 0 }],
]);

export function createPlayerState(
  initialState = defaultState,
  onResourceChange: ({ key: ResourceType, resource: number }) => void,
  onResourceMaxValueChange: ({ key: ResourceType, newMaxValue: number }) => void
) {
  const state = new Map(initialState);

  function getState() {
    return state;
  }

  function incrementResource(key: ResourceType, valueToAdd: number) {
    setResource(key, valueToAdd + state.get(key).current);
  }

  function decrementResource(key: ResourceType, valueToSubtract: number) {
    setResource(key, state.get(key).current - valueToSubtract);
  }

  function setResource(key: ResourceType, value: number) {
    assertValue(key);
    state.get(key).current = Math.max(0, Math.min(value, state.get(key).max));
    // this.game.events.emit("resource-value-change", {
    //   key,
    //   resource: this[key],
    // });
    onResourceChange({
      key,
      resource: state.get(key),
    });
  }

  function setResourceMaxValue(resource: ResourceType, newMaxValue: number) {
    if (newMaxValue <= 0) {
      throw new Error(`New maxValue for Resource cannot be ${newMaxValue}`);
    }
    // this.game.events.emit("resource-max-value-change", {
    //   key: resource,
    //   newMaxValue,
    // });
    onResourceMaxValueChange({ key: resource, newMaxValue });
  }

  function getValue(key: string): number {
    this.assertValue(key);
    return this[key].current;
  }

  function getResource(resourceType: ResourceType) {
    return this[resourceType];
  }

  function assertValue(key: string) {
    if (this[key] === undefined) {
      throw new Error(`state property ${key} does not exist`);
    }
  }

  function getAllResources(): [ResourceType, number][] {
    return ["purple", "orange", "green", "red", "blue", "yellow", "energy"].map(
      (resourceType: ResourceType) => {
        return [resourceType, this.getValue(resourceType)];
      }
    );
  }
}
