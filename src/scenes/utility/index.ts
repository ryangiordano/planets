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
  }
}
