import Sizes from './Utils/Sizes';
import Loop from './Utils/Loop';
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

    this.sizes = new Sizes();
    this.sizes.on('resize', () => {
      this.resize();
    });

    this.loop = new Loop();
    this.loop.on('tick', () => {
      this.update();
    });

    this.scene = new THREE.Scene();
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.world = new World();
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.update();
    this.renderer.update();
  }
}
