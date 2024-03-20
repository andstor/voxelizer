/**
 * @author André Storhaug <andr3.storhaug@gmail.com>
 */

import { ColorableAlgorithm } from './ColorableAlgorithm';
import { Vector3, Raycaster, Box3, Euler, Mesh, DoubleSide, Object3D } from 'three';
import { acceleratedRaycast, MeshBVH } from 'three-mesh-bvh';
import { Volume } from '../volume';
import { ColorExtractor } from '../color';
import { onlyOneTrue } from '../utils/options';
import ndarray from 'ndarray';
import ndarrayFill from 'ndarray-fill';

// Replace THREE reaycast function with improved version from three-mesh-bvh.
Mesh.prototype.raycast = acceleratedRaycast;

/**
 * @typedef {ColorableAlgorithmOptions} RaycastAlgorithmOptions The default options
 * for a raycasting algorithm.
 */

/**
 * Class representing a raycasting based voxelization algorithm.
 * @memberof module:voxelizer/algorithms
 * @extends ColorableAlgorithm
 */
export class RaycastAlgorithm extends ColorableAlgorithm {

  /**
   * Creates a new RaycastAlgorithm.
   * @param {RaycastAlgorithmOptions} [options={}] Algorithm options.
   */
  constructor(options = {}) {
    super(options);

    // Only supports either filling or coloring.
    onlyOneTrue({
      fill: this.options.fill,
      color: this.options.color
    });

    this.seeker = new Vector3();
    this.bbox = new Box3();
    this.size = new Vector3();
    this.center = new Vector3();
    this.startRotation = new Euler();
    this.startPosition = new Vector3();
  }

  /**
   * The default options for this raycasting algorithm.
   * @type {RaycastAlgorithmOptions}
   */
  get defaults() {
    return {
      ...super.defaults
    };
  }

  /**
   * Samples a mesh based 3D object into voxels.
   * @param {Mesh|Object3D} model mesh based 3D object.
   * @param {number} resolution resolution of voxelization.
   * @returns {Volume} Volume data representation of the mesh.
   */
  sample(model, resolution = 10) {
    let object = new Object3D().add(model.clone());
    this.resolution = resolution;
    if (this.options.color) {
      this.colorExtractor = new ColorExtractor(object);
    }

    object.traverse(function (child) {
      if (child instanceof Mesh) {
        child.material.side = DoubleSide;
        child.geometry.computeBoundingSphere();
        child.geometry.computeBoundingBox();
        child.geometry.computeVertexNormals();
        child.geometry.boundsTree = new MeshBVH(child.geometry);
      }
    });

    // Store initial rotation of object
    this.startRotation.copy(object.rotation);
    this.startPosition.copy(object.position);
    object.updateMatrixWorld();
    object.updateMatrix();
    this.updateBoundingBox(object);

    this.step = Math.max(this.width, this.height, this.depth) / (resolution - 1);
    this.raycaster = new Raycaster();

    // Prepare object
    object.rotateOnAxis(new Vector3(1, 1, 1), 0.00001); // Reduce error by minor rotation.
    new Box3().setFromObject(object).getCenter(object.position).multiplyScalar(- 1);
    object.updateMatrixWorld();
    this.updateBoundingBox(object);

    let frontSide = this.sampleSide(object);

    object.rotateOnAxis(new Vector3(0, 1, 0), Math.PI / 2);
    object.updateMatrixWorld();
    this.updateBoundingBox(object);
    let leftSide = this.sampleSide(object);

    object.rotateOnAxis(new Vector3(0, 0, 1), Math.PI / 2);
    object.updateMatrixWorld();
    this.updateBoundingBox(object);
    let topSide = this.sampleSide(object);

    try {
      this.mergeMatrixes(frontSide, leftSide, 'ZY@X')
      this.mergeMatrixes(frontSide, topSide, 'ZXY');
    } catch (error) {
      throw error;
    } finally {
      // Reset polygon to initial values.
      object.rotation.copy(this.startRotation);
      object.position.copy(this.startPosition);
      object.updateMatrixWorld()
    }

    return frontSide;
  }

