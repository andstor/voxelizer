/**
 * @author André Storhaug <andr3.storhaug@gmail.com>
 */

import * as ndarray from 'ndarray';

/**
 * Class for holding data about a voxel volume.
 * @memberof module:voxelizer/volume
 */
export class Volume {

  /**
   * Constructs a new Volume object.
   * @param {ndarray<Uint8Array>} voxels ndarray with voxel data.
   * @param {ndarray<Uint8Array>|null} [colors] ndarray filled with triplets of RGB color values.
   */
  constructor(voxels, colors = null) {
    /**
     * Actual voxel data.
     * @type {ndarray<Uint8Array>}
     */
    this.voxels = voxels;

    /**
		 * ndarray filled with triplets of RGB color values.
		 * @type {ndarray<Uint8Array>|null}
		 */
    this.colors = colors;
  }
}
