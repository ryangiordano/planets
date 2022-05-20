import HexTile from "../../../components/system-select/HexTile";
import { ResourceType } from "../stellar-bodies/Types";
import { renderSystemNeighbors } from "./StarSystemController";
import {
  StarSystemObject,
  getStarSystemByCoordinate,
} from "./StarSystemRepository";

export type HexMap = { [key: string]: HexTile };

export function buildHexMap(
  scene: Phaser.Scene,
  size: number
): { [key: string]: HexTile } {
  const hexMap = {};

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      hexMap[`${col},${row}`] = new HexTile({ scene, x: col, y: row });
    }
  }

  return hexMap;
}

export function playerCanAffordResourceRequirement(
  unlockRequirements: [ResourceType, number][],
  providedCurrency: [ResourceType, number][]
) {
  for (let requirement of unlockRequirements) {
    const f = providedCurrency.find((p) => p[0] === requirement[0]);
    if (f) {
      requirement[1] = Math.max(0, requirement[1] - f[1]);
    }
  }

  return (
    unlockRequirements.reduce<number>((acc, t) => {
      acc += t[1];
      return acc;
    }, 0) === 0
  );
}

export function unlockHexTile(
  hex: HexTile,
  providedCurrency: [ResourceType, number][],
  hexMap: HexMap,
  onSuccessfulUnlock: (remainingBalance: [ResourceType, number][]) => void
) {
  if (
    playerCanAffordResourceRequirement(hex.unlockRequirements, providedCurrency)
  ) {
    hex.setPlayerHasAccess(true);
    renderSystemNeighbors(hex.starSystem.starSystemObject, hexMap);
    const remainingCurrency = calculateDifferenceBetweenResources(
      hex.unlockRequirements,
      providedCurrency
    );
    onSuccessfulUnlock(remainingCurrency);
  }
}

/** Given the price and provided currency, return the remaining currency after
 * subtracting the price.
 *
 * If the provided currency is not sufficient, return the provided currency.
 */
function calculateDifferenceBetweenResources(
  unlockRequirements: [ResourceType, number][],
  providedCurrency: [ResourceType, number][]
): [ResourceType, number][] {
  if (playerCanAffordResourceRequirement(unlockRequirements, providedCurrency))
    for (let currency of providedCurrency) {
      const requirement = unlockRequirements.find((p) => p[0] === currency[0]);
      if (requirement) {
        currency[1] = Math.max(0, currency[1] - requirement[1]);
      }
    }

  return providedCurrency;
}
