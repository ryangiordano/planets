import { StarSystemObject } from "./../../assets/data/star-systems/StarSystemRepository";
import TooltipBase from "./TooltipBase";
import { getFontStyle, getText } from "./GameText";
import { BLACK } from "../../utility/Constants";
import {
  getPercentMined,
  getStarSystemById,
} from "../../assets/data/star-systems/StarSystemController";

export default class UnlockedSystemDetailsTooltip extends TooltipBase {
  constructor({
    scene,
    starSystemId,
  }: {
    scene: Phaser.Scene;
    starSystemId: number;
  }) {
    super({ scene, x: 0, y: 0 });
    const starSystemObject = getStarSystemById(starSystemId);
    const titleText = getText(
      scene,
      20,
      20,
      `The ${starSystemObject.sun.name} System`,
      25
    );
    this.add(titleText);

    const entityCountText = getText(
      scene,
      20,
      60,
      `${starSystemObject.system.length} stellar entities`,
      25
    );

    this.add(entityCountText);

    const percentMinedText = getText(
      scene,
      this.tooltipSprite.width - 180,
      this.tooltipSprite.height - 50,
      `${getPercentMined(starSystemObject)}% mined`,
      25
    );
    this.add(percentMinedText);
  }
}
