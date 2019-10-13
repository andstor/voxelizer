# Voxelizer

<a href="https://github.com/andstor/voxelizer"><img
  src="media/voxel.png" alt="Normalize Logo"
  width="100" height="auto" align="right"></a>
  
[![Build Status](https://travis-ci.org/andstor/voxelizer.svg?branch=master)](https://travis-ci.org/andstor/voxelizer)
[![Coverage Status](https://coveralls.io/repos/github/andstor/voxelizer/badge.svg?branch=master)](https://coveralls.io/github/andstor/voxelizer?branch=master)
[![npm version](http://img.shields.io/npm/v/voxelizer.svg?style=flat)](https://npmjs.org/package/voxelizer "View this project on npm")
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/andstor/voxelizer.svg?)](https://lgtm.com/projects/g/andstor/voxelizer/context:javascript)

Voxelizer is a JavaScript library for conducting voxelization of 3D models.


## Table of Contents
  * [Installation](#installation)
  * [Usage](#usage)
  * [API](#api)
  * [3D file format support](#3d-file-format-support)
  * [Build instrictions](#build-instructions)
  * [License](#license)

## Installation

Using [npm](https://www.npmjs.com/):

```sh
$ npm install --save voxelizer
```

## Usage
### Syntax
```
new Voxelizer()
```

### Example
```js
const Voxelizer = require('voxelizer');
const voxelizer = new Voxelizer();

let path3DModel = './path/to/file.obj';

voxelizer.loadOBJ(path3DModel).then((object) => {
  const resolution = 10;
  let matrix = voxelizer.sample(object, resolution);
  console.log(matrix);
});

```

## API

### Voxelizer()

### voxelizer.loadOBJ(path)
- **path**:
  - Type: `String`
  - Path to 3d model file.

- (return value):
  - Type: `Promise`
  - Promise with the loaded [Object3D](https://threejs.org/docs/#api/en/core/Object3D) 3D model as an argument.

Load  3D model.

### voxelizer.sample(object, resolution)
- **object**:
  - Type: `Object`
  - The 3D model to be sampled. Needs to be an [Object3D](https://threejs.org/docs/#api/en/core/Object3D) object.

- **resolution**:
  - Type: `Number`
  - Default: `10`
  - The resolution of the sampling.

- (return value):
  - Type: `Array`
  - Three dimensional array with `0`'s and `1`'s in the inner dimention.

Voxelizes a 3D model, producing a 3D array representing the 3D model.
Values of `1` represents the object's presence in space, while `0`'s represents the object's non-existence in space.

## 3D file format support
* OBJ

[⬆ back to top](#voxelizer)

## Build instructions

Clone a copy of the main Voxelizer git repo by running:

```bash
git clone git://github.com/andstor/voxelizer.git
```

Enter the Voxelizer directory and run the build script:
```bash
npm run build
```

## License

Voxelizer is licensed under the [MIT License](https://github.com/andstor/voxelizer/blob/master/LICENSE).  
Copyright © [André Storhaug](https://github.com/andstor)

[⬆ back to top](#voxelizer)
