import { ResourceType } from "../planet/StellarBody";
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
  onResourceChange: () => void
) {
  const state = new Map(initialState);

  function getState() {
    return state;
  }

  function setResource(key: ResourceType, value: number): PlayerStateMap {
    const resource = state.get(key);
    resource.current = value;
    state.set(key, resource);

    onResourceChange(state)
    return state;
  }
}
