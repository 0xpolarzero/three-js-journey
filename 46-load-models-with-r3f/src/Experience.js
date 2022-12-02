import { Model } from './Model';
import { Placeholder } from './Placeholder';
import { Hamburger } from './Hamburger';
import { Fox } from './Fox';
import { OrbitControls } from '@react-three/drei';
import { Perf } from 'r3f-perf';
import { Suspense } from 'react';

export default function Experience() {
  return (
    <>
      {/* Use suspense to display the rest, and only render that component when it's ready
          This was it doesn't need to wait to dosplay the whole canvas */}
      <Suspense fallback={<Placeholder position-y={0.5} scale={[2, 3, 2]} />}>
        {/* <Model /> */}
        <Hamburger scale={0.35} />
      </Suspense>

      <Fox />

      <Perf position='top-left' />

      <OrbitControls makeDefault />

      <directionalLight
        castShadow
        position={[1, 2, 3]}
        intensity={1.5}
        // To fix the burger casting a shadow on itself
        shadow-normalBias={0.04}
      />
      <ambientLight intensity={0.5} />

      <mesh
        receiveShadow
        position-y={-1}
        rotation-x={-Math.PI * 0.5}
        scale={10}
      >
        <planeGeometry />
        <meshStandardMaterial color='greenyellow' />
      </mesh>
    </>
  );
}
