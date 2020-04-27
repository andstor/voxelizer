import { Sampler } from '../../src/index.js';
import { getSimpleMesh } from '../utils.js';

let model = null;

beforeEach(() => {
  model = getSimpleMesh();
});

test('Voxelize', () => {
  let sampler = new Sampler();
  let volume = sampler.sample(model, 10);
  expect(volume).toMatchSnapshot()
});


afterEach(() => {
  model.geometry.dispose();
});
