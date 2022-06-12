import {
  MineableResourceType,
  ResourceType,
} from "../../assets/data/stellar-bodies/Types";

export type ResourceStateObject = {
  current: number;
  max: number;
};

export type ResourceStateManager = {
  getAllResources: () => [ResourceType, number][];
  getResource: (resourceType: ResourceType) => ResourceStateObject;
  setResource: (key: ResourceType, value: number) => void;
  setResourceMaxValue: (resource: ResourceType, newMaxValue: number) => void;
  incrementResource: (key: ResourceType, valueToAdd: number) => void;
  decrementResource: (key: ResourceType, valueToSubtract: number) => void;
};

export function buildResourceManagement(
  scene: Phaser.Scene
): ResourceStateManager {
  const resourceState = new Map<ResourceType, ResourceStateObject>([
    ["purple", { max: 10, current: 0 }],
    ["orange", { max: 10, current: 0 }],
    ["green", { max: 10, current: 0 }],
    ["red", { max: 10, current: 0 }],
    ["blue", { max: 10, current: 0 }],
    ["yellow", { max: 10, current: 0 }],
  ]);

  scene.game.events.on(
    "resource-gathered",
    ({
      resourceType,
      totalMined,
    }: {
      resourceType: MineableResourceType;
      totalMined: number;
    }) => {
      incrementResource(resourceType, totalMined);
    }
  );

  /** Set global events to communicate with other scenes, allowing them to manipulate state */
  scene.game.events.on("set-resource", (resource: [ResourceType, number]) => {
    const [resourceType, value] = resource;
    setResource(resourceType, value);
  });

  scene.game.events.on("resource-spent", (resource: [ResourceType, number]) => {
    const [resourceType, value] = resource;
    decrementResource(resourceType, value);
  });

  ["purple", "orange", "green", "red", "blue", "yellow"].forEach(
    (resource: ResourceType) => {
      setResourceMaxValue(resource, resourceState.get(resource).max);
    }
  );

  function incrementResource(key: ResourceType, valueToAdd: number) {
    setResource(key, valueToAdd + resourceState.get(key).current);
  }

  function decrementResource(key: ResourceType, valueToSubtract: number) {
    setResource(key, resourceState.get(key).current - valueToSubtract);
  }

  function setResource(key: ResourceType, value: number) {
    resourceState.get(key).current = Math.max(
      0,
      Math.min(value, resourceState.get(key).max)
    );
    scene.game.events.emit("resource-value-change", {
      key,
      resource: resourceState.get(key),
    });
  }

  function setResourceMaxValue(resource: ResourceType, newMaxValue: number) {
    if (newMaxValue <= 0) {
      throw new Error(`New maxValue for Resource cannot be ${newMaxValue}`);
    }
    scene.game.events.emit("resource-max-value-change", {
      key: resource,
      newMaxValue,
    });
  }

  function getResource(resourceType: ResourceType) {
    return resourceState.get(resourceType);
  }

  function getAllResources(): [ResourceType, number][] {
    return ["purple", "orange", "green", "red", "blue", "yellow"].map(
      (resourceType: ResourceType) => {
        return [resourceType, resourceState.get(resourceType).current];
      }
    );
  }

  return {
    getAllResources,
    getResource,
    setResource,
    setResourceMaxValue,
    incrementResource,
    decrementResource,
  };
}
