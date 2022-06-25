import { getText } from "../../components/UI/GameText";
import { XPBar } from "../../components/UI/XPBar";
import { WHITE } from "../../utility/Constants";

export function buildXPUI(
  scene: Phaser.Scene,
  currentValue: number = 0,
  maxValue: number = 100,
  shipLevel: number = 1
) {
  const container = scene.add.container(
    scene.game.canvas.width - 190,
    scene.game.canvas.height - 300
  );
  const xpBar = new XPBar({
    scene,
    position: { x: -15, y: 0 },
    currentValue,
    maxValue,
  });

  const levelText = scene.add.existing(
    getText(scene, -175, -15, `${shipLevel}`, 25, WHITE.str)
  ) as Phaser.GameObjects.Text;

  const xpText = scene.add.existing(
    getText(scene, -175, 25, `${currentValue}/${maxValue}`, 25, WHITE.str)
  ) as Phaser.GameObjects.Text;

  container.add(xpBar);
  container.add(levelText);
  container.add(xpText);

  scene.game.events.on("player-xp-increase", ({ currentXP, maxXP }) => {
    xpBar.setCurrentValue(currentXP);
    xpText.setText(`${currentXP}/${maxXP}`);
  });

  scene.game.events.on(
    "player-level-up",
    ({ currentLevel, currentXP, maxXP }) => {
      xpBar.setMaxValue(maxXP);
      xpBar.setCurrentValue(currentXP);

      levelText.setText(`${currentLevel}`);
      xpText.setText(`${currentXP}/${maxXP}`);
    }
  );
}
