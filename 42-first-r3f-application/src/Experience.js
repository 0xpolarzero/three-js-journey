import { CustomObject } from './CustomObject';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { extend, useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';

// Convert a three.js class to a react-three-fiber component
extend({ OrbitControls });

export const Experience = () => {
  // Get access to Three.js elements
  const { camera, gl } = useThree();
  const cubeRef = useRef();
  const groupRef = useRef();

  useFrame((state, delta) => {
    // Use delta to keep the same speed regardless of the frame rate
    cubeRef.current.rotation.y += delta;
    // groupRef.current.rotation.y += delta;

    // const angle = state.clock.getElapsedTime();
    // state.camera.position.x = Math.sin(angle) * 8;
    // state.camera.position.z = Math.cos(angle) * 8;
    // state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      {/* Now that it's been converted, we can use it the usual way */}
      {/* and pass the Three.js elements we grabbed */}
      <orbitControls args={[camera, gl.domElement]} />
      <directionalLight position={[1, 10, 3]} intensity={1.5} />
      <ambientLight intensity={0.3} />
      <CustomObject />
      <group ref={groupRef}>
        <mesh
          ref={cubeRef}
          position={[2, 0, 0]}
          rotation-y={Math.PI * 0.25}
          scale={1.5}
        >
          <boxGeometry />
          <meshStandardMaterial color='mediumpurple' />
        </mesh>
        <mesh position={[-2, 0, 0]} rotation-y={Math.PI * 0.25} scale={1}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color='orange' />
        </mesh>
      </group>
      <mesh
        position={[0, -1, 0]}
        rotation-x={-Math.PI * 0.5}
        scale={[10, 10, 1]}
      >
        <planeGeometry />
        <meshStandardMaterial color='greenyellow' />
      </mesh>
    </>
  );
};
