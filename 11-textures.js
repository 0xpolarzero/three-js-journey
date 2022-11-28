// -----
// Native JavaScript
const image = new Image();
// Initialize the texture
const textureNativeJs = new THREE.Texture(image);
// Load an image file into the texture
image.onload = () => {
  // Update the texture object with the loaded image data
  textureNativeJs.needsUpdate = true;
};
image.src = '/textures/texture.jpg';

const material = new THREE.MeshBasicMaterial({
  map: textureNativeJs,
});

// -----
// TextureLoader
const loader = new THREE.TextureLoader(); // this instance can load as many textures as we want
const textureLoaded = loader.load(
  '/textures/texture.jpg',
  () => {
    console.log('texture loaded');
  },
  () => {
    console.log('texture loading');
  },
  () => {
    console.log('texture failed to load');
  },
);

// -----
// LoadingManager
const loadingManager = new THREE.LoadingManager();
const loaderWithManager = new THREE.TextureLoader(loadingManager);

loadingManager.onStart = () => {}; // loading started
loadingManager.onLoad = () => {}; // loading finished
loadingManager.onProgress = () => {}; // loading in progress
loadingManager.onError = () => {}; // loading error

const colorTexture = loaderWithManager.load('/textures/texture.jpg');
const alphaTexture = loaderWithManager.load('/textures/alpha.jpg');
// ...

// -----
// -----
// Repeat a texture
// https://threejs-journey.com/lessons/textures#repeat

// Where to find textures?
// https://threejs-journey.com/lessons/textures#where-to-find-textures
