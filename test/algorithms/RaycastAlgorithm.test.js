import { RaycastAlgorithm } from "../../src";

test('instance raycast algorithm', () => {
  let algorithm = new RaycastAlgorithm();
  expect(algorithm).toBeInstanceOf(RaycastAlgorithm);
});

test.todo('sample one side of model')

test.todo('merge matrixes')
