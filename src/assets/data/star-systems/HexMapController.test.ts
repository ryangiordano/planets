import {
  calculateDifferenceBetweenResources,
  playerCanAffordResourceRequirement,
} from "./HexMapController";
import { ResourceType } from "../stellar-bodies/Types";
import HexTile from "../../../components/system-select/HexTile";
import StellarBody from "../../../components/planet/StellarBody";

jest.mock("../../../components/planet/StellarBody", () => {
  return {
    default: {},
  };
});
jest.mock("../../../components/system-select/HexTile", () => {
  return {
    default: {},
  };
});

describe("playerCanAffordResourceRequirement", () => {
  test("Player can afford resources", () => {
    const resourcePrice = [["red", 1]] as [ResourceType, number][];
    const resourceToSpend = [["red", 2]] as [ResourceType, number][];

    const actual = playerCanAffordResourceRequirement(
      resourcePrice,
      resourceToSpend
    );

    expect(resourcePrice).toStrictEqual([["red", 1]]);
    expect(resourceToSpend).toStrictEqual([["red", 2]]);
    expect(actual).toBe(true);
  });

  test("Player can't afford resources", () => {
    const resourcePrice = [
      ["red", 2],
      ["blue", 1],
    ] as [ResourceType, number][];
    const resourceToSpend = [["red", 1]] as [ResourceType, number][];

    const actual = playerCanAffordResourceRequirement(
      resourcePrice,
      resourceToSpend
    );

    expect(resourcePrice).toStrictEqual([
      ["red", 2],
      ["blue", 1],
    ]);
    expect(resourceToSpend).toStrictEqual([["red", 1]]);
    expect(actual).toBe(false);
  });

  test("Try different resource types", () => {
    const resourcePrice = [["yellow", 1]] as [ResourceType, number][];
    const resourceToSpend = [["red", 2]] as [ResourceType, number][];

    const actual = playerCanAffordResourceRequirement(
      resourcePrice,
      resourceToSpend
    );

    expect(resourcePrice).toStrictEqual([["yellow", 1]]);
    expect(resourceToSpend).toStrictEqual([["red", 2]]);
    expect(actual).toBe(false);
  });
});
describe("Calculate difference between two resources", () => {
  test("Resources to spend is greater than resource price", () => {
    const resourcePrice = [
      ["red", 2],
      ["yellow", 5],
      ["blue", 2],
    ] as [ResourceType, number][];

    const resourcesToSpend = [
      ["red", 3],
      ["yellow", 10],
      ["blue", 5],
    ] as [ResourceType, number][];

    const actual = calculateDifferenceBetweenResources(
      resourcePrice,
      resourcesToSpend
    );

    expect(actual).toStrictEqual([
      ["red", 1],
      ["yellow", 5],
      ["blue", 3],
    ]);
  });

  test("Resource price is greater than resources to spend, return resources to spend", () => {
    const resourcePrice = [
      ["red", 10],
      ["yellow", 11],
      ["blue", 10],
    ] as [ResourceType, number][];

    const resourceToSpend = [
      ["red", 3],
      ["yellow", 10],
      ["blue", 5],
    ] as [ResourceType, number][];

    const actual = calculateDifferenceBetweenResources(
      resourcePrice,
      resourceToSpend
    );

    expect(actual).toStrictEqual([
      ["red", 3],
      ["yellow", 10],
      ["blue", 5],
    ]);
  });
});
