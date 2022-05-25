import HexTile from "../../../components/system-select/HexTile";
import { ResourceType } from "../stellar-bodies/Types";
import { StarSystemObject } from "./StarSystemRepository";

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
  unlockRequirements: [ResourceType, number],
  providedCurrency: [ResourceType, number][]
) {
  const currencyType = providedCurrency.find(
    (p) => p[0] === unlockRequirements[0]
  );

  return unlockRequirements?.[1] - currencyType?.[1] <= 0;
}

export function unlockHexTile(
  hex: HexTile,
  providedCurrency: [ResourceType, number][],
  onSuccessfulUnlock: (remainingBalance: [ResourceType, number][]) => void
) {
  if (
    playerCanAffordResourceRequirement(hex.unlockRequirements, providedCurrency)
  ) {
    hex.setPlayerHasAccess(true);
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
export function calculateDifferenceBetweenResources(
  unlockRequirement: [ResourceType, number],
  providedCurrency: [ResourceType, number][]
): [ResourceType, number][] {
  const p = providedCurrency.map((f) => [...f] as [ResourceType, number]);
  if (playerCanAffordResourceRequirement(unlockRequirement, providedCurrency))
    for (let currency of p) {
      if (unlockRequirement[0] === currency[0]) {
        currency[1] = Math.max(0, currency[1] - unlockRequirement[1]);
      }
    }
  return p;
}

export function prepareHex(
  starSystem: StarSystemObject,
  hexTile: HexTile,
  playerHasAccess: boolean
): HexTile {
  hexTile.addSystem(starSystem);
  hexTile.setPlayerHasAccess(playerHasAccess);
  //TODO: Polish up how we set unlock requirements
  hexTile.setUnlockRequirements([
    starSystem.sun.resourceType,
    starSystem.sun.maxYield / 2,
  ]);
  return hexTile;
}
