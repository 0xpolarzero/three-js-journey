import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import testVertexShaderRaw from './shaders/test/rawVertex.vs.glsl';
import testFragmentShaderRaw from './shaders/test/rawFragment.fs.glsl';
import testVertexShader from './shaders/test/vertex.vs.glsl';
import testFragmentShader from './shaders/test/fragment.fs.glsl';

/**
 * Base ------------------------------------------------
 */
// Debug
const gui = new dat.GUI();
// Canvas
const canvas = document.querySelector('canvas.webgl');
// Scene
const scene = new THREE.Scene();
// Textures
const textureLoader = new THREE.TextureLoader();
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
// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.set(0.25, -0.25, 1);
scene.add(camera);
// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
/**
 * ------------------------------------------------------------
 * End base
 */

// Objects
const flagTexture = textureLoader.load('/textures/flag-french.jpg');
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);

const count = geometry.attributes.position.count;
const randoms = new Float32Array(count);
for (let i = 0; i < count; i++) {
  randoms[i] = Math.random();
}

// We will use that attribute in the shader as 'aRandom'
// 1st parameter is the name of the attribute
// 2nd parameter is the array of values (i.e. would be 3 if we had a vec3)
geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

// const material = new THREE.RawShaderMaterial({
//   vertexShader: testVertexShaderRaw,
//   fragmentShader: testFragmentShaderRaw,
//   transparent: true,
//   wireframe: true,
//   uniforms: {
//     uTime: { value: 0 },
//     uFrequency: { value: new THREE.Vector2(10, 5) },
//     uColor: { value: new THREE.Color('purple') },
//     uTexture: { value: flagTexture },
//   },
// });
const material = new THREE.ShaderMaterial({
  vertexShader: testVertexShader,
  fragmentShader: testFragmentShader,
  transparent: true,
  wireframe: true,
  uniforms: {
    uTime: { value: 0 },
    uFrequency: { value: new THREE.Vector2(10, 5) },
    uColor: { value: new THREE.Color('purple') },
    uTexture: { value: flagTexture },
  },
});
const mesh = new THREE.Mesh(geometry, material);
mesh.scale.y = 2 / 3;
scene.add(mesh);

gui
  .add(material.uniforms.uFrequency.value, 'x')
  .min(0)
  .max(20)
  .step(0.01)
  .name('frequencyX');
gui
  .add(material.uniforms.uFrequency.value, 'y')
  .min(0)
  .max(20)
  .step(0.01)
  .name('frequencyY');

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update material
  material.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
