import StellarBody, {
  getStellarBodyColorFromResourceType,
} from "../../../components/planet/StellarBody";
import HexTile from "../../../components/system-select/HexTile";
import { ResourceType } from "../stellar-bodies/Types";
import { EVEN_ROW_HEX_NEIGHBORS, getHexNeighbors } from "./Constants";
import { HexMap, prepareHex } from "./HexMapController";
import { createRandomSystem } from "./RandomGeneration";
import {
  getStarSystemDataById,
  setStarSystemData,
} from "./StarSystemRepository";
import { getEnemyById } from "../enemy/EnemyRepository";
import {
  addStarSystemEnemy,
  removeStarSystemEnemy,
} from "../enemy/EnemyController";

import {
  getStarSystem,
  getStarSystemByCoordinate,
  StarSystemObject,
} from "./StarSystemRepository";

function getSystemCenter(scene: Phaser.Scene): [number, number] {
  return [scene.game.canvas.width / 2, scene.game.canvas.height / 2];
}

function createOrbitRing(
  scene: Phaser.Scene,
  centerX: number,
  centerY: number,
  orbitSize: number,
  color
) {
  scene.add.circle(centerX, centerY, orbitSize, color, 0.03);
}

export function buildStarSystemFromId(
  scene: Phaser.Scene,
  starSystemId?: number,
  starStstem?: StarSystemObject
): StellarBody {
  const ss = starStstem ?? getStarSystem(starSystemId);

  const [centerX, centerY] = getSystemCenter(scene);

  const sun = new StellarBody({
    x: centerX,
    y: centerY,
    scene,
    size: ss.sun.size,
    id: ss.sun.id,
    color: ss.sun.color,
    resourceType: ss.sun.resourceType,
    distanceFromCenter:
      ss.system.reduce((acc, o) => {
        acc = Math.max(acc, o.distanceFromCenter);
        return acc;
      }, 0) * 2,
    maxYield: ss.sun.maxYield,
  });

  createOrbitRing(
    scene,
    centerX,
    centerY,
    sun.getOrbitSize(),
    getStellarBodyColorFromResourceType(ss.sun.resourceType, ss.sun.maxYield)
  );

  ss.system.forEach(
    ({
      size,
      orbit,
      color,
      distanceFromCenter,
      rotationSpeed,
      id,
      resourceType,
      maxYield,
    }) => {
      const sb = new StellarBody({
        scene,
        size,
        distanceFromCenter,
        rotationSpeed,
        color,
        id,
        resourceType,
        maxYield,
      });
      createOrbitRing(
        scene,
        centerX,
        centerY,
        sb.getOrbitSize(),
        getStellarBodyColorFromResourceType(resourceType, maxYield)
      );
      if (orbit.length) {
        orbit.forEach(
          ({
            size,
            color,
            distanceFromCenter,
            rotationSpeed,
            id,
            resourceType,
          }) =>
            sb.addToOrbit(
              new StellarBody({
                scene,
                size,
                color,
                distanceFromCenter,
                rotationSpeed,
                id,
                resourceType,
                maxYield,
              })
            )
        );
      }
      sun.addToOrbit(sb);
    }
  );

  return sun;
}

export function renderSystem(
  system: StarSystemObject,
  hexMap: { [key: string]: HexTile },
  playerHasAccess = true,
  systemLevel: number
) {
  const [x, y] = system.coordinates;
  const hexTile = hexMap[`${x},${y}`];
  if (!hexTile) {
    return;
  }
  prepareHex(system, hexTile, playerHasAccess);

  renderSystemNeighbors(system, hexMap, systemLevel);
}

export function renderSystemNeighbors(
  system: StarSystemObject,
  hexMap: HexMap,
  systemLevel: number
) {
  const [originX, originY] = system.coordinates;

  getHexNeighbors(originY).forEach(([x, y]) => {
    const hexTile = hexMap[`${originX + x},${originY + y}`];
    if (!hexTile || hexTile?.hasStarSystem()) {
      return;
    }
    const coordinates: [number, number] = [originX + x, originY + y];
    hexTile.setUnexplored();
    let starSystem = getStarSystemByCoordinate([originX + x, originY + y]);
    if (!starSystem) {
      starSystem = createRandomSystem(coordinates, systemLevel);
    }

    prepareHex(starSystem, hexTile, false);
  });
}

export function assignEnemyToSystem(enemyId: number, starSystemId: number) {
  addStarSystemEnemy(starSystemId, enemyId);
}

export function getStarSystemById(starSystemId: number) {
  return getStarSystem(starSystemId);
}

export function getPercentMined(starSystemObject: StarSystemObject): string {
  const yieldObject = starSystemObject.system.reduce<{
    max: number;
    current: number;
  }>(
    (acc, body) => {
      const { remainingYield, maxYield } = body;
      acc.max += maxYield;
      acc.current += remainingYield;
      return acc;
    },
    { max: 0, current: 0 }
  );

  return ((1 - yieldObject.current / yieldObject.max) * 100).toFixed(0);
}
