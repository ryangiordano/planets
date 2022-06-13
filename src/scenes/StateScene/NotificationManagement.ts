import { StateScene } from "./StateScene";

export enum NotificationTypes {
  default,
  positive,
  negative,
  urgent,
}

export type NotificationManager = {
  addNotification: (text: string, notificationType: NotificationTypes) => void;
  removeNotification: () => void;
};

export function buildNotificationManagement(scene: Phaser.Scene) {
  function addNotification(text: string, notificationType: NotificationTypes) {
    scene.game.events.emit("notification-added", {
      notification: {
        text,
        notificationType,
      },
    });
  }

  function removeNotification() {
    scene.game.events.emit("notification-removed");
  }

  return {
    addNotification,
    removeNotification,
  };
}

/** Convenience function for setting notifications */
export function addNotification(
  scene: Phaser.Scene,
  text: string,
  notificationType: NotificationTypes = NotificationTypes.default
) {
  const state = scene.scene.get("StateScene") as StateScene;
  state.notificationManager.addNotification(text, notificationType);
}
