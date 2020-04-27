/**
 * @author André Storhaug <andr3.storhaug@gmail.com>
 */

import { Exporter } from "./Exporter";
import unpack from 'ndarray-unpack';

/**
 * Class for exporting volume data as multidimentional arrays.
 * Voxels will be converted to 3D array.
 * Colors will be converted to 4D array, where the last dimention holds R, G, B components.
 * @memberof module:voxelizer/exporters
 * @extends Exporter
 */
export class ArrayExporter extends Exporter {

  parse(volume, onDone) {
    let voxelArray = null;
    let colorsArray = null;

    if (volume.voxels) {
      voxelArray = unpack(volume.voxels);
    }
    if (volume.colors) {
      colorsArray = unpack(volume.colors);
    }
    onDone([voxelArray, colorsArray]);
  }
}
