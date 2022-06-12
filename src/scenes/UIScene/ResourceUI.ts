function buildBorder({
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

export function buildResourceBorder(scene: Phaser.Scene, x: number, y: number) {
  return buildBorder({
    scene,
    x,
    y,
    width: 150,
    height: 200,
  });
}
