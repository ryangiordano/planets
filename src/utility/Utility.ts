export const createThrottle = (limit, func) => {
  let lastCalled: Date;
  return () => {
    if (!lastCalled || Date.now() - lastCalled.getTime() >= limit) {
      lastCalled = new Date();
      return func();
    }
  };
};

export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

export const createRandom = (upTo) => () => getRandomCeil(upTo);

export const getRandomFloor = (upTo) => Math.floor(Math.random() * upTo);

export const getRandomCeil = (upTo) => Math.ceil(Math.random() * upTo);
export const getUID = () => `_${Math.random().toString(36).substr(2, 9)}`;
export enum Directions {
  up,
  down,
  left,
  right,
}

export const asyncForEach = (array, callback): Promise<any> => {
  return new Promise<void>(async (resolve) => {
    for (let i = 0; i < array.length; i++) {
      await callback(array[i], i, array);
    }
    resolve();
  });
};

export const wait = (timeToWait): Promise<void> =>
  new Promise((resolve) => setTimeout(() => resolve(), timeToWait));

/**
 * Methods for crawling through property objects from Tiled objects.
 */
export const hasProperty = (name: string, properties): boolean => {
  const property = properties && properties.find((p) => p.name === name);
  return Boolean(property);
};
export const getObjectPropertyByName = (name: string, properties) => {
  if (properties && !hasProperty(name, properties)) {
    return null;
  }
  const property = properties.find((p) => p.name === name);
  return property.value;
};

/** Given a value between 0 and 1 `percentage`, roll the dice and return true
 * if the value is less than `percentage`.
 */
export function isWinningRoll(
  /** number between 0 and 1 */
  percentage: number
) {
  const roll = Math.random();
  return roll < percentage;
}

/** Given a value, return a new value with +/- a fuzzy number based on a percentage
 * `weight` times Math.random()
 */
export function getFuzzyValue(value: number, weight: number = 0.25): number {
  const isPlusModifier = getRandomInt(1, 2) % 2 === 0;

  const modifier = value * weight * Math.random();

  return value + (isPlusModifier ? modifier : modifier * -1);
}

export function getCanvasPosition(
  camera: Phaser.Cameras.Scene2D.Camera,
  { x, y }: { x: number; y: number }
) {
  return {
    x: (x - camera.worldView.x) * camera.zoom,
    y: (y - camera.worldView.y) * camera.zoom,
  };
}

export function getAngleDegreesBetweenPoints(a: Coords, b: Coords) {
  return Phaser.Math.Angle.BetweenPoints(a, b) * (180 / Math.PI);
}

export function getRandomQuadrantOnCircle(
  centerCoord: { x: number; y: number },
  radius: number
) {
  const coord = { x: 0, y: 0 };
  coord.x = centerCoord.x + radius * (getRandomInt(1, 3) % 2 === 0 ? 1 : -1);
  coord.y = centerCoord.y + radius * (getRandomInt(1, 3) % 2 === 0 ? 1 : -1);
  return coord;
}

export function getRandomPointOnCircle(
  centerCoord: { x: number; y: number },
  radius: number
) {
  const angle = Math.random() * Math.PI * 2;

  return {
    x: Math.cos(angle) * radius + centerCoord.x,
    y: Math.sin(angle) * radius + centerCoord.y,
  };
}
