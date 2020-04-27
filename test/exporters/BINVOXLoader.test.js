import { Volume, ArrayExporter, BINVOXExporter } from '../../src/index.js';
import ndarray from 'ndarray';

test('BINVOX export with only voxels', () => {
  //console.warn(new Builder())
  let voxelArray = new Array(8).fill(undefined).map((value, index) => {
    return index % 2 == 0 ? 0 : 1;
  });
  let voxels = new ndarray(voxelArray, [2, 2, 2]);
  let volume = new Volume(voxels);
  let exporter = new BINVOXExporter();
  exporter.parse(volume, (array) => {
    expect(array).toMatchSnapshot();
  });
});

test('BINVOX export with voxels and colors', () => {
  let voxelArray = new Array(8).fill(undefined).map((value, index) => {
    return index % 2 == 0 ? 0 : 1;
  });
  let colorArray = new Array(24).fill(undefined).map((value, index) => {
    return index % 255;
  });
  let voxels = new ndarray(voxelArray, [2, 2, 2]);
  let colors = new ndarray(colorArray, [2, 2, 2, 3]);
  let volume = new Volume(voxels, colors);
  let exporter = new ArrayExporter();
  exporter.parse(volume, (array) => {
    expect(array).toMatchSnapshot();
  });
});

