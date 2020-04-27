/**
 * @author André Storhaug <andr3.storhaug@gmail.com>
 */

import { AlgorithmFactory } from '../algorithms/AlgorithmFactory'

/**
 * The voxelisation system.
 * Manages the voxelisation process.
 * @memberof module:voxelizer/core
 */

export class Sampler {

  /**
   * Creates a sampler.
   * @param {*} options
   */
  constructor(algorithm = 'raycast', options = {}) {
    this.algorithm = algorithm;

    let that = this;
    this.options = {
      ...that.defaults,
      ...options
    };
  }

  /**
   * Get default options.
   */
  get defaults() {
    return {
      fill: false,
      color: true
    };
  }

  /**
   * Voxelize a mesh based 3D object into voxels.
   * @param {Mesh|Object3D} object mesh based 3D object.
   * @param {number} resolution resolution of voxelization.
   * @returns {Volume} Volume data representation of the mesh.
   */
  sample(object, resolution) {
    let algorithmFactory = new AlgorithmFactory(this.options);
    let algorithm = algorithmFactory.getAlgorithm(this.algorithm);
    let data = algorithm.sample(object, resolution);
    return data;
  }
}
