// By default, only one side of a material is visible
// We can use the side property to change this (i.e. to see both sides of a plane)
material.side = THREE.DoubleSide;
// But it means rendering twice as much triangles

// -----
// Reactive to light:
THREE.MeshLambertMaterial;
// -> basic
THREE.MeshPhongMaterial;
material.shininess = 100;
material.specular = new THREE.Color(0x333333);
// -> more realistic + light reflection + can be controled
THREE.MeshStandardMaterial;
material.metalness = 0.7;
material.roughness = 0.2;
// -> uses PBR (Physically Based Rendering)

// -----
// Use ambient occlusion to cast shadows on the texture
// -> needs a second set of UVs to position the texture on the geometry
sphere.geometry.setAttribute(
  'uv2',
  new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2),
);
sphere.material = new THREE.MeshStandardMaterial({
  map: texture,
  aoMap: aoTexture,
  aoMapIntensity: 1,

  // Might need to have more vertices in the geometry:
  displacementMap: displacementTexture, // move vertices to create relief
  displacementScale: 0.1, // how much to move the vertices

  metalnessMap: metalnessTexture,
  roughnessMap: roughnessTexture,

  normalMap: normalTexture,
  normalScale: new THREE.Vector2(0.5, 0.5),

  transparent: true,
  alphaMap: alphaTexture,
});

// -----
// Environment map
// https://threejs-journey.com/lessons/materials#environment-map
// -> use a cube map to simulate reflections of the environment
