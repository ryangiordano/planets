import { AnimationHelper } from "../utility/tweens/animation-helper";
import { BLACK, WHITE } from "../utility/Constants";
import { StarSystemScene } from "./StarSystemScene";
import DependentScene from "./DependentScene";
import { SystemSelectScene } from "./SystemSelectScene";
import { StellarBodyScene } from "./StellarBodyScene/StellarBodyScene";
import { UIScene } from "./UIScene/UIScene";
import { StateScene } from "./StateScene/StateScene";

function preloadSceneDependencies(
  bootScene: Phaser.Scene,
  scenes: typeof DependentScene[]
) {
  scenes.forEach((scene) => {
    const { spriteDependencies, audioDependencies } = scene;
    if (spriteDependencies?.length) {
      spriteDependencies.forEach((sd) => {
        bootScene.load.spritesheet(sd.key, sd.url, {
          frameWidth: sd.frameWidth,
          frameHeight: sd.frameHeight,
        });
      });
    }
    if (audioDependencies?.length) {
      audioDependencies.forEach((ad) => {
        bootScene.load.audio(ad.key, ad.url);
      });
    }
  });
}

export class BootScene extends Phaser.Scene {
  private loadingBar: Phaser.GameObjects.Graphics;
  private progressBar: Phaser.GameObjects.Graphics;
  private loaded: boolean = false;
  constructor() {
    super({ key: "BootScene" });
  }

  public init() {
    if (this.loaded) {
      this.runStartupProcess();
    }
  }
  private runStartupProcess() {
    const animationHelper = new AnimationHelper(this);
    animationHelper.createGameAnimations(
      this.cache.json.get("ryanAndLoAnimation").anims
    );
    const sprite = this.add.sprite(400, 300, "ryanandlo");
    sprite.scaleX = 1;
    sprite.scaleY = 1;
    sprite.anims.play("shine-in");
    sprite.on("animationcomplete", () => {
      this.add.text(300, 330, "Catshape Daruma®", {
        fontFamily: "pixel",
        fontSize: "20px",
        color: BLACK.str,
      });

      setTimeout(() => {
        // this.scene.start("SystemSelectScene");
        this.scene.start("StellarBodyScene", { stellarBodyId: 1 });
        this.scene.start("UIScene");
        this.scene.start("StateScene");
      }, 1);
    });
  }

  preload(): void {
    this.cameras.main.setBackgroundColor(WHITE.hex);
    this.createLoadingGraphics();
    this.load.on("complete", () => {
      this.loaded = true;
      this.runStartupProcess();
    });
    // Load the packages
    this.load.pack(
      "preload_spritesheets",
      "./src/assets/pack/spritesheets.json",
      "preload_spritesheets"
    );
    this.load.pack(
      "preload_images",
      "./src/assets/pack/image.json",
      "preload_images"
    );
    this.load.pack(
      "preload_audio",
      "./src/assets/pack/audio.json",
      "preload_audio"
    );
    this.load.pack(
      "preload_data",
      "./src/assets/pack/data.json",
      "preload_data"
    );
    this.load.pack(
      "preload_tilemaps",
      "./src/assets/pack/tilemaps.json",
      "preload_tilemaps"
    );

    this.load.pack("preload", "./src/assets/pack.json", "preload");

    preloadSceneDependencies(this, [
      StarSystemScene,
      SystemSelectScene,
      StellarBodyScene,
      UIScene,
      StateScene,
    ]);
  }
  private createLoadingGraphics(): void {
    // We can specify the type of config we want to send.
  }
}
