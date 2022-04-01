/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2018 - 2019 digitsensitive
 * @license      {@link https://github.com/digitsensitive/phaser3-typescript/blob/master/LICENSE.md | MIT License}
 */

import { Directions } from "../utility/Constants";
import { characterDamage } from "../utility/tweens/character";
import { getRandomInt } from "../utility/Utility";
import DependentScene from "./DependentScene";


export class MainScene extends DependentScene {
  constructor() {
    super({
      key: "MainScene",
    });
  }

  static spriteDependencies: SpriteDependency[] = [
  ];
  static audioDependencies: AudioDependency[] = [];

  preload(): void {
  }

  create(): void {

  }


}
