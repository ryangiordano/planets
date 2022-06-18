import { BLACK } from "../../utility/Constants";

export function getFontStyle(
  size: number = 20,
  color: string = BLACK.str,
  align: string = "left"
) {
  return {
    fontFamily: "pixel",
    fontSize: `${size}px`,
    color,
    align,
  };
}

export function getText(
  scene: Phaser.Scene,
  x: number,
  y: number,
  textContent: string,
  size = 20,
  color = BLACK.str,
  align = "left"
) {
  const text = scene.add.text(
    x,
    y,
    textContent,
    getFontStyle(size, color, align)
  );
  text.setOrigin(0);

  return text;
}
