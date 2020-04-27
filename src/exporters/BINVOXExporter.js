/**
 * @author André Storhaug <andr3.storhaug@gmail.com>
 */

import { Exporter } from "./Exporter";
import { Builder } from 'binvox';

/**
 * Class for exporting voxel data as a BINVOX resource.
 * @memberof module:voxelizer/exporters
 * @extends Exporter
 */
export class BINVOXExporter extends Exporter {

  parse(volume, onDone) {
    let builder = new Builder();
    let voxels = [];

    // Convert xyz to binvox xzy ordering.
    let data = volume.voxels.transpose(0, 2, 1);

    let nx = data.shape[0];
    let ny = data.shape[1];
    let nz = data.shape[2];

    for (var i = 0; i < nx; ++i) {
      for (var j = 0; j < nz; ++j) {
        for (var k = 0; k < ny; ++k) {

          if (data.get(i, k, j) === 1) {
            let voxel = { x: i, y: k, z: j };
            voxels.push(voxel);
          }

        }
      }
    }

    let object = {
      dimension: { depth: nx, width: ny, height: nz },
      translate: { depth: 1, width: 1, height: 1 },
      scale: 1,
      voxels: voxels,
    };

    let binvoxData = builder.build(object);

    onDone(binvoxData);
  }
}
