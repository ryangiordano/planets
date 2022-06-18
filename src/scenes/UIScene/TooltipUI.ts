import TooltipBase from "../../components/UI/TooltipBase";

export function buildTooltipUI(scene: Phaser.Scene) {
  const container = scene.add.container(scene.game.canvas.width - 370, 50);

  async function hideTooltip() {
    const currentTooltip = container.getFirst("showing", true) as TooltipBase;
    if (currentTooltip) {
      await currentTooltip.hideTooltip();
      currentTooltip.destroy();
    }
  }

  scene.game.events.on(
    "show-tooltip",
    async ({ tooltip }: { tooltip: TooltipBase }) => {
      await hideTooltip();
      container.add(tooltip);
      tooltip.showTooltip();
    }
  );

  scene.game.events.on("hide-tooltip", async () => {
    await hideTooltip();

    container.getAll().forEach((c) => c.destroy());
  });
}
