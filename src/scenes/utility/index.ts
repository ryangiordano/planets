import { GameScenes } from "../../Game";
import { getRandomInt } from "../../utility/Utility";

export const startScene = (
  sceneKey: GameScenes,
  callingScene: Phaser.Scene,
  config?: any
) => {
  const sceneToChangeTo = callingScene.scene.get(sceneKey);
  const scenePlugin = new Phaser.Scenes.ScenePlugin(sceneToChangeTo);
  scenePlugin.bringToTop(sceneKey);
  scenePlugin.setActive(false, callingScene.scene.key);
  scenePlugin.start(sceneToChangeTo.scene.key, {
    callingSceneKey: callingScene.scene.key,
    ...config,
  });

  scenePlugin.setActive(true, sceneKey);
};

/** Randomly place stars in the background */
export function paintStars(
  scene: Phaser.Scene,
  centerCoords: Coords,
  totalStars: number,
  height: number,
  width: number
) {
  const stars = [];
  for (let i = 0; i < totalStars; i++) {
    const star = new Phaser.GameObjects.Sprite(
      scene,
      getRandomInt(-height, height) + centerCoords.x,
      getRandomInt(-width, width) + centerCoords.y,
      "star",
      0
    );
    star.setScale(0.5, 0.5);
    star.setAlpha(0.5);
    scene.add.existing(star);
    stars.push(star);
  }

  return stars as Phaser.GameObjects.Sprite[];
}

export function warpOutStar(
  scene: Phaser.Scene,
  centerCoords: Coords,
  star: Phaser.GameObjects.Sprite,
  duration: number,
  ease: string
) {
  scene.add.tween({
    targets: [star],
    x: {
      to: centerCoords.x,
      from: star.x,
    },
    y: {
      to: centerCoords.y,
      from: star.y,
    },
    duration,
    ease,
  });
}

export function warpInStar(
  scene: Phaser.Scene,
  centerCoords: Coords,
  star: Phaser.GameObjects.Sprite,
  duration: number,
  ease: string
) {
  scene.add.tween({
    targets: [star],
    x: {
      from: centerCoords.x,
      to: star.x,
    },
    y: {
      from: centerCoords.y,
      to: star.y,
    },
    duration,
    ease,
  });
}
