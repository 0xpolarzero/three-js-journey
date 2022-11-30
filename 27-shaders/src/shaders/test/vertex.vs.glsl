// * The attribute created for the geometry
attribute float aRandom;
// * Create the varying to pass the value to the fragment shader
varying float vRandom;
// * The uniform created for the geometry
uniform vec2 uFrequency;
uniform float uTime;

// * This is an attribute from the PlaneGeometry
// * geometry.attributes.uv
// * so already accessible in the vertex shader
varying vec2 vUv;
varying float vElevation;

void main() {
  // gl_Position =
  //     projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  // * Make it longer but easier to understand
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  modelPosition.z += sin(modelPosition.x * 10.0) * 0.1;
  // * Static flag shape
  // modelPosition.z += aRandom * 0.1;
  // * Artifacts shape
  // modelPosition.z += sin(modelPosition.x * uFrequency.x + uTime) * 0.1;
  // modelPosition.z += sin(modelPosition.y * uFrequency.y + uTime) * 0.1;

  // * Setup the elevation to simulate shadows
  float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
  elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;

  modelPosition.z += elevation;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  // gl_Position is already declared
  gl_Position = projectedPosition;

  // * Pass the values to the fragment shader
  vRandom = aRandom;
  vUv = uv;
  vElevation = elevation;
}