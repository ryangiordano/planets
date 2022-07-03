import { buildBorder, borderFlicker } from "../../components/UI/Border";
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
    position: { x: -25, y: -15 },
    currentValue,
    maxValue,
  });
  const border = buildBorder({ x: -25, y: 0, scene, width: 300, height: 100 });
  border.setOrigin(0.5);
  container.add(border);
  const levelText = scene.add.existing(
    getText(scene, 90, 10, `${shipLevel}`, 25, WHITE.str)
  ) as Phaser.GameObjects.Text;

  levelText.setAlign("right");
  const xpText = scene.add.existing(
    getText(scene, -165, 10, `${currentValue}/${maxValue}`, 25, WHITE.str)
  ) as Phaser.GameObjects.Text;

  container.add(xpBar);
  container.add(levelText);
  container.add(xpText);

  scene.game.events.on("player-xp-increase", ({ currentXP, maxXP }) => {
    xpBar.setCurrentValue(currentXP);
    xpText.setText(`${currentXP}/${maxXP}`);

    borderFlicker(scene, border);
  });

  scene.game.events.on(
    "player-level-up",
    ({ currentLevel, currentXP, maxXP }) => {
      xpBar.setMaxValue(maxXP);
      xpBar.setCurrentValue(currentXP);

      levelText.setText(`${currentLevel}`);
      xpText.setText(`${currentXP}/${maxXP}`);
      borderFlicker(scene, border);
    }
  );
}
