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
    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = this.current - this.start;

    window.requestAnimationFrame(() => {
      this.tick();
    });

    this.trigger('tick');
  }
}
