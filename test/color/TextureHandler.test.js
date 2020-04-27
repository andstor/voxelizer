import { TextureHandler } from "../../src";
import { generateCanvasImage } from "../utils";

test('register texture', () => {
  let textureHandler = new TextureHandler();
  let image = generateCanvasImage('green');
  let uuid = 'FF2AA5B9-9612-4D75-ACDE-08DA69C98D1B';
  textureHandler.registerTexture(image, uuid);
  expect(textureHandler.textures.get(uuid)).not.toEqual(undefined);
  expect(textureHandler.textures).toMatchSnapshot();
});

test('clear textures', () => {
  let textureHandler = new TextureHandler();
  let image = generateCanvasImage('green');
  let uuid = 'FF2AA5B9-9612-4D75-ACDE-08DA69C98D1B';
  textureHandler.registerTexture(image, uuid);
  textureHandler.clear()
  expect(textureHandler.textures.get(uuid)).toEqual(undefined);
});

test('get texel color', () => {
  let textureHandler = new TextureHandler();
  let image = generateCanvasImage('rgb(0, 255, 0)');
  let uuid = 'FF2AA5B9-9612-4D75-ACDE-08DA69C98D1B';
  textureHandler.registerTexture(image, uuid);

  let uv = { x: 0.5, y: 0.5 };
  let color = textureHandler.getTexelColor(uv, uuid);
  expect(color).toEqual({ r: 0, g: 1, b: 0 });
});
