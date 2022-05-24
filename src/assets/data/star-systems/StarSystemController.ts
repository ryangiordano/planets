import StellarBody, {
  getStellarBodyColorFromResourceType,
} from "../../../components/planet/StellarBody";
import HexTile from "../../../components/system-select/HexTile";
import { ResourceType } from "../stellar-bodies/Types";
import { EVEN_ROW_HEX_NEIGHBORS, getHexNeighbors } from "./Constants";
import { HexMap } from "./HexMapController";
import { createRandomSystem } from "./RandomGeneration";

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
  });

  createOrbitRing(
    scene,
    centerX,
    centerY,
    sun.getOrbitSize(),
    getStellarBodyColorFromResourceType(ss.sun.resourceType)
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
    }) => {
      const sb = new StellarBody({
        scene,
        size,
        distanceFromCenter,
        rotationSpeed,
        color,
        id,
        resourceType,
      });
      createOrbitRing(
        scene,
        centerX,
        centerY,
        sb.getOrbitSize(),
        getStellarBodyColorFromResourceType(resourceType)
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

function prepareHex(
  starSystem: StarSystemObject,
  hexTile: HexTile,
  playerHasAccess: boolean
): HexTile {
  hexTile.addSystem(starSystem);
  hexTile.setPlayerHasAccess(playerHasAccess);
  //TODO: Polish up how we set unlock requirements
  hexTile.setUnlockRequirements([
    starSystem.sun.resourceType,
    starSystem.sun.maxYield,
  ]);
  return hexTile;
}
