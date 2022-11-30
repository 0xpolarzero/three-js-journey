// * Performance tips
// https://threejs-journey.com/lessons/performance-tips

// * Monitor FPS
// Using stats.js

// * Think about disposing of anything that's not needed anymore

// ! Lights
// * Cheapest lights:
// - AmbientLight
// - DirectionalLight
// * Avoid adding/removing lights since it causes all supporting materials
// * to be recompiled

// ! Shadows
// * Avoid using shadows if possible ; alternatives like baked shadows
// * Optimize shadow maps
// -> make them fit perfectly to the scene (CameraHelper)
// -> use the smallest possible resolution with a good result (shadow.mapSize)
// * Same with receiveShadow/castShadow to not abuse
// * Deactivate shadow auto update and update it when needed
renderer.shadowMap.autoUpdate = false;
renderer.shadowMap.needsUpdate = true;

// ! Textures
// * Use the smallest possible resolution
// * Keep a power of 2

// ! Geometries
// * Don't update the vertices of a geometry after creation
// * Use a vertex shader to move vertices instead
// * Merge geometries if possible
// https://threejs-journey.com/lessons/performance-tips#19-merge-geometries

// * Mutualize geometries and materials
// * Use the cheapest materials

// ! Cameras
// * Use the smallest possible field of view (objects not visible are not rendered)
// * Same with near and far

// ! Renderer
// * Use the smallest possible pixel ratio (> 2 is not needed)
// * Only add anti-aliasing if there are visible issues

// ! Post-processing
// * Use the smallest possible passes, and regroup them if possible

// ! Shaders
// * Specify the precision of the shader for a lower one if it doesn't lower the quality
// * Avoid if statements
// * Use textures instead of noise functions if possible
// * Use defines to avoid unnecessary calculations ; can be set in the ShaderMaterial properties
defines: {
  USE_MAP: true; // if ShaderMaterial it's automatically added
}
// * If possible, do the calculations in the vertex shader and pass the result to the fragment shader
