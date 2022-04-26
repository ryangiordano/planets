import StellarBody from "../../../components/planet/StellarBody";
import HexTile from "../../../components/system-select/HexTile";
import {
  getStarSystem,
  getStarSystemByCoordinate,
  StarSystemObject,
} from "../repositories/StarSystemRepository";

export function buildStarSystem(
  scene: Phaser.Scene,
  starSystemId: number
): StellarBody {
  const starSystem = getStarSystem(starSystemId);
  const [centerX, centerY] = [
    scene.game.canvas.width / 2,
    scene.game.canvas.height / 2,
  ];

  const sun = new StellarBody({
    x: centerX,
    y: centerY,
    scene,
    size: starSystem.sun.size,
    id: starSystem.sun.id,
    color: starSystem.sun.color,
    distanceFromCenter:
      starSystem.system.reduce((acc, o) => {
        acc = Math.max(acc, o.distanceFromCenter);
        return acc;
      }, 0) * 2,
  });

  scene.add.circle(
    centerX,
    centerY,
    sun.getOrbitSize(),
    starSystem.sun.color,
    0.03
  );
  starSystem.system.forEach(
    ({ size, orbit, color, distanceFromCenter, rotationSpeed, id }) => {
      const sb = new StellarBody({
        scene,
        size,
        distanceFromCenter,
        rotationSpeed,
        color,
        id,
      });
      scene.add.circle(centerX, centerY, sb.getOrbitSize(), color, 0.03);
      if (orbit.length) {
        orbit.forEach(
          ({ size, color, distanceFromCenter, rotationSpeed, id }) =>
            sb.addToOrbit(
              new StellarBody({
                scene,
                size,
                color,
                distanceFromCenter,
                rotationSpeed,
                id,
              })
            )
        );
      }
      sun.addToOrbit(sb);
    }
  );

  return sun;
}

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
      renderSystemNeighbors(starSystem, hexMap);
    }
  });
}
