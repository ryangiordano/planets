import "phaser";
import { StarSystemScene } from "./scenes/StarSystemScene";
import { Plugin as NineSlicePlugin } from "phaser3-nineslice";

import { BLACK } from "./utility/Constants";
import { BootScene } from "./scenes/BootScene";
import { SystemSelectScene } from "./scenes/SystemSelectScene";
import { StellarBodyScene } from "./scenes/StellarBodyScene/StellarBodyScene";
import { UIScene } from "./scenes/UIScene/UIScene";
import { StateScene } from "./scenes/StateScene/StateScene";
import BattleScene from "./scenes/battle/BattleScene";
export type GameScenes = "BootScene" | "StarSystemScene" | "Audio";

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
    BattleScene,
  ],
  plugins: {
    global: [NineSlicePlugin.DefaultCfg],
    scene: [],
  },
  backgroundColor: BLACK.str,
  physics: {
    default: "arcade",
    arcade: {
      // debug: true,
    },
  },
  render: { pixelArt: true, antialias: false },
};

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

// when the page is loaded, create our game instance
window.addEventListener("load", () => {
  new Game(config);
});
