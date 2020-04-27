/**
 * @author André Storhaug <andr3.storhaug@gmail.com>
 */

import { Algorithm } from "./Algorithm";

/**
 * @typedef {AlgorithmOptions} ColorableAlgorithmOptions The default options
 * for a colorable algorithm.
 * @property {boolean} color Flag that dictates whether to color the voxelized
 * volume based on color and/or texture (UV map).
 */

/**
 * Class for sampling voxel data.
 * @memberof module:voxelizer/algorithms
 * @abstract
 * @extends Algorithm
 */
export class ColorableAlgorithm extends Algorithm {

  /**
   * Create new colorable algorithm.
   * @param {Object} [options={}] Algorithm options.
   */
  constructor(options = {}) {
    super(options);
    if (new.target === ColorableAlgorithm) {
      throw new TypeError("Cannot construct ColorableAlgorithm instances directly");
    }
  }

  /**
   * The default options for this colorable algorithm.
   * @type {ColorableAlgorithmOptions}
   */
  get defaults() {
    return {
      ...super.defaults,
      color: true
    };
  }

  /**
   * Samples a mesh based 3D object into voxels.
   * @param {Mesh|Object3D} object mesh based 3D object.
   * @param {number} resolution resolution of voxelization.
   * @returns {Volume} Volume data representation of the mesh.
   */
  sample(object, resolution) { }
}
