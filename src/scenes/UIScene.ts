import { ResourceType } from "../components/planet/StellarBody";
import { UIBar } from "../components/UI/UIBar";
import DependentScene from "./DependentScene";
import { StateResourceObject, StateScene } from "./StateScene";

export class UIScene extends DependentScene {
  private gasBarContainer: Phaser.GameObjects.Container;
  private mineralBarContainer: Phaser.GameObjects.Container;
  private blueGasBar: UIBar;
  private yellowGasBar: UIBar;
  private redGasBar: UIBar;
  private orangeMineralBar: UIBar;
  private greenMineralBar: UIBar;
  private purpleMineralBar: UIBar;

  private contentMap: Map<ResourceType, UIBar> = new Map();
  constructor() {
    super({
      key: "UIScene",
    });
  }

  static spriteDependencies: SpriteDependency[] = [...UIBar.spriteDependencies];
  static audioDependencies: AudioDependency[] = [];

  preload(): void {}

  create(): void {
    console.log("Creating UI Scene");
    this.blueGasBar = new UIBar({
      scene: this,
      position: { x: 0, y: 0 },
      currentValue: 0,
      maxValue: 10,
      color: 0x4c75d4,
      hasBackground: true,
    });
    this.yellowGasBar = new UIBar({
      scene: this,
      position: { x: 40, y: 0 },
      currentValue: 0,
      maxValue: 10,
      color: 0xd9b44e,
      hasBackground: true,
    });
    this.redGasBar = new UIBar({
      scene: this,
      position: { x: 80, y: 0 },
      currentValue: 0,
      maxValue: 10,
      color: 0xd44c5a,
      hasBackground: true,
    });

    this.gasBarContainer = this.add.container(
      this.game.canvas.width - 150,
      this.game.canvas.height - 100,
      [this.blueGasBar, this.yellowGasBar, this.redGasBar]
    );

    this.orangeMineralBar = new UIBar({
      scene: this,
      position: { x: 40, y: 0 },
      currentValue: 0,
      maxValue: 10,
      color: 0xeba836,
      hasBackground: true,
    });
    this.greenMineralBar = new UIBar({
      scene: this,
      position: { x: 80, y: 0 },
      currentValue: 0,
      maxValue: 10,
      color: 0x339c4f,
      hasBackground: true,
    });
    this.purpleMineralBar = new UIBar({
      scene: this,
      position: { x: 0, y: 0 },
      currentValue: 0,
      maxValue: 10,
      color: 0x864dd6,
      hasBackground: true,
    });

    this.mineralBarContainer = this.add.container(
      this.game.canvas.width - 150,
      this.game.canvas.height - 250,
      [this.orangeMineralBar, this.greenMineralBar, this.purpleMineralBar]
    );

    this.buildContentMap();
    this.setSceneListeners();
  }

  /** Map the ui displays to their content type property */
  private buildContentMap() {
    [
      ,
      ["orange", this.orangeMineralBar],
      ["purple", this.purpleMineralBar],
      ["red", this.redGasBar],
      ["yellow", this.yellowGasBar],
      ["green", this.greenMineralBar],
      ["blue", this.blueGasBar],
    ].forEach(([contentType, uiBar]) =>
      this.contentMap.set(contentType as ResourceType, uiBar as UIBar)
    );
  }

  private setSceneListeners() {
    this.game.events.on(
      "resource-value-change",
      ({
        key,
        resource,
      }: {
        key: ResourceType;
        resource: StateResourceObject;
      }) => {
        const bar = this.contentMap.get(key);
        bar.setCurrentValue(resource.current);
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
