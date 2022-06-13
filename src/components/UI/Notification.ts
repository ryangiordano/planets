import { NotificationTypes } from "../../scenes/StateScene/NotificationManagement";
import { GREEN } from "../../utility/Constants";
import {
  WHITE,
  BLUE,
  RED,
  YELLOW,
  LIGHT_GREY,
  DARK_GREY,
} from "../../utility/Constants";

const NotificationTypeColorMap = new Map<
  NotificationTypes,
  {
    str: string;
    hex: number;
  }
>([
  [NotificationTypes.default, GREEN],
  [NotificationTypes.positive, BLUE],
  [NotificationTypes.negative, RED],
  [NotificationTypes.urgent, YELLOW],
]);

const NotificationFontColorMap = new Map<
  NotificationTypes,
  {
    str: string;
    hex: number;
  }
>([
  [NotificationTypes.default, WHITE],
  [NotificationTypes.positive, WHITE],
  [NotificationTypes.negative, WHITE],
  [NotificationTypes.urgent, DARK_GREY],
]);

export default class NotificationView extends Phaser.GameObjects.Container {
  private notificationText: Phaser.GameObjects.Text;
  private notificationSprite: Phaser.GameObjects.RenderTexture;
  static spriteDependencies: SpriteDependency[] = [
    {
      frameHeight: 128,
      frameWidth: 128,
      key: "UI_notif",
      url: "/src/assets/sprites/UI_notif.png",
    },
  ];
  constructor({
    scene,
    x,
    y,
    notificationType,
    text,
  }: {
    scene: Phaser.Scene;
    x: number;
    y: number;
    notificationType: NotificationTypes;
    text: string;
  }) {
    super(scene, x, y);
    this.scene.add.existing(this);

    this.notificationText = scene.add.text(20, 20, text, {
      fontFamily: "pixel",
      fontSize: "30px",
      color: NotificationFontColorMap.get(notificationType).str,
    });

    this.notificationSprite = scene.add.nineslice(
      0,
      0,
      this.notificationText.width + 40,
      75,
      "UI_notif",
      5
    );
    this.notificationSprite.setTint(
      NotificationTypeColorMap.get(notificationType).hex
    );
    this.add(this.notificationSprite);

    this.add(this.notificationText);
  }
}