  /**
   * Merges two ndarrays, preserving '1' values.
   * @param {ndarray} volume1 ndarray used as base for merging into.
   * @param {ndarray} volume2 ndarray to merge into volume1.
   */
  mergeMatrixes(volume1, volume2, order) {
    let reverse = [];
    let matrix1 = volume1.voxels;
    let matrix2 = volume2.voxels;
    if (this.options.color) {
      var colors1 = volume1.colors;
      var colors2 = volume2.colors;
    }

    for (let index = 0; index < order.length; index++) {
      let char = order[index];
      if (char === '@') {
        reverse.push(true);
        index++;
      } else {
        reverse.push(false)
      }
    }

    // remove @'s
    order = order.replace(/@/g, '');

    let indexes = { X: 0, Y: 0, Z: 0 };
    let maxIndexes = {
      X: matrix1.shape[0] - 1,
      Y: matrix1.shape[1] - 1,
      Z: matrix1.shape[2] - 1
    };

    // Validate matrix dimentions
    if (
      maxIndexes[order[0]] + 1 !== matrix2.shape[0] ||
      maxIndexes[order[1]] + 1 !== matrix2.shape[1] ||
      maxIndexes[order[2]] + 1 !== matrix2.shape[2]
    ) {
      throw new Error('Sampled matrix dimentions do not lign up.');
    }

    var i, j, k;

    for (indexes.X = 0; indexes.X < matrix1.shape[0]; indexes.X++) {
      for (indexes.Y = 0; indexes.Y < matrix1.shape[1]; indexes.Y++) {
        for (indexes.Z = 0; indexes.Z < matrix1.shape[2]; indexes.Z++) {

          if (matrix1.get(indexes.X, indexes.Y, indexes.Z) === 0) {

            i = indexes[order[0]];
            j = indexes[order[1]];
            k = indexes[order[2]];

            if (reverse[0]) {
              i = maxIndexes[order[0]] - i;
            }
            if (reverse[1]) {
              j = maxIndexes[order[1]] - j;
            }
            if (reverse[2]) {
              k = maxIndexes[order[2]] - k;
            }

            // TODO replace object references with switch case front, right, top.
            // TODO move if up over i, j, k, ...
            //matrix1[indexes.X][indexes.Y][indexes.Z] = matrix2[i][j][k];
            let value = matrix2.get(i, j, k);
            matrix1.set(indexes.X, indexes.Y, indexes.Z, value);
            if (this.options.color) {
              let r = colors2.get(i, j, k, 0);
              let g = colors2.get(i, j, k, 1);
              let b = colors2.get(i, j, k, 2);

              colors1.set(indexes.X, indexes.Y, indexes.Z, 0, r);
              colors1.set(indexes.X, indexes.Y, indexes.Z, 1, g);
              colors1.set(indexes.X, indexes.Y, indexes.Z, 2, b);
            }
          }
        }
      }
    }
  }

  /**
   * Update this class's bounding box object data based on the object passed as parameter.
   * @param {Object3D} object The object to compute bounding box data from.
   */
  updateBoundingBox(object) {
    this.bbox.setFromObject(object);
    this.bbox.getSize(this.size);
    this.bbox.getCenter(this.center);

    this.width = this.size.x
    this.height = this.size.y
    this.depth = this.size.z
  }

  /**
   * Samples the side of the object passed as parameter.
   * The sampling is done in the direction x, y, z,
   * where z runs fastest, then y, then x.
   * Sampling is based on raycasting.
   * @param {Mesh|Object3D} object mesh based 3D object.
   * @returns {Volume} the sampled volume data.
   */
  sampleSide(object) {
    let matrix = new ndarray(new Uint8Array(this.resolution ** 3),
      [
        (Math.floor(this.width / this.step) + 1),
        (Math.floor(this.height / this.step) + 1),
        (Math.floor(this.depth / this.step) + 1)
      ]);


    // Handle coloring if option is set.
    let colors = null;
    if (this.options.color) {
      colors = new ndarray(new Uint8ClampedArray((this.resolution ** 3) * 3),
        [
          (Math.floor(this.width / this.step) + 1),
          (Math.floor(this.height / this.step) + 1),
          (Math.floor(this.depth / this.step) + 1),
          3
        ]);

      // Fill colors array with white rgb(255, 255, 255) as the default value.
      ndarrayFill(colors, () => {
        return 255;
      });
    }

    let direction = new Vector3(0, 0, -1);
    let head_x = this.bbox.min.x;
    this.direction = direction;

    this.seeker.setZ(this.bbox.max.z);
    let i = 0;
    while (head_x <= this.bbox.max.x) {
      this.seeker.setX(head_x);

      let head_y = this.bbox.min.y;
      let j = 0;
      while (head_y <= this.bbox.max.y) {

        this.seeker.setY(head_y);
        this.raycaster.set(this.seeker, direction);
        const intersects = this.raycaster.intersectObject(object, true);

        let depthView = matrix.lo(i, j).hi(1, 1);
        if (this.options.color) {
          let colorView = colors.lo(i, j).hi(1, 1);
          this._handleIntersects(intersects, depthView, colorView);
        } else {
          this._handleIntersects(intersects, depthView);
        }

        head_y += this.step;
        j++;
      }
      head_x += this.step;
      i++;
    }

    return new Volume(matrix, colors);
  }

  /**
   * Handle the intersects, meaning results in z direction.
   * @param {*} intersects The intersects to be handled.
   * @param {*} voxels The array to store the voxel data into.
   * @param {*} colors The array to store the voxel color data into.
   * @private
   */
  _handleIntersects(intersects, voxels, colors = null) {
    let inside = 0;
    let numSteps = Math.floor(this.depth / this.step);
    let currentDist = this.bbox.min.z;

    for (let i = 0; i <= numSteps; i++) {
      //voxels[i] = inside;
      voxels.set(0, 0, i, inside);

      for (let j = 0; j < intersects.length; j++) {
        let intersect = intersects[j];
        let distance = this.seeker.z - intersect.distance;

        if (distance <= currentDist + this.step
          && distance > currentDist) {

          voxels.set(0, 0, i, 1);

          // Handle filling/solid voxelisation.
          if (this.options.fill) {
            inside = !inside;
          }
          // Handle coloring of the voxels.
          if (this.options.color) {
            let color = this.colorExtractor.getColorAtIntersect(intersect);
            colors.set(0, 0, i, 0, color.r * 255);
            colors.set(0, 0, i, 1, color.g * 255);
            colors.set(0, 0, i, 2, color.b * 255);
          }
        }
      }
      currentDist += this.step;
    }
  }
}
