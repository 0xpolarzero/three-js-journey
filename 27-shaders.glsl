// * Types
// Floats: always provide the decimals
float foo = 1.0;
// Integers: same but without the decimals
int foo = 1;
// -> can't be mixed but can be converted
float c = a float(b);
// Booleans
bool foo = true;
// Vector 2
vec2 foo = vec2(1.0, 2.0);
// -> can be changed after
foo.x = 2.0;
foo *= 2.0;
// Vector 3
vec3 foo = vec3(1.0, 2.0, 3.0);
// -> works well with 3D coordinates or rgb colors
// -> can be created from a vec2
vec3 bar = vec3(foo, 3.0);
// -> or the other way around
vec2 bar = foo.xy;
// Vector 4
vec4 foo = vec4(1.0, 2.0, 3.0, 4.0);
// Also mat2, mat3, mat4, sampler2D...

// * Functions
// Need to declare the type of the return value
float foo(float a, float b) { return a + b; }
// Or void if it doesn't return anything
void foo() {
  float a = 1.0;
  float b = 2.0;
}

// * Attributes
// https://threejs-journey.com/lessons/shaders#attributes

// * Uniforms
// https://threejs-journey.com/lessons/shaders#uniforms

// * Constants
#define PI 3.14159265359 // cheaper than using a variable

// * Shader patterns
// https://threejs-journey.com/lessons/shader-patterns