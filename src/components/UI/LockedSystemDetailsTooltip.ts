import TooltipBase from "./TooltipBase";
import { getText } from "./GameText";
import { getStarSystemById } from "../../assets/data/star-systems/StarSystemController";
import HexTile from "../system-select/HexTile";

export default class UnlockedSystemDetailsTooltip extends TooltipBase {
  constructor({ scene, hex }: { scene: Phaser.Scene; hex: HexTile }) {
    super({ scene, x: 0, y: 0 });
    const starSystemId = hex.starSystem.starSystemObject.id;
    const starSystemObject = getStarSystemById(starSystemId);
    const titleText = getText(scene, 20, 20, `Unknown System`, 25);
    this.add(titleText);

    const entityCountText = getText(
      scene,
      20,
      60,
      `${starSystemObject.system.length} stellar entities`,
      25
    );

    this.add(entityCountText);

    const requirementText = getText(
      scene,
      20,
      100,
      `${hex.unlockRequirements[1].toFixed(2)} required`,
      25
    );

    this.add(requirementText);
  }
}
