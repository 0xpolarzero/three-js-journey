// Activate transparency so the particles don't hide each other
particlesMaterial.map = particleTexture;
particlesMaterial.transparent = true;
particlesMaterial.alphaMap = particleTexture;

// Sometimes needs to use alphaTest
particlesMaterial.alphaTest = 0.001;
// Don't write if it's behind another object
particlesMaterial.depthWrite = false;

// -----
// Blending
// If some pixels are in front of each others, add the color of the pixels
particlesMaterial.blending = THREE.AdditiveBlending; // keep depthWrite false
