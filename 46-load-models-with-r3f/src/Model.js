import { useLoader } from '@react-three/fiber';
import { Clone, useGLTF } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// * To turn the model into a component:
// https://gltf.pmnd.rs/

export const Model = () => {
  // * 'Old' way
  // In GLTF
  // const model = useLoader(GLTFLoader, './hamburger.glb');
  // Draco compressed GLTF
  //   const model = useLoader(
  //     GLTFLoader,
  //     './FlightHelmet/glTF/FlightHelmet.gltf',
  //     (loader) => {
  //       const dracoLoader = new DRACOLoader();
  //       dracoLoader.setDecoderPath('./draco/');
  //       loader.setDRACOLoader(dracoLoader);
  //     },
  //   );
  // * With Drei
  // Same with draco, no need for additional loader
  const model = useGLTF('./FlightHelmet/glTF/FlightHelmet.gltf');
  // ! We can preload it, i.e. if we wand to use it later but have it ready
  useGLTF.preload('./FlightHelmet/glTF/FlightHelmet.gltf');

  return (
    <>
      {/* One instance */}
      {/* <primitive object={model.scene} scale={5} position-y={-1} /> */}
      {/* Or multiple, without impacting the performance */}
      <Clone object={model.scene} scale={5} position-y={-1} position-x={-4} />
      <Clone object={model.scene} scale={5} position-y={-1} position-x={0} />
      <Clone object={model.scene} scale={5} position-y={-1} position-x={4} />
    </>
  );
};
