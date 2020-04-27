import { ColorExtractor } from "../../src";
import { getSimpleMesh, getTexturedMesh } from "../utils";

test('instanciate', () => {
  let object = getSimpleMesh();
  let extractor = new ColorExtractor(object);
  expect(extractor.object).toEqual(object);
});

test('register texture', () => {
  let object = getTexturedMesh('blue');
  let extractor = new ColorExtractor(object);
  let textures = extractor.getTextures();
  let objectDataURL = object.material.map.image.toDataURL()
  expect(textures[0][0].toDataURL()).toEqual(objectDataURL);
});

test('register multiple textures', () => {
  let object2 = getTexturedMesh('red');
  let object1 = getTexturedMesh('blue');
  let object = object1.add(object2);

  let extractor = new ColorExtractor(object);
  let textures = extractor.getTextures();

  let objectDataURL1 = object1.material.map.image.toDataURL()
  let objectDataURL2 = object2.material.map.image.toDataURL()
  expect(textures[0][0].toDataURL()).toEqual(objectDataURL1);
  expect(textures[1][0].toDataURL()).toEqual(objectDataURL2);
});
