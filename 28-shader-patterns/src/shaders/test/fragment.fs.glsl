// Declare the precision to make the linter happy
precision mediump float;
#define PI 3.14159265359

varying vec2 vUv;

void main() {
  vec3 blackColor = vec3(0.0);
  vec3 uvColor = vec3(vUv, 1.0);
  vec3 mixedColor = mix(blackColor, uvColor, strength);

  float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;
  float strength = mod(angle * 20.0, 1.0);

  gl_FragColor = vec4(vec3(strength), 1.0);
}