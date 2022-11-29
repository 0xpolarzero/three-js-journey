import Sizes from './Utils/Sizes';
import Loop from './Utils/Loop';

export default class World {
  constructor(canvas) {
    this.canvas = canvas;

    this.sizes = new Sizes();
    this.sizes.on('resize', () => {
      this.resize();
    });

    this.loop = new Loop();
  }

  resize() {}
}
