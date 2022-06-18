import { NotificationTypes } from "../../scenes/StateScene/NotificationManagement";
import { GREEN } from "../../utility/Constants";
import { WHITE, BLUE, RED, YELLOW, DARK_GREY } from "../../utility/Constants";

export default class TooltipBase extends Phaser.GameObjects.Container {
  protected tooltipSprite: Phaser.GameObjects.RenderTexture;
  public showing: boolean;
  static spriteDependencies: SpriteDependency[] = [
    {
      frameHeight: 128,
      frameWidth: 128,
      key: "UI_notif",
      url: "/src/assets/sprites/UI_notif.png",
    },
  ];
  constructor({ scene, x, y }: { scene: Phaser.Scene; x: number; y: number }) {
    super(scene, x, y);
    this.scene.add.existing(this);

    this.tooltipSprite = scene.add.nineslice(0, 0, 300, 200, "UI_notif", 5);
    this.tooltipSprite.setTint(WHITE.hex);
    this.tooltipSprite.setOrigin(0);
    this.setScale(1, 0);
    this.setAlpha(0);

    this.add(this.tooltipSprite);
  }

  toggleTooltip() {
    if (this.showing) {
      return this.hideTooltip();
    }
    this.showTooltip();
  }

  showTooltip() {
    return new Promise<void>((resolve) => {
      if (!this.showing) {
        this.showing = true;
        this.scene.add.tween({
          targets: this,
          scaleY: {
            from: 0,
            to: 1,
          },
          alpha: {
            from: 0,
            to: 1,
          },
          duration: 100,
          onComplete: () => {
            resolve();
          },
        });
      } else {
        resolve();
      }
    });
  }
  hideTooltip() {
    return new Promise<void>((resolve) => {
      if (this.showing) {
        this.showing = false;
        this.scene.add.tween({
          targets: this,
          scaleY: {
            from: 1,
            to: 0,
          },
          alpha: {
            from: 1,
            to: 0,
          },
          duration: 100,
          onComplete: () => {
            resolve();
          },
        });
      } else {
        resolve();
      }
    });
  }
}
