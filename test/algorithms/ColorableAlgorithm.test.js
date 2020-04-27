import { ColorableAlgorithm } from "../../src";

test('throws on instancing', () => {
  expect(() => {
    new ColorableAlgorithm();
  }).toThrow();
});
