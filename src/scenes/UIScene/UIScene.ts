import { ResourceType } from "../../assets/data/stellar-bodies/Types";
import { UIBar } from "../../components/UI/UIBar";

import DependentScene from "../DependentScene";
import { buildResourceUI } from "./ResourceUI";
import { buildNotificationUI } from "./NotificationUI";
import NotificationView from "../../components/UI/Notification";

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
  ];
  static audioDependencies: AudioDependency[] = [];

  preload(): void {}

  create(): void {
    this.buildUIParent();
    const { resourceContainer, contentMap } = buildResourceUI(this);

    buildNotificationUI(this);
    this.UIParent.add(resourceContainer);
    this.contentMap = contentMap;
  }

  /** Where all of the UI on the bottom of the screen lives */
  private buildUIParent() {
    this.UIParent = this.add.container(60, this.game.canvas.height - 100);
  }

  update(time: number, delta: number): void {}
}
