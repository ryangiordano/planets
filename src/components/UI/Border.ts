export function buildBorder({
  x,
  y,
  scene,
  width,
  height,
}: {
  x: number;
  y: number;
  scene: Phaser.Scene;
  width: number;
  height: number;
}) {
  return scene.add.nineslice(x, y, width, height, "UI_box", 5);
}

export function borderFlicker(
  scene: Phaser.Scene,
  border: Phaser.GameObjects.RenderTexture
) {
  scene.add.tween({
    targets: border,
    scale: {
      from: 1,
      to: 0.9,
    },
    alpha: {
      from: 1,
      to: 0,
    },
    yoyo: true,
    duration: 100,
    origin: 0.5,
  });
}
