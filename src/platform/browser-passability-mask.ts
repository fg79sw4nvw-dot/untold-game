import { WORLD } from "../data/world";
import { PassabilityMask } from "../game/passability";

export async function loadBrowserPassabilityMask(source: string): Promise<PassabilityMask> {
  const image = new Image();
  image.src = source;
  await image.decode();

  const canvas = document.createElement("canvas");
  canvas.width = WORLD.width / WORLD.maskScale;
  canvas.height = WORLD.height / WORLD.maskScale;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Passability canvas is unavailable");

  context.imageSmoothingEnabled = false;
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

  return new PassabilityMask({
    width: canvas.width,
    height: canvas.height,
    rgba: new Uint8ClampedArray(imageData.data),
  });
}
