import Voxelizer from './../src/index';

let voxelizer = null;

beforeEach(() => {
  voxelizer = new Voxelizer();
});

test('reverse matrix', () => {
  const matrix = [
    [[0, 1], [2, 3]],
    [[4, 5], [6, 7]],
  ];

  const reversedMatrix = [
    [[1, 0], [3, 2]],
    [[5, 4], [7, 6]],
  ];

  expect(voxelizer.reverse(matrix)).toEqual(reversedMatrix);

});
