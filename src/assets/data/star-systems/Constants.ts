export const MAX_ORBIT_SIZE = 600;
export const MIN_ORBIT_SIZE = 200;
export const MIN_ROTATION_SPEED = 10;
export const MAX_ROTATION_SPEED = 100;

export const EVEN_ROW_HEX_NEIGHBORS = [
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 0],
];

export const ODD_ROW_HEX_NEIGHBORS = [
  [-1, -1],
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 1],
  [-1, 0],
];

export function getHexNeighbors(row: number) {
  return !(row % 2) ? EVEN_ROW_HEX_NEIGHBORS : ODD_ROW_HEX_NEIGHBORS;
}
