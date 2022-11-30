// Automatically handled when using ShaderMaterial
precision mediump float;

// * Retrieve the value passed from the vertex shader
varying float vRandom;
// * Retrieve the uniforms from the vertex shader
uniform vec3 uColor;
varying vec2 vUv;
varying float vElevation;
// * and from the geometry attributes
uniform sampler2D uTexture;

void main() {
  // * gl_FragColor is already declared
  // = verc4(r, g, b, a)
  // a can be transparent but needs to set transparent: true in the material
  //   gl_FragColor = vec4(uColor, 0.8);

  // * Use the texture
  vec4 textureColor = texture2D(uTexture, vUv);
  textureColor.rgb *= vElevation * 2.0 + 0.5;
  gl_FragColor = textureColor;
}