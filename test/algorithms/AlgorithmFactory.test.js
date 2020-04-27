import { AlgorithmFactory, RaycastAlgorithm } from "../../src";

test('get raycasting algorithm', () => {
  let algorithmFactory = new AlgorithmFactory();
  let algorithm = algorithmFactory.getAlgorithm('raycast');
  expect(algorithm).toBeInstanceOf(RaycastAlgorithm);
});

test('throws on unsupported algorithm type', () => {
  let algorithmFactory = new AlgorithmFactory();
  expect(() => {
    algorithmFactory.getAlgorithm('unsupported');
  }).toThrow();
});
