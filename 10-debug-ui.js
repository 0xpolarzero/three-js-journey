import * as dat from 'lil-gui';

const parameters = {
  color: 0xff0000,
  spin: () => {
    gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + 10 });
  },
};

// ...

const gui = new dat.GUI({
  width: 400,
});
gui.addColor(parameters, 'color').onChange(() => {
  material.color.set(parameters.color);
});
gui.add(parameters, 'spin');

// ...

scene.add(mesh);
gui.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('elevation');
gui.add(mesh, 'visible');
gui.add(material, 'wireframe');
