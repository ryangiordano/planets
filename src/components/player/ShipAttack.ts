import { throttle } from "lodash";

export function createShipAttackModule(
  rate: number,
  onFire: (pointerCoords: { x: number; y: number }) => void
) {
  return throttle(onFire, rate);
}

export function getAngleDegreesBetweenPoints(a: Coords, b: Coords) {
  return Phaser.Math.Angle.BetweenPoints(a, b) * (180 / Math.PI);
}
