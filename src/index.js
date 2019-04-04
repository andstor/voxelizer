import * as THREE from 'three';
import OBJLoader from 'three-obj-loader';

OBJLoader(THREE);

class Voxelizer {

  constructor() {
    this.objectShape = [];
    this.seeker;
    this.direction;

    this.scene = new THREE.Scene();
    // instantiate a loader
    this.loader = new THREE.OBJLoader();
    this.loading = false;
  }

  sample(object, resolution = 10) {
    let objectMatrix;

    let bbox = new THREE.Box3().setFromObject(object);

    this.min_y = bbox.min.y;
    this.min_z = bbox.min.z;
    this.min_x = bbox.min.x;
    this.max_x = bbox.max.x;
    this.max_y = bbox.max.y;
    this.max_z = bbox.max.z;

    this.height = this.max_y - this.min_y;
    this.width = this.max_x - this.min_x;
    this.depth = this.max_z - this.min_z;

    this.step = (this.width / resolution);
    this.raycaster = new THREE.Raycaster();
    this.seeker = new THREE.Vector3(this.min_x, this.min_y);

    const dirFront = new THREE.Vector3(0, 0, -1);
    this.seeker.setZ(this.max_z + 5);
    let frontMatrix = this.sampleObjectSide(object, dirFront);

    const dirBack = new THREE.Vector3(0, 0, 1);
    this.seeker.setZ(this.min_z - 5);
    let backMatrix = this.sampleObjectSide(object, dirBack);
    this.reverse(backMatrix); // reverse matrix.

    objectMatrix = this.mergeMatrix(frontMatrix, backMatrix);

    // TODO sampleObjectSide should also be done at right and left side, up and
    // down, front and back.
    /*
            const dirRight = new THREE.Vector3(0, 0, -1);
            this.seeker.setZ(10);
            let rightMatrix = this.sampleObjectSide(object, dirRight);

            const dirLeft = new THREE.Vector3(-1, 0, 1);
            this.seeker.setZ(-10);
            let leftMatrix = this.sampleObjectSide(object, dirLeft);

            let rightLeft = this.mergeMatrix(rightMatrix, leftMatrix);
    */
    this.objectShape = objectMatrix;
    return this.objectShape;
  }

  // TODO sampleObjectSide needs to be independent of the min_x, min_y etc.
  sampleObjectSide(object, direction) {
    let matrix = [];
    let head_x = this.min_x;
    this.direction = direction;

    let i = 0;
    while (head_x <= this.max_x) {
      this.seeker.setX(head_x);

      let head_y = this.min_y;
      let j = 0;
      matrix[i] = [];
      while (head_y <= this.max_y) {
        this.seeker.setY(head_y);
        this.raycaster.set(this.seeker, direction);

        const intersects = this.raycaster.intersectObject(object, true);
        let depthArray = this.handleIntersects(intersects);
        matrix[i][j] = depthArray;

        head_y += this.step;
        j++;
      }
      head_x += this.step;
      i++;
    }

    return matrix;
  }

  reverse(matrix) {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        matrix[i][j].reverse();
      }
    }
    return matrix;
  }

  handleIntersects(intersects) {
    let treshold = 0.000000001; // TODO implement a treshold to prevent multiple readings in face corner.

    let matrix = [];
    let numSteps = this.depth / this.step;
    let currentDist = this.direction.z < 0 ? this.min_z : this.max_z;
    for (let i = 0; i <= numSteps; i++) {
      matrix[i] = 0;

      for (let j = 0; j < intersects.length; j++) {
        let intersect = intersects[j];

        let distance;
        if (this.direction.z < 0) {
          distance = this.seeker.z - intersect.distance;
        }
        else {
          distance = this.seeker.z + intersect.distance;
        }

        if (distance <= currentDist && distance > currentDist -
          this.step) {
          matrix[i] = 1;
        }
      }

      this.direction.z < 0
        ? currentDist += this.step
        : currentDist -= this.step;

    }
    return matrix;
  }

  calculateObjectInside(array1, array2) {
    let mergedArray = [];
    let isInside = false;

    const reducer = (accumulator, currentValue) => accumulator +
      currentValue;
    let sumArray1 = array1.reduce(reducer);
    let sumArray2 = array2.reduce(reducer);

    if ((sumArray1 + sumArray2) % 2 !== 0) {
      return sumArray1 > sumArray2 ? array1 : array2;
    }

    for (let i = 0; i < array1.length; i++) {
      if (isInside && array1[i] === 1) {
        isInside = !isInside;
        mergedArray[i] = 1;
      }
      else if (isInside && array2[i] === 1) {
        isInside = !isInside;
        mergedArray[i] = 1;
      }
      else if (isInside && (array1[i] === 0 || array2[i] === 0)) {
        mergedArray[i] = 1;
      }
      else if (!isInside && (array1[i] === 1 && array2[i] === 1)) {
        isInside = false;
        mergedArray[i] = 1;
      }
      else if (!isInside && (array1[i] === 1 || array2[i] === 1)) {
        isInside = true;
        mergedArray[i] = 1;
      }
      else {
        mergedArray[i] = 0;
      }
    }
    return mergedArray;
  }

  mergeMatrix(matrix1, matrix2) {
    let mergedMatrix = [];
    for (let x = 0; x < matrix1.length; x++) {
      mergedMatrix[x] = [];
      for (let y = 0; y < matrix1[x].length; y++) {

        mergedMatrix[x][y] = this.calculateObjectInside(
          matrix1[x][y],
          matrix2[x][y],
        );

      }
    }
    return mergedMatrix;
  }

  convertMatrix(matrix) {
    let array3D = [];
    for (let i = 0; i < matrix.length; i++) {
      let matrix_x = [];

      for (let j = 0; j < matrix[i][0].length; j++) {
        let matrix_j = [];
        for (let k = 0; k < matrix[i].length; k++) {
          matrix_j.push(
            matrix[i][k][j] === 0 ? 'x' : matrix[i][k][j]);
        }
        matrix_x.push(matrix_j);
      }
      array3D.push(matrix_x);
    }
    return array3D;
  }

  transpose(a) {
    return a[0].map(
      function(_, c) { return a.map(function(r) { return r[c]; }); });
  }

  loadOBJ(path) {
    return new Promise((resolve, reject) => {
      this.loader.load(
        path,
        object => {
          resolve(object);
        },
        // called when loading is in progresses
        xhr => {
          console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        // called when loading has errors
        error => {
          reject(error);
        },
      );
    });

  }
}

module.exports = Voxelizer;
