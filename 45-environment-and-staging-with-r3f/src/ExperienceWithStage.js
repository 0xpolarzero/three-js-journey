import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ContactShadows, OrbitControls, Stage } from '@react-three/drei';
import { Perf } from 'r3f-perf';
import { useControls } from 'leva';
import { useRef } from 'react';

// * Use Percent Closer Soft Shadows (PCSS) to soften the shadows
// It will be called once before rendering the scene
// softShadows({
//   frustum: 3.75,
//   size: 0.005,
//   near: 9.5,
//   samples: 17,
//   rings: 11,
// });

export default function ExperienceWithStage() {
  const { color, opacity, blur } = useControls('contact shadows', {
    color: '#1d8f75',
    opacity: { value: 0.4, min: 0, max: 1 },
    blur: { value: 2.8, min: 0, max: 10 },
  });

  //   const { sunPosition } = useControls('sky', {
  //     sunPosition: { value: [1, 2, 3] },
  //   });

  const { envMapIntensity, envMapHeight, envMapRadius, envMapScale } =
    useControls('environment map', {
      envMapIntensity: { value: 7, min: 0, max: 12 },
      envMapHeight: { value: 7, min: 0, max: 100 },
      envMapRadius: { value: 28, min: 10, max: 1000 },
      envMapScale: { value: 100, min: 10, max: 1000 },
    });

  const cube = useRef();
  // * Light helpers
  const dirLight = useRef();
  //   useHelper(dirLight, THREE.DirectionalLightHelper, 0.5, 'hotpink');

  useFrame((state, delta) => {
    cube.current.rotation.y += delta * 0.2;
    const time = state.clock.elapsedTime;
    cube.current.position.x = 2 + Math.sin(time);
  });

  return (
    <>
      <Perf position='top-left' />
      <OrbitControls makeDefault />

      <Stage environment='sunset' preset='soft' intensity={0.3}>
        <ContactShadows opacity={0.1} blur={3} />
        <mesh castShadow position-y={1} position-x={-2}>
          <sphereGeometry />
          <meshStandardMaterial
            color='orange'
            envMapIntensity={envMapIntensity}
          />
        </mesh>

        <mesh castShadow ref={cube} position-y={1} position-x={2} scale={1.5}>
          <boxGeometry />
          <meshStandardMaterial
            color='mediumpurple'
            envMapIntensity={envMapIntensity}
          />
        </mesh>
      </Stage>
    </>
  );
}
