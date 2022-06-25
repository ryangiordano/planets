import { BLUE } from "../../utility/Constants";
import { UIBar } from "./UIBar";

export class XPBar extends UIBar {
  constructor({
    scene,
    position,
    currentValue,
    maxValue,
  }: {
    scene: Phaser.Scene;
    position: Coords;
    currentValue: number;
    maxValue: number;
  }) {
    super({
      scene,
      position,
      currentValue,
      maxValue,
      color: BLUE.hex,
      barWidth: 275,
      barHeight: 25,
      hasBackground: true,
    });
  }
}
