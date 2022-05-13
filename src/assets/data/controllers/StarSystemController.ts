import StellarBody, {
  GasType,
  getStellarBodyColorFromComposition,
  MAX_STELLAR_BODY_SIZE,
} from "../../../components/planet/StellarBody";
import HexTile from "../../../components/system-select/HexTile";
import {
  StellarBodySize,
  MineralType,
} from "../../../components/planet/StellarBody";
import { getRandomInt } from "../../../utility/Utility";
import {
  StellarBodyObject,
  setStellarBodydata as setStellarBodyData,
} from "../repositories/StellarBodyRepository";
import {
  getStarSystem,
  getStarSystemByCoordinate,
  setStarSystem,
  StarSystemObject,
} from "../repositories/StarSystemRepository";

export const MAX_ORBIT_SIZE = 600;
export const MIN_ORBIT_SIZE = 200;
export const MIN_ROTATION_SPEED = 10;
export const MAX_ROTATION_SPEED = 100;

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

function generateRandomCompositionValues<T>(
  numberToGenerate: 1 | 2 | 3,
  valueBank: T[]
) {
  const result: [T, number][] = [];
  const arr = [...valueBank];
  while (arr.length) {
    const i = getRandomInt(0, arr.length);
    const type = arr.splice(i, 1)[0];
    const value = Math.random();
    result.push([type, value]);

    if (result.length >= numberToGenerate) {
      return result;
    }
  }
}

function createRandomStellarBodyObject({
  hasMinerals = true,
  hasGas = true,
  numberOfStellarBodiesInOrbit = 0,
  minSize = 0,
  maxSize = MAX_STELLAR_BODY_SIZE,
  minDistanceFromCenter = MIN_ORBIT_SIZE,
  maxDistanceFromCenter = MAX_ORBIT_SIZE,
  minRotationSpeed = MIN_ROTATION_SPEED,
  maxRotationSpeed = MAX_ROTATION_SPEED,
}: {
  hasMinerals?: boolean;
  hasGas?: boolean;
  numberOfStellarBodiesInOrbit?: number;
  minSize?: number;
  maxSize?: number;
  minDistanceFromCenter?: number;
  maxDistanceFromCenter?: number;
  minRotationSpeed?: number;
  maxRotationSpeed?: number;
}): StellarBodyObject {
  const size = getRandomInt(minSize, maxSize) as StellarBodySize;
  const distanceFromCenter = getRandomInt(
    minDistanceFromCenter,
    maxDistanceFromCenter
  );

  const numberOfGasElements = getRandomInt(1, 3) as 1 | 2 | 3;
  const numberOfMinerals = getRandomInt(1, 3) as 1 | 2 | 3;
  const composition = {
    mineral: hasMinerals
      ? generateRandomCompositionValues<MineralType>(numberOfMinerals, [
          "purple",
          "orange",
          "green",
        ])
      : [],
    gas: hasGas
      ? generateRandomCompositionValues<GasType>(numberOfGasElements, [
          "red",
          "yellow",
          "blue",
        ])
      : [],
  };
  const id = new Date().getTime() * Math.random();
  const orbit = [];
  for (let j = 0; j < numberOfStellarBodiesInOrbit; j++) {
    // Push satellites into orbit
    orbit.push(
      createRandomStellarBodyObject({
        hasMinerals: true,
        hasGas: false,
        maxSize: getRandomInt(minSize, size-1),
        minDistanceFromCenter: 25,
        maxDistanceFromCenter: 50,
      })
    );
  }
  const stellarBodyData = {
    name: "Rando",
    id,
    distanceFromCenter,
    size,
    rotationSpeed: getRandomInt(minRotationSpeed, maxRotationSpeed),
    composition,
    orbit: orbit.map((o) => o.id),
  };

  /** Register it to our internal database */
  setStellarBodyData(stellarBodyData);
  return stellarBodyData;
}

/** Randomly generate a system with a sun, planets and moons */
export function createRandomSystem(
  coordinates: [number, number]
): StarSystemObject {
  const sun = createRandomStellarBodyObject({ hasMinerals: false });

  const numberOfPlanets = getRandomInt(0, 10);
  const planets: StellarBodyObject[] = [];
  for (let i = 0; i < numberOfPlanets; i++) {
    const numberOfMoons = getRandomInt(0, 2);

    const planet = createRandomStellarBodyObject({
      hasMinerals: true,
      hasGas: true,
      numberOfStellarBodiesInOrbit: numberOfMoons,
      minSize: 1,
    });

    planets.push(planet);
  }

  const starSystemObject = {
    id: Math.random(),
    sun,
    system: planets,
    coordinates,
  };

  const starSystemData = {
    id: starSystemObject.id,
    coordinates: starSystemObject.coordinates,
    sun: starSystemObject.sun.id,
    system: planets.map((p) => {
      return p.id;
    }),
  };

  setStarSystem(starSystemData);

  return starSystemObject;
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
