import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'lil-gui';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';

import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';

const TintShader = {
  uniforms: {
    tDiffuse: { value: null }, // automatically passed in by EffectComposer from the last pass
    uTint: { value: null },
  },
  vertexShader: `
          varying vec2 vUv;

          void main()
          {
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

              vUv = uv;
          }
      `,
  fragmentShader: `
          uniform sampler2D tDiffuse;
          uniform vec3 uTint;
          
          varying vec2 vUv;

          void main()
          {
              vec4 color = texture2D(tDiffuse, vUv);
              color.rgb += uTint;
              gl_FragColor = color;
          }
      `,
};

const DisplacementShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: null },
    uNormalMap: { value: null },
  },
  vertexShader: `
        varying vec2 vUv;

        void main()
        {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

            vUv = uv;
        }
    `,
  fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float uTime;
        uniform sampler2D uNormalMap;

        varying vec2 vUv;

        void main()
        {
            vec3 normalColor = texture2D(uNormalMap, vUv).xyz * 2.0 - 1.0;
            vec2 newUv = vUv + normalColor.xy * 0.1;
            vec4 color = texture2D(tDiffuse, newUv);

            vec3 lightDirection = normalize(vec3(- 1.0, 1.0, 0.0));
            float lightness = clamp(dot(normalColor, lightDirection), 0.0, 1.0);
            color.rgb += lightness * 2.0;

            gl_FragColor = color;
        }
    `,
};

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
const textureLoader = new THREE.TextureLoader();

/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      child.material.envMapIntensity = 2.5;
      child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.jpg',
  '/textures/environmentMaps/0/nx.jpg',
  '/textures/environmentMaps/0/py.jpg',
  '/textures/environmentMaps/0/ny.jpg',
  '/textures/environmentMaps/0/pz.jpg',
  '/textures/environmentMaps/0/nz.jpg',
]);
environmentMap.encoding = THREE.sRGBEncoding;

scene.background = environmentMap;
scene.environment = environmentMap;

/**
 * Models
 */
gltfLoader.load('/models/DamagedHelmet/glTF/DamagedHelmet.gltf', (gltf) => {
  gltf.scene.scale.set(2, 2, 2);
  gltf.scene.rotation.y = Math.PI * 0.5;
  scene.add(gltf.scene);

  updateAllMaterials();
});

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 3, -2.25);
scene.add(directionalLight);

/**
 * Sizes
 */
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

  // * Update effect composer
  effectComposer.setSize(sizes.width, sizes.height);
  effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
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

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 1.5;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Post processing
 */
// * It will hanle all the passes, switching between render targets, etc for us
// const effectComposer = new EffectComposer(renderer);
// ! We want to create our own to be able to handle anti-aliasing
const renderTarget = new THREE.WebGLRenderTarget(sizes.width, sizes.height);
const effectComposer = new EffectComposer(renderer, renderTarget, {
  samples: renderer.getPixelRatio() === 1 ? 2 : 0, // > samples = > anti-aliasing ; useless if the pixel ratio is > 1
});
effectComposer.setSize(sizes.width, sizes.height);
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// the anti-aliasing pass is added at the end

// * Instantiate the first render pass
const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

// * Dot screen pass
const dotScreenPass = new DotScreenPass();
effectComposer.addPass(dotScreenPass);

// * Glitch pass
const glitchPass = new GlitchPass();
effectComposer.addPass(glitchPass);

// * Bloom pass
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5, // strength
  0.4, // radius
  0.85, // threshold
);
bloomPass.threshold = 0;
bloomPass.strength = 1;
bloomPass.radius = 0;
effectComposer.addPass(bloomPass);

// * FXAA pass
const fxaaPass = new ShaderPass(FXAAShader);
fxaaPass.material.uniforms['resolution'].value.x =
  1 / (sizes.width * renderer.getPixelRatio());
fxaaPass.material.uniforms['resolution'].value.y =
  1 / (sizes.height * renderer.getPixelRatio());
effectComposer.addPass(fxaaPass);

// * RGB shift pass
const rgbShiftPass = new ShaderPass(RGBShiftShader);
effectComposer.addPass(rgbShiftPass);

// * Custom pass
const tintPass = new ShaderPass(TintShader);
effectComposer.addPass(tintPass);
tintPass.material.uniforms.uTint.value = new THREE.Vector3();
gui
  .add(tintPass.material.uniforms.uTint.value, 'x')
  .min(-1)
  .max(1)
  .step(0.001)
  .name('red');
gui
  .add(tintPass.material.uniforms.uTint.value, 'y')
  .min(-1)
  .max(1)
  .step(0.001)
  .name('green');
gui
  .add(tintPass.material.uniforms.uTint.value, 'z')
  .min(-1)
  .max(1)
  .step(0.001)
  .name('blue');

const displacementPass = new ShaderPass(DisplacementShader);
displacementPass.material.uniforms.uTime.value = 0;
displacementPass.material.uniforms.uNormalMap.value = textureLoader.load(
  '/textures/interfaceNormalMap.png',
);
effectComposer.addPass(displacementPass);

// ! Using render passes will disable the renderer output encoding
// ! So we need to add a shader pass to fix it
// ! as the last pass
const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
effectComposer.addPass(gammaCorrectionPass);

// ! Anti-aliasing
// https://threejs-journey.com/lessons/post-processing#using-an-antialias-pass
if (renderer.getPixelRatio() === 1 && renderer.capabilities.isWebGL2) {
  const smaaPass = new SMAAPass();
  effectComposer.addPass(smaaPass);
}

dotScreenPass.enabled = false;
glitchPass.enabled = false;
bloomPass.enabled = false;
fxaaPass.enabled = false;
rgbShiftPass.enabled = false;
gammaCorrectionPass.enabled = true;

gui.add(dotScreenPass, 'enabled').name('Dot screen');
gui.add(glitchPass, 'enabled').name('Glitch');

gui.add(bloomPass, 'enabled').name('Bloom');
gui.add(bloomPass, 'threshold').min(0).max(1).step(0.001).name('Threshold');
gui.add(bloomPass, 'strength').min(0).max(3).step(0.001).name('Strength');
gui.add(bloomPass, 'radius').min(0).max(1).step(0.001).name('Radius');

gui.add(fxaaPass, 'enabled').name('FXAA');
gui.add(rgbShiftPass, 'enabled').name('RGB shift');
gui.add(gammaCorrectionPass, 'enabled').name('Gamma correction');

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  displacementPass.material.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  //   renderer.render(scene, camera);
  // * Call the render method of the effect composer instead
  effectComposer.render();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
