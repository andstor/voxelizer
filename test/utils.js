import { TorusKnotBufferGeometry, MeshBasicMaterial, Mesh, CanvasTexture } from 'three';

/**
 * Generate a basic three.js mesh.
 */
export function getSimpleMesh() {
  let geometry = new TorusKnotBufferGeometry( 10, 3, 16, 100 );
  let material = new MeshBasicMaterial( { color: 0xffff00 } );
   return new Mesh( geometry, material );
}

/**
 * Generate a textured three.js mesh.
 * @param {string} color The color of the texture.
 */
export function getTexturedMesh(color) {
  let geometry = new TorusKnotBufferGeometry( 10, 3, 16, 100 );
  let canvasTexture = new CanvasTexture(generateCanvasImage(color));
  const material = new MeshBasicMaterial({
    map: canvasTexture,
  });
  return new Mesh( geometry, material );
}

/**
 * Generate a canvas image.
 * @param {sting} color The color to fill the image with.
 */
export function generateCanvasImage(color) {
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return canvas;
}
