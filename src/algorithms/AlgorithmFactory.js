/**
 * @author André Storhaug <andr3.storhaug@gmail.com>
 */

import { RaycastAlgorithm } from "./RaycastAlgorithm";

/**
 * Factory for creating voxelization algorithms.
 * @memberof module:voxelizer/algorithms
 */
export class AlgorithmFactory {

  /**
   * Creates an algorithm factory.
   * @param {AlgorithmOptions} options
   */
  constructor(options) {
    this.options = options;
  }

  /**
   * Get a loader based on type.
   * @param {string} type The type of algorithm to get.
   */
  getAlgorithm(type) {
    let algorithm = null;
    switch (type) {
      case 'raycast':
        algorithm = new RaycastAlgorithm(this.options);
        break;
      default:
        throw new Error('Unsupported algorithm type (' + type + ').');
    }
    return algorithm;
  }
}
