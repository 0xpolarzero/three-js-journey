import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'lil-gui';

/**
 * Base
 * ----------------------------------------------------------------
 */
// Debug
const gui = new dat.GUI();
const debugObject = {};
// Canvas
const canvas = document.querySelector('canvas.webgl');
// Scene
const scene = new THREE.Scene();
// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.set(4, 1, -4);
scene.add(camera);
// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
/**
 * ----------------------------------------------------------------
 * End Base
 */

// Models
const gltfLoader = new GLTFLoader();
gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
  gltf.scene.scale.set(10, 10, 10);
  gltf.scene.position.set(0, -4, 0);
  gltf.scene.rotation.y = Math.PI * 0.5;
  scene.add(gltf.scene);

  updateAllMaterials();

  gui
    .add(gltf.scene.rotation, 'y')
    .min(-Math.PI)
    .max(Math.PI)
    .step(0.001)
    .name('rotation');
});

const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentMapTexture = cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.jpg',
  '/textures/environmentMaps/0/nx.jpg',
  '/textures/environmentMaps/0/py.jpg',
  '/textures/environmentMaps/0/ny.jpg',
  '/textures/environmentMaps/0/pz.jpg',
  '/textures/environmentMaps/0/nz.jpg',
]);

// Will be used to update materials (to light up the helmet)
// We can apply the envMap to it because it's composed of multiple meshes
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      child.material.envMap = environmentMapTexture;
      // Can also be done this way for all children
      // scene.environment = environmentMapTexture;
      child.material.envMapIntensity = debugObject.envMapIntensity;
      child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

debugObject.envMapIntensity = 3;
gui
  .add(debugObject, 'envMapIntensity')
  .min(0)
  .max(10)
  .step(0.001)
  .onChange(updateAllMaterials);

scene.background = environmentMapTexture;

// Lights
const dirLight = new THREE.DirectionalLight(0xffffff, 3);
dirLight.position.set(0.25, 3, -2.25);
scene.add(dirLight);

gui
  .add(dirLight, 'intensity')
  .min(0)
  .max(10)
  .step(0.001)
  .name('lightIntensity');
gui.add(dirLight.position, 'x').min(-5).max(5).step(0.001).name('lightX');
gui.add(dirLight.position, 'y').min(-5).max(5).step(0.001).name('lightY');
gui.add(dirLight.position, 'z').min(-5).max(5).step(0.001).name('lightZ');

// * Try to render light in a more realistic way
renderer.physicallyCorrectLights = true;

// * Render the output color in a more realistic way
renderer.outputEncoding = THREE.sRGBEncoding;
// same as GammaEncoding but with a default gamma of 2.2 (common value)
// * Then the same for the environment map
environmentMapTexture.encoding = THREE.sRGBEncoding;

// * The tone mapping can be updated to convert the colors to a more realistic range
// * (HDR to LDR)
// * The default is NoToneMapping
renderer.toneMapping = THREE.ACESFilmicToneMapping;
// * Change the exposure: how much light we let in
renderer.toneMappingExposure = 2;

gui.add(renderer, 'toneMapping', {
  No: THREE.NoToneMapping,
  Linear: THREE.LinearToneMapping,
  Reinhard: THREE.ReinhardToneMapping,
  Cineon: THREE.CineonToneMapping,
  ACESFilmic: THREE.ACESFilmicToneMapping,
});
gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001);

// * Aliasing
// * Can happen when a geometry edge is not aligned with the pixel grid of the screen
// * Can be fixed by using a higher resolution (super sampling SSAA or fullscreen sampling FSAA)
// * -> 4 times more pixels to render
// * Or multi sampling (MSAA)
// * -> the same but only at the edges
// ! For that (MSAA) it needs to be setup on the renderer during initialization
// ! antialias: true
// ! necessary only for screens with a pixel ratio of 1 - will be activated only for those

// * Shadows
// * Last touch to make the scene look more realistic
renderer.shadowMap.enabled = true;
// * Type of shadow map
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
dirLight.castShadow = true;

// Use a helper to place the light accurately and not render unnecessary shadows
// const dirLightCameraHelper = new THREE.CameraHelper(dirLight.shadow.camera);
// scene.add(dirLightCameraHelper);
dirLight.shadow.camera.far = 15;
// * Only one light so we can afford to increase the shadow map size
dirLight.shadow.mapSize.set(1024, 1024);

// * Sometimes shadows can produce artifacts, such as "shadow acne"
// * i.e. if the model is casting a shadow on itself
// * Can be fixed by increasing the bias until the shadow acne disappears
// * normalBias usually works better for rounded surfaces
// dirLight.shadow.normalBias = 0.05;

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
