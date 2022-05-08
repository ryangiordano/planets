import StellarBody, {
  GasType,
  getStellarBodyColorFromComposition,
  MAX_STELLAR_BODY_SIZE,
} from "../../../components/planet/StellarBody";
import HexTile from "../../../components/system-select/HexTile";
import { StellarBodySize } from "../../../components/planet/StellarBody";
import { getRandomInt } from "../../../utility/Utility";
import {
  getStarSystem,
  getStarSystemByCoordinate,
  StarSystemObject,
} from "../repositories/StarSystemRepository";

export const MAX_ORBIT_SIZE = 1500;

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
  starSystemId?: number
): StellarBody {
  const starSystem = getStarSystem(starSystemId);

  const [centerX, centerY] = getSystemCenter(scene);

  const sun = new StellarBody({
    x: centerX,
    y: centerY,
    scene,
    size: starSystem.sun.size,
    id: starSystem.sun.id,
    color: starSystem.sun.color,
    composition: starSystem.sun.composition,
    distanceFromCenter:
      starSystem.system.reduce((acc, o) => {
        acc = Math.max(acc, o.distanceFromCenter);
        return acc;
      }, 0) * 2,
  });

  createOrbitRing(
    scene,
    centerX,
    centerY,
    sun.getOrbitSize(),
    getStellarBodyColorFromComposition(starSystem.sun.composition)
  );

  starSystem.system.forEach(
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

function generateRandomCompositionValues<T>(
  numberToGenerate: 1 | 2 | 3,
  valueBank: T[]
) {
  const result: [T, number][] = [];
  const arr = [...valueBank];
  while (arr.length) {
    const i = getRandomInt(1, arr.length);
    const type = arr.splice(i, 1)[0];
    const value = Math.random();
    result.push([type, value]);

    if (result.length >= numberToGenerate) {
      return result;
    }
  }
}

function generateRandomMineralValue() {}

/** Randomly generate a system with a sun, planets and moons */
function generateRandomSystem() {}

function createRandomPlanet() {}

function createRandomSun(scene: Phaser.Scene) {
  const [centerX, centerY] = getSystemCenter(scene);
  const size = Math.floor(Math.random() * MAX_STELLAR_BODY_SIZE);
  const distanceFromCenter = Math.floor(Math.random() * MAX_ORBIT_SIZE);

  const numberOfGasElements = getRandomInt(1, 3) as 1 | 2 | 3;

  const sun = new StellarBody({
    x: centerX,
    y: centerY,
    scene,
    size: size as StellarBodySize,
    id: new Date().getTime() * Math.random(),
    distanceFromCenter,
    composition: {
      mineral: [],
      gas: generateRandomCompositionValues<GasType>(numberOfGasElements, [
        "red",
        "yellow",
        "blue",
      ]),
    },
  });
  createOrbitRing(scene, centerX, centerY, sun.getOrbitSize(), sun.tint);

  return sun;
}

function createRandomMoon() {}

export function renderSystem(
  system: StarSystemObject,
  hexMap: { [key: string]: HexTile }
) {
  const [x, y] = system.coordinates;
  const hexTile = hexMap[`${x},${y}`];
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
    if (hexTile.hasStarSystem()) {
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
