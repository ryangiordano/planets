import { throttle } from "lodash";

export function createShipAttackModule(
  rate: number,
  onFire: (pointerCoords: { x: number; y: number }) => void
) {
  return throttle(onFire, rate);
}
