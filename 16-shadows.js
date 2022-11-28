renderer.shadowMap.enabled = true;

sphere.castShadow = true;
sphere.receiveShadow = true;

// Support shadows: PointLight, SpotLight, DirectionalLight
directionalLight.castShadow = true;

// Improve the shadow quality - here needs 4x more memory (default is 512x512)
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;

// Shadows are rendered using cameras
// It can be bugged because of the camera's near and far
// Helpers
const dirLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera,
);
scene.add(dirLightCameraHelper);
dirLightCameraHelper.visible = false;
// Find a value that fits the scene
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 1000;

// DirectionalLight -> OrthographicCamera
directionalLight.shadow.camera.left = -2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.bottom = -2;
// SpotLight -> PerspectiveCamera
spotLight.shadow.camera.fov = 30;
// PointLight -> PerspectiveCamera
// But facing all directions so 6 renders

// Blur
directionalLight.shadow.radius = 10; // general and cheap blur

// Various shadow maps algorithms
// https://threejs-journey.com/lessons/shadows#shadow-map-algorithm
// default THREE.PCFShadowMap
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Better but more expensive & no radius blur

// Or bake shadows into the texture
// https://threejs-journey.com/lessons/shadows#baking-shadows

// Baked texture can also be animated to follow the object
// https://threejs-journey.com/lessons/shadows#baking-shadows-alternative
