import { ResourceType } from "../../assets/data/stellar-bodies/Types";
import { UIBar } from "../../components/UI/UIBar";

import DependentScene from "../DependentScene";
import { buildResourceUI } from "./ResourceUI";
import { buildNotificationUI } from "./NotificationUI";
import NotificationView from "../../components/UI/Notification";
import { buildTooltipUI } from "./TooltipUI";
import { StateScene } from "../StateScene/StateScene";
import { buildXPUI } from "./buildXPUI";
import { buildShipStatusUI } from "./ShipStatusUI";
import Shield from "../../components/icons/Shield";
import Heart from "../../components/icons/Heart";

export class UIScene extends DependentScene {
  private UIParent: Phaser.GameObjects.Container;
  public contentMap: Map<ResourceType, UIBar> = new Map();
  constructor() {
    super({
      key: "UIScene",
    });
  }

  static spriteDependencies: SpriteDependency[] = [
    ...UIBar.spriteDependencies,
    ...NotificationView.spriteDependencies,
    ...Shield.spriteDependencies,
    ...Heart.spriteDependencies,
  ];
  static audioDependencies: AudioDependency[] = [];

  preload(): void {}

  create(): void {
    const stateScene = this.scene.get("StateScene") as StateScene;
    this.buildUIParent();
    const { resourceContainer, contentMap } = buildResourceUI(this);

    buildNotificationUI(this);
    buildTooltipUI(this);
    buildXPUI(
      this,
      stateScene.shipStatusManager.shipStatus.xpGainedThisLevel,
      stateScene.shipStatusManager.shipStatus.getXPToNextLevel()
    );

    buildShipStatusUI(this);
    this.UIParent.add(resourceContainer);
    this.contentMap = contentMap;
  }

  /** Where all of the UI on the bottom of the screen lives */
  private buildUIParent() {
    this.UIParent = this.add.container(60, this.game.canvas.height - 100);
  }

  update(time: number, delta: number): void {}
}
