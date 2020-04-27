import { Volume, ArrayExporter } from '../../src/index.js';
import ndarray from 'ndarray';


test('voxelize mesh', () => {
  let voxels = new ndarray(new Uint8Array(100));
  var v = new Volume(voxels);
  expect(v.voxels).toEqual(voxels)
});

test('voxelize mesh with colors', () => {
  let voxels = new ndarray(new Uint8Array(8), [2, 2, 2]);
  let colors = new ndarray(new Uint8ClampedArray(24), [2, 2, 2, 3]);
  var v = new Volume(voxels, colors);
  expect(v.voxels).toEqual(voxels)
});
