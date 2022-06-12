import { ResourceType } from "../../assets/data/stellar-bodies/Types";
import { UIBar } from "../../components/UI/UIBar";

import DependentScene from "../DependentScene";
import { buildResourceUI } from "./ResourceUI";
import { ResourceStateObject } from '../StateScene/ResourceManagement';

export class UIScene extends DependentScene {
  private UIParent: Phaser.GameObjects.Container;
  public contentMap: Map<ResourceType, UIBar> = new Map();
  constructor() {
    super({
      key: "UIScene",
    });
  }

  static spriteDependencies: SpriteDependency[] = [...UIBar.spriteDependencies];
  static audioDependencies: AudioDependency[] = [];

  preload(): void {}

  create(): void {
    this.buildUIParent();
    const { resourceContainer, contentMap } = buildResourceUI(this);
    this.UIParent.add(resourceContainer);
    this.contentMap = contentMap;

    this.setSceneListeners();
  }

  /** Where all of the UI on the bottom of the screen lives */
  private buildUIParent() {
    this.UIParent = this.add.container(60, this.game.canvas.height - 100);
  }

  private setSceneListeners() {
    this.game.events.on(
      "resource-value-change",
      ({
        key,
        resource,
      }: {
        key: ResourceType;
        resource: ResourceStateObject;
      }) => {
        const bar = this.contentMap.get(key);
        if (bar) {
          bar.setCurrentValue(resource.current);
        }
      }
    );

    this.game.events.on(
      "resource-max-value-change",
      ({ key, newMaxValue }: { key: ResourceType; newMaxValue: number }) => {
        const bar = this.contentMap.get(key);
        bar.setMaxValue(newMaxValue);
      }
    );
  }

  update(time: number, delta: number): void {}
}
