import { Directions } from "../../utility/Constants";

const directionAngleMap = {
  [Directions.up]: 0,
  [Directions.upRight]: 45,
  [Directions.right]: 90,
  [Directions.downRight]: 135,
  [Directions.down]: 180,
  [Directions.downLeft]: -135,
  [Directions.left]: -90,
  [Directions.upLeft]: -45,
};

function getAngleFromDirection(
  cursors: Phaser.Types.Input.Keyboard.CursorKeys
) {
  if (cursors.up.isDown) {
    if (cursors.right.isDown) {
      return directionAngleMap[Directions.upRight];
    }
    if (cursors.left.isDown) {
      return directionAngleMap[Directions.upLeft];
    }
    return directionAngleMap[Directions.up];
  }
  if (cursors.down.isDown) {
    if (cursors.right.isDown) {
      return directionAngleMap[Directions.downRight];
    }
    if (cursors.left.isDown) {
      return directionAngleMap[Directions.downLeft];
    }
    return directionAngleMap[Directions.down];
  }
  if (cursors.right.isDown) {
    if (cursors.up.isDown) {
      return directionAngleMap[Directions.upRight];
    }
    if (cursors.down.isDown) {
      return directionAngleMap[Directions.downRight];
    }
    return directionAngleMap[Directions.right];
  }
  if (cursors.left.isDown) {
    if (cursors.up.isDown) {
      return directionAngleMap[Directions.upLeft];
    }
    if (cursors.down.isDown) {
      return directionAngleMap[Directions.downLeft];
    }
    return directionAngleMap[Directions.left];
  }
}

export function tweenToAngle(
  cursors: Phaser.Types.Input.Keyboard.CursorKeys,
  scene: Phaser.Scene,
  gameObject: Phaser.Physics.Arcade.Sprite | Phaser.GameObjects.Sprite
) {
  scene.add.tween({
    targets: [gameObject],
    duration: 100,
    props: {
      angle: {
        from: gameObject.angle,
        to: getAngleFromDirection(cursors),
      },
    },
  });
}

export function rotateGameObject(
  scene: Phaser.Scene,
  gameObject: Phaser.Physics.Arcade.Sprite | Phaser.GameObjects.Sprite,
  byAngle: number
) {

  gameObject.angle = gameObject.angle+byAngle;
  // scene.add.tween({
  //   targets: [gameObject],
  //   duration: 100,
  //   props: {
  //     angle: {
  //       from: gameObject.angle,
  //       to: gameObject.angle + byAngle,
  //     },
  //   },
  // });
}
