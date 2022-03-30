import { AnimationHelper } from "../utility/tweens/animation-helper";
import { BLACK, WHITE } from "../utility/Constants";
import { State } from "../utility/state/State";
import { MainScene } from "./MainScene";
import DependentScene from "./DependentScene";

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
      this.sound.play("startup", { volume: 0.1 });

      this.add.text(300, 330, "Catshape Daruma®", {
        fontFamily: "pixel",
        fontSize: "20px",
        color: BLACK.str,
        fontStyle: "strong",
      });

      setTimeout(() => {
        this.scene.start("Audio");
        this.scene.start("MainScene");
      }, 1);
    });

    // When we get to the point  where we can save state to a JSON, this is where we'd load it in, flipping the proper flags.
    const sm = State.getInstance();
    sm.initialize(this.game);
  }

  preload(): void {
    // this.sound.add("startup");
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

    preloadSceneDependencies(this, [MainScene]);
  }
  private createLoadingGraphics(): void {
    // We can specify the type of config we want to send.
  }
}
