/**
 * @author André Storhaug <andr3.storhaug@gmail.com>
 */

import xml2js from 'xml2js';
import { Exporter } from "./Exporter";

/**
 * Class for exporting voxel data as a XML resource.
 * @memberof module:voxelizer/exporters
 * @extends Exporter
 */
export class XMLExporter extends Exporter {

  parse(volume, onDone) {
    let voxels = [];
    let nx = volume.voxels.shape[0];
    let ny = volume.voxels.shape[1];
    let nz = volume.voxels.shape[2];

    //Loop over all cells
    for (var i = 0; i < nx; ++i) {
      for (var j = 0; j < ny; ++j) {
        for (var k = 0; k < nz; ++k) {

          if (volume.voxels.get(i, j, k) === 1) {
            let voxel = {};
            voxel.position = { x: i, y: j, z: k };

            // Handle color
            if (volume.colors !== null) {
              let r = volume.colors.get(i, j, k, 0);
              let g = volume.colors.get(i, j, k, 1);
              let b = volume.colors.get(i, j, k, 2);
              voxel.color = { r, g, b };
            }
            voxels.push({ voxel });
          }

        }
      }
    }

    let width = volume.voxels.shape[0];
    let height = volume.voxels.shape[1];
    let depth = volume.voxels.shape[2];

    let dimensions = { dimensions: { width, height, depth } };
    var obj = { content: [dimensions, { voxels }] };

    var builder = new xml2js.Builder();
    var xml = builder.buildObject(obj);

    onDone(xml);
  }
}
