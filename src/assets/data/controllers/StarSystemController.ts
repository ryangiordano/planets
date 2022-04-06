import StellarBody from "../../../components/planet/StellarBody";
import { getStarSystem } from "../repositories/StarSystemRepository";

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
    color: starSystem.sun.color,
  });

  starSystem.system.forEach(
    ({ size, orbit, color, distanceFromCenter, rotationSpeed }) => {
      const sb = new StellarBody({
        scene,
        size,
        distanceFromCenter,
        rotationSpeed,
        color,
      });
      if (orbit.length) {
        orbit.forEach(({ size, color, distanceFromCenter, rotationSpeed }) =>
          sb.addToOrbit(
            new StellarBody({
              scene,
              size,
              color,
              distanceFromCenter,
              rotationSpeed,
            })
          )
        );
      }
      sun.addToOrbit(sb);
    }
  );

  return sun;
}
