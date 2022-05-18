/**
 * Module of helper functions for randomly generating stellar bodies and star systems
 */
import {
  MAX_STELLAR_BODY_SIZE,
  StellarBodySize,
  MineralType,
  GasType,
} from "../../../components/planet/StellarBody";
import { getRandomInt } from "../../../utility/Utility";
import {
  StellarBodyObject,
  setStellarBodyData,
} from "../steller-bodies/StellarBodyRepository";
import {
  MIN_ORBIT_SIZE,
  MAX_ORBIT_SIZE,
  MIN_ROTATION_SPEED,
  MAX_ROTATION_SPEED,
} from "./Constants";
import { StarSystemObject, setStarSystem } from "./StarSystemRepository";

/** Generate gas or mineral values at random for a planet
 *
 * T expects a MineralType or GasType to inform the return value of the random composition
 */
function generateRandomCompositionValues<T extends MineralType | GasType>(
  /** Number of elements that the stellar body is composed of */
  numberToGenerate: 1 | 2 | 3,
  /** Actual elements to choose from when randomly creating the value */
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

/** Creates a random stellar body object within the given configuration
 * and value clamps. Reasonable defaults are provided.
 */
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
        maxSize: getRandomInt(minSize, size - 1),
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
  /** The coordinates at which the star system should exist within the context of the game's Hex Map */
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
