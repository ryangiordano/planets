import { BLACK, WHITE } from "../../utility/Constants";
import { getRandomInt } from "../../utility/Utility";

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
  explosionSize?: number
) {
  shockWave(scene, WHITE.hex, coords, explosionSize);
  for (let i = 0; i <= numberToSpawn; i++) {
    const size = getRandomInt(5, 10);
    const square = scene.add.rectangle(coords.x, coords.y, size, size, color);

    scene.tweens.add({
      targets: [square],
      x: { from: coords.x, to: getRandomInt(coords.x - 100, coords.x + 100) },
      y: { from: coords.y, to: getRandomInt(coords.y - 100, coords.y + 100) },
      duration: getRandomInt(300, 500),
      angle: getRandomInt(0, 360),
      ease: "Power4",
      onComplete: () => {
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
      },
    });
  }
}
