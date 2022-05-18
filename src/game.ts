import "phaser";
import { StarSystemScene } from "./scenes/StarSystemScene";
import { Plugin as NineSlicePlugin } from "phaser3-nineslice";

function scramble(s) {
  const t = s.split("");

  for (let i = 0; i < t.length; i++) {
    const randomToSwap = getRandomInt(0, t.length - 1);

    const temp = t[i];
    t[i] = t[randomToSwap];
    t[randomToSwap] = temp;
  }
  return t.join("");
}

import { BLACK } from "./utility/Constants";
import { BootScene } from "./scenes/BootScene";
import { SystemSelectScene } from "./scenes/SystemSelectScene";
import { StellarBodyScene } from "./scenes/StellarBodyScene";
import { UIScene } from "./scenes/UIScene";
import { StateScene } from "./scenes/StateScene";
import { getRandomInt } from "./utility/Utility";
export type GameScenes = "BootScene" | "StarSystemScene" | "Audio";
// main game configuration
const config: Phaser.Types.Core.GameConfig = {
  width: "100%",
  height: "100%",
  type: Phaser.AUTO,
  parent: "game",
  scene: [
    BootScene,
    StarSystemScene,
    SystemSelectScene,
    StellarBodyScene,
    UIScene,
    StateScene,
  ],
  plugins: {
    global: [NineSlicePlugin.DefaultCfg],
    scene: [],
  },
  backgroundColor: BLACK.str,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  render: { pixelArt: true, antialias: false },
};

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);

    for (let i = 0; i < 10; i++) {
      console.log(scramble("poplar"));
    }
  }
}

// when the page is loaded, create our game instance
window.addEventListener("load", () => {
  new Game(config);
});
