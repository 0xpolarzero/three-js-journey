import './style.css';
import * as THREE from 'three';
import * as dat from 'lil-gui';
import gsap from 'gsap';

/**
 * Debug
 */
const gui = new dat.GUI();

const parameters = {
  materialColor: '#ffeded',
  particlesCount: 200,
};

gui.addColor(parameters, 'materialColor').onChange(() => {
  material.color.set(parameters.materialColor);
  particlesMaterial.color.set(parameters.materialColor);
});

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg');
// gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;

/**
 * Objects
 */
// Material
const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradientTexture,
});

// Mesh
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material,
);
const updatables = [mesh1, mesh2, mesh3];

const objectsDistance = 4;
mesh1.position.y = objectsDistance * 0;
mesh2.position.y = objectsDistance * -1;
mesh3.position.y = objectsDistance * -2;

mesh1.position.x = 2;
mesh2.position.x = -2;
mesh3.position.x = 2;

scene.add(mesh1, mesh2, mesh3);

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 0.7);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

/**
 * Particles
 */
const positions = new Float32Array(parameters.particlesCount * 3);
const particlesGeometry = new THREE.BufferGeometry();
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.01,
  sizeAttenuation: true,
  color: parameters.materialColor,
});

particlesGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(positions, 3),
);

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

for (let i = 0; i < parameters.particlesCount * 3; i++) {
  positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
  positions[i * 3 + 1] =
    objectsDistance * 0.5 - Math.random() * objectsDistance * updatables.length;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
}

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
});

/**
 * Camera
 */
// ! We need to put the camera in a group, cause we're applying 2 updates to it
//!  so we need to apply the same updates to the group
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.z = 6;
cameraGroup.add(camera);

/**
 * Scroll
 */
let scrollY = window.scrollY;
let currentSection = 0;

window.addEventListener('scroll', () => {
  scrollY = window.scrollY;
  const newSection = Math.round(scrollY / sizes.height);

  if (newSection !== currentSection) {
    currentSection = newSection;

    gsap.to(updatables[currentSection].rotation, {
      duration: 1,
      ease: 'power2.inOut',
      x: '+=2',
      y: '+=3',
      z: '+=1',
    });
  }
});

/**
 * Mouse
 */
const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = -(event.clientY / sizes.height - 0.5);
});

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearAlpha(0);

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Update objects
  updatables.forEach((object) => {
    object.rotation.x += deltaTime * 0.1;
    object.rotation.y += deltaTime * 0.12;
  });

  // Update camera
  camera.position.y = (-scrollY / sizes.height) * objectsDistance;

  // Use some easing so it feels more natural
  // It will move 1/10th of the distance between the current position and the target position
  const parallaxX = cursor.x * 0.3;
  const parallaxY = cursor.y * 0.3;

  cameraGroup.position.x +=
    (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
  cameraGroup.position.y +=
    (parallaxY - cameraGroup.position.y) * 5 * deltaTime;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
