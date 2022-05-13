import HexTile from "../../../components/system-select/HexTile";
import {
  StarSystemObject,
  getStarSystemByCoordinate,
} from "./StarSystemRepository";

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

