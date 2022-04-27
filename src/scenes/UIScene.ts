import { UIBar } from "../components/UI/UIBar";
import DependentScene from "./DependentScene";

export class UIScene extends DependentScene {
  private gasBarContainer: Phaser.GameObjects.Container;
  private blueGasBar: UIBar;
  private yellowGasBar: UIBar;
  private redGasBar: UIBar;
  constructor() {
    super({
      key: "UIScene",
    });
  }

  static spriteDependencies: SpriteDependency[] = [...UIBar.spriteDependencies];
  static audioDependencies: AudioDependency[] = [];

  preload(): void {}

  create(): void {
    this.blueGasBar = new UIBar(this, { x: 0, y: 0 }, 10, 10, 0x4c75d4);
    this.yellowGasBar = new UIBar(this, { x: 40, y: 0 }, 3, 10, 0xd9b44e);
    this.redGasBar = new UIBar(this, { x: 80, y: 0 }, 7, 10, 0xd44c5a);

    const f = new UIBar(this, { x: 40, y: -100 }, 7, 10, 0xd44c5a, 128, 32);
    this.gasBarContainer = this.add.container(
      this.game.canvas.width - 150,
      this.game.canvas.height - 150,
      [this.blueGasBar, this.yellowGasBar, this.redGasBar, f]
    );
  }

  update(time: number, delta: number): void {}
}
