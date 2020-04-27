/**
 * @author André Storhaug <andr3.storhaug@gmail.com>
 */

import { Color } from "three";

/**
 * The Colorizable contract.
 * Implemented by objects that can be colorized.
 * @memberof module:voxelizer/color
 */
export class TextureHandler {
  /**
     * Creates a new Exporter.
     */
  constructor() {
    this.textures = new Map();
  }

  /**
   * Get the texel color in the UV coordinate of the texture matching a UUID.
   * @param {Vector2} uv UV coordinate
   * @param {string} uuid The universally unique identifier (UUID) of the texture map.
   */
  getTexelColor(uv, uuid) {
    let texData = this.textures.get(uuid);
    let pixels = texData.data;
    let x = Math.floor(uv.x * texData.width);
    let y = Math.floor(uv.y * texData.height);
    var index = (y * texData.width + x) * 4
    var r = pixels[index] / 255;
    var g = pixels[index + 1] / 255;
    var b = pixels[index + 2] / 255;
    //var a = pixels[index + 3] / 255;
    return new Color(r, g, b);
  }

  /**
   * Clear all stored texture data.
   */
  clear() {
    this.textures.clear();
  }

  /**
   * Registers an image along with a UUID of the map where the image is located.
   * @param {*} image Image resource.
   * @param {string} uuid UUID of the map where the image is located.
   */
  registerTexture(image, uuid) {
    let canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    let ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, image.width, image.height);
    let texData = ctx.getImageData(0, 0, image.width, image.height);
    this.textures.set(uuid, texData);
  }
}
