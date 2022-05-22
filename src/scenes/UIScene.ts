import { ResourceType } from "../assets/data/stellar-bodies/Types";
import { UIBar } from "../components/UI/UIBar";
import { GREEN, PURPLE, ORANGE, RED, BLUE, YELLOW } from "../utility/Constants";
import DependentScene from "./DependentScene";
import { StateResourceObject, StateScene } from "./StateScene";

export class UIScene extends DependentScene {
  private gasBarContainer: Phaser.GameObjects.Container;
  private mineralBarContainer: Phaser.GameObjects.Container;
  private energyContainer: Phaser.GameObjects.Container;
  private blueGasBar: UIBar;
  private yellowGasBar: UIBar;
  private redGasBar: UIBar;
  private orangeMineralBar: UIBar;
  private greenMineralBar: UIBar;
  private purpleMineralBar: UIBar;
  private energyBar: UIBar;

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
    this.buildEnergyUI();
    this.buildResourceUI();
    this.buildContentMap();
    this.setSceneListeners();
  }

  private buildEnergyUI() {
    this.energyBar = new UIBar({
      scene: this,
      position: { x: 0, y: 0 },
      currentValue: 0,
      maxValue: 10,
      color: YELLOW.hex,
      barHeight: 144,
      barWidth: 40,
      hasBackground: true,
    });

    this.energyContainer = this.add.container(
      80,
      this.game.canvas.height - 90,
      [this.energyBar]
    );
  }

  private buildResourceUI() {
    const barDimensions = {
      barWidth: 128,
      barHeight: 42,
    };
    this.blueGasBar = new UIBar({
      scene: this,
      position: { x: 0, y: 0 },
      currentValue: 0,
      maxValue: 10,
      color: BLUE.hex,
      hasBackground: true,
      ...barDimensions,
    });
    this.yellowGasBar = new UIBar({
      scene: this,
      position: { x: 0, y: 50 },
      currentValue: 0,
      maxValue: 10,
      color: YELLOW.hex,
      hasBackground: true,
      ...barDimensions,
    });
    this.redGasBar = new UIBar({
      scene: this,
      position: { x: 0, y: 100 },
      currentValue: 0,
      maxValue: 10,
      color: RED.hex,
      hasBackground: true,
      ...barDimensions,
    });

    this.gasBarContainer = this.add.container(
      this.game.canvas.width - 250,
      this.game.canvas.height - 140,
      [this.blueGasBar, this.yellowGasBar, this.redGasBar]
    );

    this.orangeMineralBar = new UIBar({
      scene: this,
      position: { x: 0, y: 50 },
      currentValue: 0,
      maxValue: 10,
      color: ORANGE.hex,
      hasBackground: true,
      ...barDimensions,
    });
    this.greenMineralBar = new UIBar({
      scene: this,
      position: { x: 0, y: 100 },
      currentValue: 0,
      maxValue: 10,
      color: GREEN.hex,
      hasBackground: true,
      ...barDimensions,
    });
    this.purpleMineralBar = new UIBar({
      scene: this,
      position: { x: 0, y: 0 },
      currentValue: 0,
      maxValue: 10,
      color: PURPLE.hex,
      hasBackground: true,
      ...barDimensions,
    });

    this.mineralBarContainer = this.add.container(
      this.game.canvas.width - 100,
      this.game.canvas.height - 140,
      [this.orangeMineralBar, this.greenMineralBar, this.purpleMineralBar]
    );
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
      ["energy", this.energyBar],
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
