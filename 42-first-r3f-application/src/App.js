import { Experience } from './Experience';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';

export const App = () => {
  return (
    <Canvas
      //   orthographic
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [3, 2, 6],
        // We need to zoom since the orthographic camera is too far away
        // zoom: 100,
      }}
      gl={{
        // antialias: false,
        toneMapping: THREE.ACESFilmicToneMapping, // enabled by default
        // Same with default outputEncoding: THREE.sRGBEncoding
      }}
      //   flat // remove the tone mapping
    >
      <Experience />
    </Canvas>
  );
};
