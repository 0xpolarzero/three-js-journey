import {
  Float,
  Html,
  MeshReflectorMaterial,
  OrbitControls,
  PivotControls,
  Text,
  TransformControls,
} from '@react-three/drei';
import { useRef } from 'react';

export default function Experience() {
  const sphereRef = useRef();
  const cubeRef = useRef();

  return (
    <>
      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />
      {/* Need to makeDefault so it doesn't move when scaling the mesh with TransformControls */}
      <OrbitControls makeDefault />

      <Float speed={5} floatIntensity={2}>
        <Text
          font='./bangers-v20-latin-regular.woff'
          fontSize={1}
          color='salmon'
          // Same parameters as any object
          position={[0, 2, 0]}
          // and others
          maxWidth={2}
          textAlign='center'
        >
          Hey there!
          {/* <meshStandardMaterial /> */}
        </Text>
      </Float>

      <mesh ref={sphereRef} position-x={-2}>
        <sphereGeometry />
        <meshStandardMaterial color='orange' />
        <Html
          position={[0, 2, 0]}
          wrapperClass='label'
          center
          // Simulate perspective
          distanceFactor={8}
          // Hide behind other objects
          occlude={[cubeRef, sphereRef]}
        >
          On the sphere
        </Html>
      </mesh>
      {/* mode 'translate', 'rotate' or 'scale' */}
      <TransformControls object={sphereRef} mode='translate' />

      <PivotControls
        //   Place it at the center of the cube
        anchor={[0, 0, 0]}
        // Show it even if behind the cube
        depthTest={false}
        // Other parameters for the pivot
        lineWidth={4}
        axisColors={['#9381ff', '#ff4d6d', '#7ae582']}
        scale={2}
      >
        <mesh ref={cubeRef} position-x={2} scale={1.5}>
          <boxGeometry />
          <meshStandardMaterial color='mediumpurple' />
        </mesh>
      </PivotControls>

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <MeshReflectorMaterial
          resolution={512}
          color='#131313'
          blur={[1000, 1000]}
          mixBlur={1}
          // Make the reflection clearer
          mirror={0.5}
        />
      </mesh>
    </>
  );
}
