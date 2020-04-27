import { Volume, ArrayExporter, onlyOneTrue } from '../../src/index.js';
import ndarray from 'ndarray';


test('throws on more than one true option', () => {
  let options = {
    fill: true,
    color: true
  }

  expect(() => {
    onlyOneTrue(options);
  }).toThrow();
});

test('returns true on only one true option', () => {
  let options = {
    fill: true,
    color: false
  }

  expect(onlyOneTrue(options)).toEqual(true);
});
