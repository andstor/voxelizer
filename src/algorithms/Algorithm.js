/**
 * @author André Storhaug <andr3.storhaug@gmail.com>
 */

/**
 * @typedef {Object} AlgorithmOptions The default algorithm options.
 * @property {boolean} fill Flag that dictates whether to fill the voxelized volume.
 */

/**
 * Class for exporting voxel data.
 * @memberof module:voxelizer/algorithms
 * @abstract
 */
export class Algorithm {

  /**
   * Create a new Algorithm
   * @param {Object} [options={}] Algorithm options.
   */
  constructor(options) {
    if (new.target === Algorithm) {
      throw new TypeError("Cannot construct Algorithm instances directly");
    }

    let that = this;

    /**
     * Default algorithm options merged with user specific options.
     * @type {Object}
     * @see {@link defaults} for options.
     */
    this.options = {
      ...that.defaults,
      ...options
    };
  }

  /**
   * The default algorithm options.
   * @type {AlgorithmOptions}
   */
  get defaults() {
    return {
      fill: false,
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
