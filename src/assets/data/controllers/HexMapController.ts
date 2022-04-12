import HexTile from "../../../components/system-select/HexTile";
import {
  StarSystemObject,
  getStarSystemByCoordinate,
} from "../repositories/StarSystemRepository";

export function buildHexMap(
  scene: Phaser.Scene,
  size: number
): { [key: string]: HexTile } {
  const hexMap = {};

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      hexMap[`${col},${row}`] = new HexTile({ scene, x: col, y: row });
    }
  }

  return hexMap;
}

export function renderSystem(
  system: StarSystemObject,
  hexMap: { [key: string]: HexTile }
) {
  const [x, y] = system.coordinates;
  const hexTile = hexMap[`${x},${y}`];
  hexTile.addSystem(system);
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
    hexTile.setUnexplored()
    const starSystem = getStarSystemByCoordinate([x, y]);
    if (starSystem) {
      hexTile.addSystem(starSystem);
    }
  });
}
