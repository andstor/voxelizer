/**
 * @author André Storhaug <andr3.storhaug@gmail.com>
 */

import { TextureHandler } from "./TextureHandler";
import { Mesh, Color, Object3D } from "three";

/**
 * Class for extracting color from texture data.
 * @memberof module:voxelizer/color
 */
export class ColorExtractor {

  /**
   * Creates a color extractor.
   * @param {Mesh|Object3D} object A Mesh, or an Object3D containing a Mesh.
   */
  constructor(object) {
    this.object = object;
    this.textureHandler = new TextureHandler();

    this.getTextures().forEach(([texture, uuid]) => {
      this.textureHandler.registerTexture(texture, uuid);
    });
  }

  /**
   * Get the color of the texture at the raycast intersect.
   * @param {Object} intersect Intersect object produced by threejs's raycasting.
   */
  getColorAtIntersect(intersect) {
    let color = new Color();

    if (intersect.uv) {
      let uv = intersect.uv;
      if (Number.isNaN(uv.x) === false && Number.isNaN(uv.y) === false) {
        if (Array.isArray(intersect.object.material)) {
          intersect.object.material.forEach(m => {
            if (m.map) {
              m.map.transformUv(uv);
              let uuid = m.map.uuid;
              let texelColor = this.textureHandler.getTexelColor(uv, uuid);
              color.multiply(texelColor);
            }
          });
        }
        else {
          if (intersect.object.material.map) {
            intersect.object.material.map.transformUv(uv);
            let uuid = intersect.object.material.map.uuid;
            let texelColor = this.textureHandler.getTexelColor(uv, uuid);
            color.multiply(texelColor);
          }
        }
      }
    }

    if (intersect.object.material.color) {
      color.multiply(intersect.object.material.color);
    }

    return color;
  }

  /**
   * Extract all texture data (files) from the threejs Object3D stored in this class.
   * @returns {Object[]} Array with texture objects, first element being the image data
   * and the second element being a UUID.
   */
  getTextures() {
    let textures = [];
    this.object.traverse(child => {
      if (child instanceof Mesh) {

        if (Array.isArray(child.material)) {
          child.material.forEach(m => {
            if (child.material) {
              if (m.map) {
                textures.push([m.map.image, m.map.uuid]);
              }
            }
          });
        } else {
          if (child.material) {
            if (child.material.map) {
              textures.push([child.material.map.image, child.material.map.uuid]);
            }
          }
        }
      }
    });
    return textures;
  }
}
