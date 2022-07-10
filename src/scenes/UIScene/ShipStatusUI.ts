import { ShipStatusIndicator } from "../../components/UI/ship_status/ShipStatusIndicator";
import { buildBorder, borderFlicker } from "../../components/UI/Border";
import { getText } from "../../components/UI/GameText";
import { WHITE, BLUE, RED } from "../../utility/Constants";
import Shield from "../../components/icons/Shield";
import { GameObjects } from "phaser";
import Heart from "../../components/icons/Heart";

function formatPercentage(percent: number) {
  return (percent * 100).toFixed(0);
}

export function buildShipStatusUI(scene: Phaser.Scene) {
  const posX = scene.game.canvas.width - 485;
  const posY = scene.game.canvas.height - 180;
  const container = scene.add.container(posX, posY, []);
  const border = buildBorder({
    x: -0,
    y: -8,
    scene,
    width: 200,
    height: 320,
  });
  border.setOrigin(0.5);
  container.add(border);

  const shipStatusIndicator = new ShipStatusIndicator({
    scene,
    x: 0,
    y: 0,
    healthPercentage: 1,
    shieldPercentage: 1,
  });

  const shieldIcon = scene.add.existing(
    new Shield({ scene, x: -70, y: -130, fill: BLUE.hex })
  ) as GameObjects.Sprite;
  shieldIcon.setAlpha(0.7);

  const hullIcon = scene.add.existing(
    new Heart({ scene, x: -70, y: -90, fill: RED.hex })
  ) as GameObjects.Sprite;
  hullIcon.setAlpha(0.7);

  const shieldPercent = scene.add.existing(
    getText(scene, 15, -150, `100%`, 25, WHITE.str)
  ) as Phaser.GameObjects.Text;

  shieldPercent.setAlign("right");
  const hullPercent = scene.add.existing(
    getText(scene, 15, -110, `100%`, 25, WHITE.str)
  ) as Phaser.GameObjects.Text;
  hullPercent.setAlign("right");

  container.add(shipStatusIndicator);
  container.add(shieldIcon);
  container.add(hullIcon);
  container.add(shieldPercent);
  container.add(hullPercent);

  shipStatusIndicator.init();
  scene.game.events.on(
    "player-shield-increase",
    ({ currentPercentage }: { currentPercentage: number }) => {
      borderFlicker(scene, border);
      shieldPercent.setText(`${formatPercentage(currentPercentage)}%`);
      shipStatusIndicator.shieldsIndicator.setShieldPercentage(
        currentPercentage
      );
    }
  );
  scene.game.events.on(
    "player-shield-decrease",
    ({ currentPercentage }: { currentPercentage: number }) => {
      borderFlicker(scene, border);
      shieldPercent.setText(`${formatPercentage(currentPercentage)}%`);
      shipStatusIndicator.shieldsIndicator.setShieldPercentage(
        currentPercentage
      );
    }
  );
  scene.game.events.on(
    "player-health-increase",
    ({ currentPercentage }: { currentPercentage: number }) => {
      borderFlicker(scene, border);
      hullPercent.setText(`${formatPercentage(currentPercentage)}%`);
    }
  );
  scene.game.events.on(
    "player-health-decrease",
    ({ currentPercentage }: { currentPercentage: number }) => {
      borderFlicker(scene, border);
      hullPercent.setText(`${formatPercentage(currentPercentage)}%`);
    }
  );

  return shipStatusIndicator;
}
