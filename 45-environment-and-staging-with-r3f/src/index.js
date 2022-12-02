import './style.css';
import ReactDOM from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import Experience from './Experience.js';
import ExperienceWithStage from './ExperienceWithStage.js';

const root = ReactDOM.createRoot(document.querySelector('#root'));

// const created = (state) => {
//   state.gl.setClearColor('#131313');
// };
// * or
// const created = (state) => {
//     state.scene.background = new THREE.Color('#131313');
//   };
// * or even better
// ! cf. !

root.render(
  <Canvas
    // activate shadow rendering
    // Desactivate it for ContactShadows
    shadows
    camera={{
      fov: 45,
      near: 0.1,
      far: 200,
      position: [-4, 3, 6],
    }}
    // onCreated={created}
  >
    // ! the better alternative
    {/* <color args={['#131313']} attach='background' /> */}
    {/* <Experience /> */}
    <ExperienceWithStage />
  </Canvas>,
);
