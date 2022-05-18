import StellarBody, {
  getStellarBodyColorFromComposition,
} from "../../../components/planet/StellarBody";
import HexTile from "../../../components/system-select/HexTile";

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
    composition: ss.sun.composition,
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
    getStellarBodyColorFromComposition(ss.sun.composition)
  );

  ss.system.forEach(
    ({
      size,
      orbit,
      color,
      distanceFromCenter,
      rotationSpeed,
      id,
      composition,
    }) => {
      const sb = new StellarBody({
        scene,
        size,
        distanceFromCenter,
        rotationSpeed,
        color,
        id,
        composition,
      });
      createOrbitRing(
        scene,
        centerX,
        centerY,
        sb.getOrbitSize(),
        getStellarBodyColorFromComposition(composition)
      );
      if (orbit.length) {
        orbit.forEach(
          ({
            size,
            color,
            distanceFromCenter,
            rotationSpeed,
            id,
            composition,
          }) =>
            sb.addToOrbit(
              new StellarBody({
                scene,
                size,
                color,
                distanceFromCenter,
                rotationSpeed,
                id,
                composition,
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
  hexMap: { [key: string]: HexTile }
) {
  const [x, y] = system.coordinates;
  const hexTile = hexMap[`${x},${y}`];
  if (!hexTile) {
    return;
  }
  hexTile.addSystem(system);

  renderSystemNeighbors(system, hexMap);
}

const neighbors = [
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 0],
];

export function renderSystemNeighbors(
  system: StarSystemObject,
  hexMap: { [key: string]: HexTile }
) {
  const [originX, originY] = system.coordinates;
  neighbors.forEach(([x, y]) => {
    const hexTile = hexMap[`${originX + x},${originY + y}`];
    if (!hexTile || hexTile?.hasStarSystem()) {
      return;
    }
    hexTile.setUnexplored();
    const starSystem = getStarSystemByCoordinate([originX + x, originY + y]);
    if (starSystem) {
      hexTile.addSystem(starSystem);
      hexTile.setPlayerHasAccess(false);
      renderSystemNeighbors(starSystem, hexMap);
    }
  });
}
