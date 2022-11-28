// Sky color, ground color, intensity
const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);

// Color, intensity, distance, decay (how it fades)
const pointLight = new THREE.PointLight(0xffffff, 0.5, 10, 2);

// Color, intensity, width of rectangle, height of rectangle
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
// can be used to create a spotlight effect like in cinema
rectAreaLight.lookAt(new THREE.Vector3());

// Color, intensity, distance, angle of cone, penumbra (how much of the light is spread out), decay
const spotLight = new THREE.SpotLight(
  0xff0000,
  0.5,
  10,
  Math.PI * 0.1,
  0.25,
  1,
);
// can look at a target, but that target must be in the scene
spotLight.target.position.x = -5;
// ...
scene.add(spotLight.target);

// -----
// Minimal cost:
// - AmbientLight
// - HemisphereLight

// Moderate cost:
// - DirectionalLight
// - PointLight

// High cost:
// - SpotLight
// - RectAreaLight

// -----
// The lights can be baked into the scene, so that they are not rendered in real time
// i.e. with Blender

// -----
// Helpers
// RectAreaLightHelper needs to be imported
// import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
