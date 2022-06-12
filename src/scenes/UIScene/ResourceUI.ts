import { ResourceType } from "./../../assets/data/stellar-bodies/Types";
import { UIBar } from "../../components/UI/UIBar";
import {
  BLUE,
  YELLOW,
  RED,
  WHITE,
  ORANGE,
  GREEN,
  PURPLE,
} from "../../utility/Constants";

function buildBorder({
  x,
  y,
  scene,
  width,
  height,
}: {
  x: number;
  y: number;
  scene: Phaser.Scene;
  width: number;
  height: number;
}) {
  return scene.add.nineslice(x, y, width, height, "UI_box", 5);
}

export function buildResourceBorder(scene: Phaser.Scene, x: number, y: number) {
  return buildBorder({
    scene,
    x,
    y,
    width: 150,
    height: 200,
  });
}

const UIBarData = [
  {
    resourceType: "blue",
    colorHex: BLUE.hex,
    position: { x: 0, y: 0 },
  },
  {
    resourceType: "yellow",
    colorHex: YELLOW.hex,
    position: { x: 0, y: 50 },
  },
  {
    resourceType: "red",
    colorHex: RED.hex,
    position: { x: 0, y: 100 },
  },
  {
    resourceType: "orange",
    colorHex: ORANGE.hex,
    position: { x: 0, y: 0 },
  },
  {
    resourceType: "green",
    colorHex: GREEN.hex,
    position: { x: 0, y: 50 },
  },
  {
    resourceType: "purple",
    colorHex: PURPLE.hex,
    position: { x: 0, y: 100 },
  },
];

/** UI for displaying the player's resources in the bottom right of the screen
 * Function returns the container with all the properly rendered UI
 * Also returns a map that related logic can query to get the bars
 * themselves to feed values into them
 */
export function buildResourceUI(scene: Phaser.Scene) {
  const barDimensions = {
    barWidth: 128,
    barHeight: 42,
  };
  const contentMap = new Map<ResourceType, UIBar>();

  const [
    blueGasBar,
    yellowGasBar,
    redGasBar,
    orangeMineralBar,
    greenMineralBar,
    purpleMineralBar,
  ] = UIBarData.map(({ position, resourceType, colorHex }) => {
    const bar = new UIBar({
      scene,
      position,
      currentValue: 0,
      maxValue: 10,
      color: colorHex,
      hasBackground: true,
      ...barDimensions,
    });
    contentMap.set(resourceType as ResourceType, bar);

    return bar;
  });

  /** Gas UI */
  const gasBorder = buildResourceBorder(scene, -75, -60);
  const gasText = scene.add.text(-65, -55, "gas", {
    fontFamily: "pixel",
    fontSize: "25px",
    color: WHITE.str,
  });

  const gasBarContainer = scene.add.container(0, 0, [
    blueGasBar,
    yellowGasBar,
    redGasBar,
    gasBorder,
    gasText,
  ]);

  /** Mineral UI */
  const mineralText = scene.add.text(-65, -55, "minerals", {
    fontFamily: "pixel",
    fontSize: "25px",
    color: WHITE.str,
  });
  const mineralBorder = buildResourceBorder(scene, -75, -60);
  const mineralBarContainer = scene.add.container(147, 0, [
    orangeMineralBar,
    greenMineralBar,
    purpleMineralBar,
    mineralBorder,
    mineralText,
  ]);

  const resourceContainer = scene.add.container(
    scene.game.canvas.width - 350,
    -70,
    [gasBarContainer, mineralBarContainer]
  );

  return { resourceContainer, contentMap };
}
