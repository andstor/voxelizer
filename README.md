<p align=center>
	<img width="240" src="
  https://raw.githubusercontent.com/andstor/voxelizer/master/media/voxel.svg" alt="Voxelizer Logo">
</p>
<h1 align="center">Voxelizer</h1>

> Voxelization of 3D models

[![npm version](http://img.shields.io/npm/v/voxelizer.svg?style=flat)](https://npmjs.org/package/voxelizer "View this project on npm")
![Build](https://github.com/andstor/voxelizer/workflows/Build/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/andstor/voxelizer/badge.svg?branch=master)](https://coveralls.io/github/andstor/voxelizer?branch=master)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/andstor/voxelizer.svg?)](https://lgtm.com/projects/g/andstor/voxelizer/context:javascript)

Voxelizer is a JavaScript voxelization engine for conducting voxelization of 3D models. It does so by leveraging [three.js](https://github.com/mrdoob/three.js/) and allowing you to use it's wast ecosystem of file loaders, plugins, etc.

[Examples](https://andstor.github.io/voxelizer/examples/) - 
[Documentation](https://andstor.github.io/voxelizer/) - 
[Wiki](https://github.com/andstor/voxelizer/wiki) - 
[Migration](https://github.com/andstor/voxelizer/wiki/Migration)

## Table of Contents
  * [Install](#install)
    * [As NPM package](#as-npm-package)
    * [Using a CDN](#using-a-cdn)
    * [Peer Dependency](#peer-dependency)
  * [Usage](#usage)
    * [Example](#example)
  * [Import support](#import-support)
  * [Export support](#export-support)
    * [File formats](#file-formats)
    * [Data structures](#data-structures)
  * [License](#license)
  * [Related](#related)

## Install

### As NPM package

```sh
$ npm install voxelizer
```

### Using a CDN

You can import the latest standalone [UMD](https://github.com/umdjs/umd) build from a [CDN](https://en.wikipedia.org/wiki/Content_delivery_network) such as:

```html
<script src="https://unpkg.com/voxelizer/lib/voxelizer.js"></script>
```

If you want a specific version, use `https://unpkg.com/react-dropdown-tree-select@<version>/lib/voxelizer.js` Visit [unpkg.com](https://unpkg.com) for further details.

### Peer Dependency

In order to avoid version conflicts in your project, you must install [three.js](https://github.com/mrdoob/three.js/) as a [peer dependency](https://nodejs.org/en/blog/npm/peer-dependencies/). Note that NPM doesn't install peer dependencies automatically. Instead it will generate a warning message with instructions on how to install them.

If you're using the CDN build, you'd also need to add the peer dependency to your application.

```html
<script src="https://unpkg.com/three/build/..."></script>
```

## Usage

### Example
```js
// Import via ES6 modules
import * as THREE from 'three';
import {Sampler, XMLExporter} from 'voxelizer';
// or UMD
const { Sampler, XMLExporter } = window.Voxelizer;


// Generate a yellow torus mesh to voxelize.
let geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
let material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
let torus = new THREE.Mesh( geometry, material );

// Setup Voxelizer.
let options = {
  fill: false,
  color: true
};
const sampler = new Sampler('raycast', options);

// Voxelize torus.
const resolution = 10;
let data = sampler.sample(torus, resolution);

// Export result to XML.
const exporter = new XMLExporter()
exporter.parse(data, function (xml) {
  console.log(xml)
});
```

## Import support
Voxelizer is able to load any mesh created with three.js. By doing so, one can make use of the around 40 📄 file loaders provided by three.js, including support for the popular [glTF](https://threejs.org/examples/?q=loader#webgl_loader_gltf), [OBJ](https://threejs.org/examples/?q=loader#webgl_loader_obj_mtl) and [STL](https://threejs.org/examples/?q=loader#webgl_loader_stl) formats. 

three.js classifies these [loaders](https://github.com/mrdoob/three.js/tree/master/examples/jsm/loaders) as *"examples"*. Please see the [three.js documentation](https://threejs.org/docs/index.html#manual/en/introduction/Loading-3D-models) for how to use these. 

Following is an example of how to load and voxelize a glTF file:

```js
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

// Setup voxelizer.
// ...

const gltfloader = new GLTFLoader();
gltfloader.load('path/to/file.glb', function (data) {
  let mesh = data.scene;
  let data = sampler.sample(mesh, resolution);
  
  // Do something with the data.
  // ...
});

```

## Export support

 Several file types and data structures are supported for exporting the voxel data.

### File formats

- [BINVOX](https://www.patrickmin.com/binvox/binvox.html)
- XML

### Data structures

- [ndarray](https://github.com/scijs/ndarray)
- 3D Array

## License

Copyright © [André Storhaug](https://github.com/andstor)

Voxelizer is licensed under the [MIT License](https://github.com/andstor/voxelizer/blob/master/LICENSE).  

## Related
- [voxelizer-desktop](https://github.com/andstor/voxelizer-desktop) - Easy 3D model voxelization desktop app
- [three-voxel-loader](https://github.com/andstor/three-voxel-loader) - three.js plugin for loading voxel data
