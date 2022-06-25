/**
 * Module of helper functions for randomly generating stellar bodies and star systems
 */

import { getRandomInt, isWinningRoll } from "../../../utility/Utility";
import { MAX_STELLAR_BODY_SIZE } from "../stellar-bodies/Constants";
import {
  StellarBodyObject,
  setStellarBodyData,
} from "../stellar-bodies/StellarBodyRepository";
import { MineralType, GasType, StellarBodySize } from "../stellar-bodies/Types";
import {
  MIN_ORBIT_SIZE,
  MAX_ORBIT_SIZE,
  MIN_ROTATION_SPEED,
  MAX_ROTATION_SPEED,
} from "./Constants";
import { StarSystemObject, setStarSystemData } from "./StarSystemRepository";
import {
  createstellarEnemies as createStellarEnemies,
  randomlyCreateEnemyData,
} from "../enemy/EnemyController";
import { createName } from "../names/names";

type PossibleCompositionValues = 0 | 1 | 2 | 3;

/** Generate gas or mineral values at random for a planet
 *
 * T expects a MineralType or GasType to inform the return value of the random composition
 */
export function generateRandomResourceType<T>(
  /** Actual elements to choose from when randomly creating the value */
  valueBank: T[]
) {
  return valueBank[getRandomInt(0, valueBank.length)];
}

function getRandomCompositionValue() {
  return getRandomInt(1, 3) as PossibleCompositionValues;
}

/**
 * Given a system level, return a random set of properties
 * you can use to influence the creation of a new star system
 */
function generateSystemProperties(systemLevel: number): {
  mineralYield: number;
  gasYield: number;
} {
  const mineralYield = Math.random() * systemLevel + systemLevel / 2;
  const gasYield = Math.random() * systemLevel + systemLevel / 2;

  return {
    mineralYield,
    gasYield,
  };
}

function generateStellarBodyYield(stellarBodyMaxYield: number) {
  return Math.random() * stellarBodyMaxYield + stellarBodyMaxYield / 2;
}

/** Creates a random stellar body object within the given configuration
 * and value clamps. Reasonable defaults are provided.
 */
function createRandomStellarBodyObject({
  numberOfMinerals,
  numberOfGasElements,
  numberOfStellarBodiesInOrbit = 0,
  minSize = 0,
  maxSize = MAX_STELLAR_BODY_SIZE,
  minDistanceFromCenter = MIN_ORBIT_SIZE,
  maxDistanceFromCenter = MAX_ORBIT_SIZE,
  minRotationSpeed = MIN_ROTATION_SPEED,
  maxRotationSpeed = MAX_ROTATION_SPEED,
  mineralMaxYield,
  gasMaxYield,
  hasEnemies,
  systemLevel,
}: {
  numberOfMinerals?: PossibleCompositionValues;
  numberOfGasElements?: PossibleCompositionValues;
  numberOfStellarBodiesInOrbit?: number;
  minSize?: number;
  maxSize?: number;
  minDistanceFromCenter?: number;
  maxDistanceFromCenter?: number;
  minRotationSpeed?: number;
  maxRotationSpeed?: number;
  mineralMaxYield: number;
  gasMaxYield: number;
  hasEnemies?: boolean;
  systemLevel: number;
}): StellarBodyObject {
  if (!numberOfMinerals && !numberOfGasElements) {
    const hasMinerals = isWinningRoll(0.5);
    numberOfMinerals = hasMinerals ? 1 : 0;
    numberOfGasElements = hasMinerals ? 0 : 1;
  }

  const size = getRandomInt(minSize, maxSize) as StellarBodySize;
  const distanceFromCenter = getRandomInt(
    minDistanceFromCenter,
    maxDistanceFromCenter
  );

  let resourceType;
  if (numberOfMinerals) {
    resourceType = generateRandomResourceType<MineralType>([
      "purple",
      "orange",
      "green",
    ]);
  } else {
    resourceType = generateRandomResourceType<GasType>([
      "red",
      "yellow",
      "blue",
    ]);
  }

  const id = new Date().getTime() * Math.random();
  const orbit = [];
  for (let j = 0; j < numberOfStellarBodiesInOrbit; j++) {
    // Push satellites into orbit
    orbit.push(
      createRandomStellarBodyObject({
        numberOfMinerals: 1,
        numberOfGasElements: 0,
        maxSize: getRandomInt(minSize, size - 1),
        minDistanceFromCenter: 25,
        maxDistanceFromCenter: 50,
        mineralMaxYield,
        gasMaxYield,
        systemLevel,
      })
    );
  }

  const stellarBodyMaxYield = generateStellarBodyYield(
    numberOfMinerals ? mineralMaxYield : gasMaxYield
  );

  let stellarEnemies;

  if (hasEnemies) {
    /** Randomly determine if the system has enemies.
     * If it does, determine which type and how many by the system level.
     */
    const enemies: number[] = [];
    /** For now, let's just say there is a 100% chance the system has enemies */
    enemies.push(0, 0, 0);

    const systemEnemies = enemies.map((e) =>
      randomlyCreateEnemyData(e, systemLevel)
    );

    stellarEnemies = createStellarEnemies(
      id,
      systemEnemies.map((e) => e.id)
    );
  }

  const stellarBodyData = {
    name: createName(),
    id,
    maxYield: stellarBodyMaxYield,
    remainingYield: stellarBodyMaxYield,
    distanceFromCenter,
    size,
    rotationSpeed: getRandomInt(minRotationSpeed, maxRotationSpeed),
    resourceType,
    orbit: orbit.map((o) => o.id),
    stellarEnemies: stellarEnemies?.id,
  };

  /** Register it to our internal database */
  setStellarBodyData(stellarBodyData);
  return stellarBodyData;
}

/** Randomly generate a system with a sun, planets and moons */
export function createRandomSystem(
  /** The coordinates at which the star system should exist within the context of the game's Hex Map */
  coordinates: [number, number],
  /** The systemLevel influences number of enemies, yield of elements mined
   * and other variables. Higher level systems have a higher chance of being more dangerous
   */
  systemLevel: number
): StarSystemObject {
  const { gasYield: gasMaxYield, mineralYield: mineralMaxYield } =
    generateSystemProperties(systemLevel);

  const sun = createRandomStellarBodyObject({
    minSize: 3,
    gasMaxYield,
    mineralMaxYield,
    systemLevel,
  });
  const numberOfPlanets = getRandomInt(1, 10);
  const planets: StellarBodyObject[] = [];
  for (let i = 0; i < numberOfPlanets; i++) {
    const numberOfMoons = getRandomInt(0, 3);

    const planet = createRandomStellarBodyObject({
      numberOfStellarBodiesInOrbit: numberOfMoons,
      minSize: 1,
      maxSize: sun.size - 1,
      gasMaxYield,
      mineralMaxYield,
      hasEnemies: isWinningRoll(1),
      systemLevel,
    });

    planets.push(planet);
  }

  const starSystemId = Math.random();
  const starSystemObject = {
    id: starSystemId,
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
  setStarSystemData(starSystemData);

  return starSystemObject;
}
