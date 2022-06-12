import NotificationView from "../../components/UI/Notification";

function shiftNotifsDown(
  scene: Phaser.Scene,
  notifContainer: Phaser.GameObjects.Container
) {
  const promises = [];
  notifContainer.list.forEach((child: NotificationView, index) =>
    promises.push(
      new Promise<void>((resolve) =>
        scene.tweens.add({
          targets: child,
          y: {
            from: child.y,
            to: (index + 1) * 85,
          },
          duration: 100,
          onComplete: () => {
            resolve();
          },
        })
      )
    )
  );

  return Promise.all(promises);
}

export function buildNotificationUI(scene: Phaser.Scene) {
  const container = scene.add.container(25, 25, []);

  scene.game.events.on("notification-added", async ({ notification }) => {
    const notificationView = new NotificationView({
      scene,
      x: 0,
      y: 0,
      text: notification.text,
      notificationType: notification.notificationType,
    });

    notificationView.setAlpha(0);
    if (container.list.length) {
      await shiftNotifsDown(scene, container);
    }
    container.addAt(notificationView, 0);
    scene.tweens.add({
      targets: notificationView,
      y: {
        from: -75,
        to: 0,
      },
      alpha: {
        from: 0,
        to: 1,
      },
      duration: 100,
      onComplete: () => {
        setTimeout(() => {
          scene.tweens.add({
            targets: notificationView,
            x: {
              from: 0,
              to: 75,
            },
            alpha: {
              from: 1,
              to: 0,
            },
            duration: 100,
            onComplete: () => {
              notificationView.destroy();
            },
          });
        }, 2500);
      },
    });
  });
}
