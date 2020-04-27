var camera, scene, renderer,
  model, loader, stats,
  controls, polygon, planes,
  planeHelpers, tempMesh, gltfloader;

let cache = {
  volume: null,
}

function init() {
  // Stats
  stats = new Stats();
  document.body.appendChild(stats.dom);

  // Setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xFFFFFF);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.localClippingEnabled = false;

  let mainNode = document.getElementById("viewport");
  mainNode.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(80, 30, -40);

  // Camera Controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.update();


  // Lights
  var ambientLight = new THREE.AmbientLight(0x666666, 1);
  scene.add(ambientLight);

  var light = new THREE.DirectionalLight(0xdfebff, 1);
  light.position.set(300, 500, 100);
  scene.add(light);

  // GUI
  const models = {
    'anvil': 'models/anvil.glb'
  }

  const exportFormats = {
    binvox: 'binvox',
    xml: 'xml',
  }

  var params = {
    model: models["anvil"],
    fill: false,
    color: true,
    displayOriginal: false,
    format: exportFormats["binvox"],
    save: function () { exportFile(params.format) },
    size: 0.93,
    resolution: 50,
    material: {
      color: 0xffffff,
    },
    LOD: {
      maxPoints: 1,
      maxDepth: 10
    },
    renderer: {
      triangles: 0
    },
    clipping: {
      enableClipping: false,
      planeX: {
        constant: 30,
        negated: false,
        displayHelper: false
      },
      planeY: {
        constant: 30,
        negated: false,
        displayHelper: false
      },
      planeZ: {
        constant: 30,
        negated: false,
        displayHelper: false
      }
    }
  };

  // Clipping
  planes = [
    new THREE.Plane(new THREE.Vector3(- 1, 0, 0), params.clipping.planeX.constant),
    new THREE.Plane(new THREE.Vector3(0, - 1, 0), params.clipping.planeY.constant),
    new THREE.Plane(new THREE.Vector3(0, 0, - 1), params.clipping.planeZ.constant)
  ];
  planeHelpers = planes.map(p => new THREE.PlaneHelper(p, params.resolution, 0x000000));
  planeHelpers.forEach(ph => {
    ph.visible = false;
    scene.add(ph);
  });

  // GUI
  var gui = new dat.GUI();

  gui.add(params, 'model', models).onChange(m => {
    _toggleLoading(true);
    params.model = m;

    gltfloader.load(params.model, (data) => {
      data.scene.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.material.side = THREE.DoubleSide;
        }
      });
      polygon = data.scene;
      generateVoxelMesh(polygon).then(mesh => {
        updateScene(mesh);
      });
    });
  });

  gui.add(params, 'displayOriginal').onChange(display => {
    if (display) {
      tempMesh = model;
      updateScene(polygon, false);
    } else {
      updateScene(tempMesh, false)
    }
  });

  gui.add(params, 'fill').onChange((b) => {
    if (b) params.color = false;
    _toggleLoading(true);
    generateVoxelMesh(polygon).then(mesh => updateScene(mesh));
  }).listen();

  gui.add(params, 'color').onChange((b) => {
    if (b) params.fill = false;
    _toggleLoading(true);
    generateVoxelMesh(polygon).then(mesh => updateScene(mesh));
  }).listen();

  gui.add(params, 'resolution').min(1).max(500).step(1).onFinishChange(d => {
    _toggleLoading(true);
    params.resolution = d;
    planeHelpers.forEach(helper => helper.size = params.resolution);
    generateVoxelMesh(polygon).then(mesh => {
      updateScene(mesh);
      updateClippingGui();
    });
  });

  function updateClippingGui() {
    for (let [_, folder] of Object.entries(gui.__folders.Clipping.__folders)) {
      for (let [_, controller] of Object.entries(folder.__controllers)) {
        controller.__gui.__controllers[1].__min = -(params.resolution / 2)
        controller.__gui.__controllers[1].__max = (params.resolution / 2)
      }
    }
  }

  gui.add(params, 'size').min(0.01).max(1).step(0.01).onFinishChange(d => {
    params.size = d;
    loader.setVoxelSize(params.size);
    _toggleLoading(true);
    let mesh = loader.generateMesh(loader.octree);
    updateScene(mesh);
  });

  var clipping = gui.addFolder('Clipping');
  clipping.add(params.clipping, 'enableClipping').onChange(v => {
    renderer.localClippingEnabled = v;
    requestRenderIfNotRequested();
  });
  var planeX = clipping.addFolder('planeX');
  planeX.add(params.clipping.planeX, 'displayHelper').onChange(v => {
    planeHelpers[0].visible = v
    requestRenderIfNotRequested();
  });
  planeX.add(params.clipping.planeX, 'constant').min(-(params.resolution / 2)).max((params.resolution / 2)).step(1).onChange(d => {
    planes[0].constant = d
    requestRenderIfNotRequested();
  });
  planeX.add(params.clipping.planeX, 'negated').onChange(() => {
    planes[0].negate();
    params.clipping.planeX.constant = planes[0].constant;
    requestRenderIfNotRequested();
  });

  var planeY = clipping.addFolder('planeY');
  planeY.add(params.clipping.planeY, 'displayHelper').onChange(v => {
    planeHelpers[1].visible = v
    requestRenderIfNotRequested();
  });
  planeY.add(params.clipping.planeY, 'constant').min(-(params.resolution / 2)).max((params.resolution / 2)).step(1).onChange(d => {
    planes[1].constant = d
    requestRenderIfNotRequested();
  });
  planeY.add(params.clipping.planeY, 'negated').onChange(() => {
    planes[1].negate();
    params.clipping.planeY.constant = planes[1].constant;
    requestRenderIfNotRequested();
  });

  var planeZ = clipping.addFolder('planeZ');
  planeZ.add(params.clipping.planeZ, 'displayHelper').onChange(v => {
    planeHelpers[2].visible = v
    requestRenderIfNotRequested();
  });
  planeZ.add(params.clipping.planeZ, 'constant').min(-(params.resolution / 2)).max((params.resolution / 2)).step(1).onChange(d => {
    planes[2].constant = d
    requestRenderIfNotRequested();
  });
  planeZ.add(params.clipping.planeZ, 'negated').onChange(() => {
    planes[2].negate();
    params.clipping.planeZ.constant = planes[2].constant;
    requestRenderIfNotRequested();
  });

  var lod = gui.addFolder('Level of detail');
  lod.add(params.LOD, 'maxPoints').min(1).max(30).step(1).onFinishChange(d => {
    params.LOD.maxPoints = d;
    loader.setLOD(d);
    _toggleLoading(true);
    loader.update().then((octree) => {
      let mesh = loader.generateMesh(octree);
      updateScene(mesh);
    });
  });
  lod.add(params.LOD, 'maxDepth').min(1).max(10).step(1).onFinishChange(d => {
    params.LOD.maxDepth = d;
    loader.setLOD(undefined, d);
    _toggleLoading(true);
    loader.update().then((octree) => {
      let mesh = loader.generateMesh(octree);
      updateScene(mesh);
    });
  });

  var mat = gui.addFolder('Material');
  mat.addColor(params.material, 'color').onChange(color => {
    params.material.color = color;
    model.material.color.set(color)
    requestRenderIfNotRequested();
  });

  var fileExport = gui.addFolder('Export');
  fileExport.add(params, 'format', exportFormats);
  fileExport.add(params, 'save');

  var info = gui.addFolder('Render Info');
  info.add(renderer.info.render, 'triangles').listen();


  // Voxel Loader
  loader = new VoxelLoader();

  let material = new THREE.MeshPhongMaterial({
    clippingPlanes: planes
  });
  loader.setVoxelMaterial(material);
  loader.setVoxelSize(params.size)
  loader.setLOD(params.LOD.maxPoints, params.LOD.maxDepth);

  // GLTFLoader
  gltfloader = new THREE.GLTFLoader();
  gltfloader.load(params.model, (data) => {
    data.scene.traverse(function (child) {
      if (child instanceof THREE.Mesh)
        child.material.side = THREE.DoubleSide;
    });
    polygon = data.scene;
    generateVoxelMesh(polygon).then(mesh => renderModel(mesh));
  });

  function exportFile(format) {
    let exporter;
    switch (format) {
      case 'binvox':
        exporter = new Voxelizer.BINVOXExporter();
        break;
      case 'xml':
        exporter = new Voxelizer.XMLExporter();
      default:
        break;
    }
    exporter.parse(cache.volume, data => {
      console.log("Done exporting " + format + " file.")
      let blob = new Blob([data], { encoding: "UTF-8", type: "text/plain;charset=UTF-8" });
      saveAs(blob, "voxels." + format.toLowerCase());
    });
  }

  function _toggleLoading(bool) {
    let loaderNode = document.getElementById("loader");
    if (bool) {
      loaderNode.style.display = "block";
    } else {
      loaderNode.style.display = "none";
    }
    function wait() {
      if (loaderNode.style.display != "block") {
        requestAnimationFrame(wait);
      }
    }
    wait();
  }

  function generateVoxelMesh(object) {
    return new Promise((resolve) => {
      let sampler = new Voxelizer.Sampler("raycast", { color: params.color, fill: params.fill });
      let volume = sampler.sample(object, params.resolution);
      cache.volume = volume;

      let exporter = new Voxelizer.ArrayExporter();
      exporter.parse(volume, ([voxels, colors]) => {

        loader.parseData({ voxels, colors }, 'array').then(voxels => {
          let mesh = loader.generateMesh(voxels);
          resolve(mesh);
        });
      })
    });
  }

  function updateScene(mesh, dispose = true) {
    _toggleLoading(false);
    resetScene(dispose);
    renderModel(mesh);
  }

  function renderModel(mesh) {
    _toggleLoading(false);
    model = mesh;
    scene.add(model);
    requestRenderIfNotRequested();
  }

  function resetScene(dispose) {
    scene.remove(model);
    if (dispose) {
      model.geometry.dispose();
      scene.dispose();
    }
    requestRenderIfNotRequested();
  }
}

function resizeRendererToDisplaySize() {
  const canvas = renderer.domElement;
  const height = window.innerHeight;
  const width = window.innerWidth;
  const needResize = canvas.width != width || canvas.height != height;
  if (needResize) {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    requestRenderIfNotRequested()
  }
}

let renderRequested = false;
function render() {
  renderRequested = false;
  controls.update();

  stats.begin();
  renderer.render(scene, camera);
  stats.end();
}

function requestRenderIfNotRequested() {
  if (!renderRequested) {
    renderRequested = true;
    requestAnimationFrame(render);
  }
}

window.addEventListener('load', function () {
  init();
  render();

  controls.addEventListener('change', requestRenderIfNotRequested);
  window.addEventListener('resize', resizeRendererToDisplaySize);
})
