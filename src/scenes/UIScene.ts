import { UIBar } from "../components/UI/UIBar";
import DependentScene from "./DependentScene";

export class UIScene extends DependentScene {
  private gasBarContainer: Phaser.GameObjects.Container;
  private mineralBarContainer: Phaser.GameObjects.Container;
  private blueGasBar: UIBar;
  private yellowGasBar: UIBar;
  private redGasBar: UIBar;
  private orangeMineralBar: UIBar;
  private greenMineralBar: UIBar;
  private purpleMineralBar: UIBar;
  constructor() {
    super({
      key: "UIScene",
    });
  }

  static spriteDependencies: SpriteDependency[] = [...UIBar.spriteDependencies];
  static audioDependencies: AudioDependency[] = [];

  preload(): void {}

  create(): void {
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
  }

  private setSceneListeners() {
    
  }

  update(time: number, delta: number): void {}
}
