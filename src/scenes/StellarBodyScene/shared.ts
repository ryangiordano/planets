export function fadeResourceTowardCoordinate(
  scene: Phaser.Scene,
  gameObject: any,
  x: number,
  y: number,
  duration: number
) {
  scene.tweens.add({
    targets: [gameObject],
    x: {
      from: gameObject.x,
      to: x,
    },
    y: {
      from: gameObject.y,
      to: y,
    },
    scale: { from: 1, to: 3 },
    duration,
    alpha: { from: 1, to: 0.3 },
    onComplete: () => {
      gameObject.destroy();
    },
  });
}
