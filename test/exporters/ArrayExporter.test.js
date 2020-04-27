import { Volume, ArrayExporter } from '../../src/index.js';
import ndarray from 'ndarray';

test('array export of voxels', () => {
  let array = new Array(8).fill(undefined).map((value, index) => {
    return index % 2 == 0 ? 0 : 1;
  });
  let voxels = new ndarray(array, [2, 2, 2]);
  let volume = new Volume(voxels);
  let exporter = new ArrayExporter();
  exporter.parse(volume, (array) => {
    expect(array).toMatchSnapshot();
  });
});

test('array export of voxels and colors', () => {
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

test('array export of empty volume', () => {
  let volume = new Volume();
  let exporter = new ArrayExporter();
  exporter.parse(volume, (array) => {
    expect(array).toMatchSnapshot();
  });
});
