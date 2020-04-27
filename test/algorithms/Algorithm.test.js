import { Algorithm } from "../../src";

test('throws on instancing', () => {
  expect(() => {
    new Algorithm();
  }).toThrow();
});
