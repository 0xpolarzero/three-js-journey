// Utils / systems
import Debug from './Utils/Debug';
import Sizes from './Utils/Sizes';
import Loop from './Utils/Loop';
import Resources from './Utils/Resources';
import sources from './sources';
// Components
import Camera from './Camera';
import Renderer from './Renderer';
import World from './World/World';
import * as THREE from 'three';

// * Use a singleton
// * -> there will be only one instance of the class, the rest can be
// *    passed freely around
let instance = null;

export default class Experience {
  constructor(canvas) {
    // Singleton
    if (instance) {
      return instance;
    }
    instance = this;

    this.canvas = canvas;
    this.debug = new Debug();
    this.sizes = new Sizes();
    this.loop = new Loop();
    this.scene = new THREE.Scene();
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.resources = new Resources(sources);
    this.world = new World();

    this.sizes.on('resize', () => {
      this.resize();
    });

    this.loop.on('tick', () => {
      this.update();
    });
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.update();
    this.world.update();
    this.renderer.update();
  }

  destroy() {
    this.sizes.off('resize');
    this.loop.off('tick');

    this.scene.traverse((child) => {
      // Test if it's a mesh
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();

        // Loop through the material properties
        for (const key in child.material) {
          const value = child.material[key];

          // Test if there is a dispose function
          if (value && typeof value.dispose === 'function') {
            value.dispose();
          }
        }
      }
    });

    this.camera.controls.dispose();
    this.renderer.instance.dispose();

    if (this.debug.active) {
      this.debug.ui.destroy();
    }
  }
}
