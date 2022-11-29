import EventEmitter from './EventEmitter';

export default class Loop extends EventEmitter {
  constructor() {
    super();

    this.start = Date.now(); // beginning of the experience
    this.current = this.start;
    this.elapsed = 0; // time since the beginning of the experience
    this.delta = 16; // ms between 2 frames

    window.requestAnimationFrame(() => {
      this.tick();
    });
  }

  tick() {
    window.requestAnimationFrame(() => {
      this.tick();
    });
  }
}
