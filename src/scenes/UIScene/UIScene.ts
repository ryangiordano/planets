import { ResourceType } from "../../assets/data/stellar-bodies/Types";
import { UIBar } from "../../components/UI/UIBar";
import {
  GREEN,
  PURPLE,
  ORANGE,
  RED,
  BLUE,
  YELLOW,
  WHITE,
} from "../../utility/Constants";
import DependentScene from "../DependentScene";
import { StateResourceObject } from "../StateScene";
import { buildResourceBorder } from "./ResourceUI";

export class UIScene extends DependentScene {
  private gasBarContainer: Phaser.GameObjects.Container;
  private mineralBarContainer: Phaser.GameObjects.Container;
  private resourceContainer: Phaser.GameObjects.Container;
  private UIParent: Phaser.GameObjects.Container;
  private blueGasBar: UIBar;
  private yellowGasBar: UIBar;
  private redGasBar: UIBar;
  private orangeMineralBar: UIBar;
  private greenMineralBar: UIBar;
  private purpleMineralBar: UIBar;

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
    this.buildResourceUI();
    this.buildContentMap();
    this.setSceneListeners();
  }

  private buildUIParent() {
    this.UIParent = this.add.container(60, this.game.canvas.height - 100);
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

    const gasBorder = buildResourceBorder(this, -75, -60);

    const gasText = this.add.text(-65, -55, "gas", {
      fontFamily: "pixel",
      fontSize: "25px",
      color: WHITE.str,
    });

    this.gasBarContainer = this.add.container(0, 0, [
      this.blueGasBar,
      this.yellowGasBar,
      this.redGasBar,
      gasBorder,
      gasText,
    ]);

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

    const mineralText = this.add.text(-65, -55, "minerals", {
      fontFamily: "pixel",
      fontSize: "25px",
      color: WHITE.str,
    });
    const mineralBorder = buildResourceBorder(this, -75, -60);
    this.mineralBarContainer = this.add.container(147, 0, [
      this.orangeMineralBar,
      this.greenMineralBar,
      this.purpleMineralBar,
      mineralBorder,
      mineralText,
    ]);

    this.resourceContainer = this.add.container(
      this.game.canvas.width - 350,
      -70,
      [this.gasBarContainer, this.mineralBarContainer]
    );

    this.UIParent.add(this.resourceContainer);
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
