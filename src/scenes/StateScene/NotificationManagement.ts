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
    console.log("Adding");
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
