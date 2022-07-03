import { BLACK, WHITE } from "../../utility/Constants";
import { getRandomInt } from "../../utility/Utility";
import { fadeResourceTowardCoordinate } from "./shared";

function shockWave(
  scene: Phaser.Scene,
  color: number,
  coords: { x: number; y: number },
  size: number = 10
) {
  const circle = scene.add.circle(coords.x, coords.y, size, color);

  scene.add.tween({
    targets: circle,
    ease: "Quint.easeOut",
    scale: {
      from: 0,
      to: 5,
    },
    alpha: {
      from: 0.7,
      to: 0,
    },
    duration: 500,
    onComplete: () => {
      circle.destroy();
    },
  });
}

export function sparkImpact(
  scene: Phaser.Scene,
  color: number,
  numberToSpawn: number,
  coords: { x: number; y: number },
  explosionSize?: number,
  potency: number = 100,
  onComplete?: (spark: Phaser.GameObjects.Rectangle) => void
) {
  shockWave(scene, WHITE.hex, coords, explosionSize);
  for (let i = 0; i <= numberToSpawn; i++) {
    const size = getRandomInt(5, 10);
    const square = scene.add.rectangle(coords.x, coords.y, size, size, color);

    scene.tweens.add({
      targets: [square],
      x: {
        from: coords.x,
        to: getRandomInt(coords.x - potency, coords.x + potency),
      },
      y: {
        from: coords.y,
        to: getRandomInt(coords.y - potency, coords.y + potency),
      },
      duration: getRandomInt(300, 500),
      angle: getRandomInt(0, 360),
      ease: "Power4",
      onComplete: () => {
        if (onComplete) {
          onComplete(square);
        } else {
          scene.tweens.add({
            targets: [square],
            scale: { from: 1, to: 0 },
            duration: getRandomInt(500, 800),
            alpha: { from: 1, to: 0 },
            // ease: "Power4",
            onComplete: () => {
              square.destroy();
            },
          });
        }
      },
    });
  }
}

export function enemyExplode(scene: Phaser.Scene, impactCoords: Coords) {
  sparkImpact(
    scene,
    WHITE.hex,
    getRandomInt(40, 50),
    impactCoords,
    30,
    200,
    (spark) => {
      const randomX = getRandomInt(-270, -170);
      const randomY = getRandomInt(-300, -250);

      fadeResourceTowardCoordinate(
        scene,
        spark,
        scene.game.canvas.width + randomX,
        scene.game.canvas.height + randomY,
        getRandomInt(500, 800)
      );
    }
  );
}
