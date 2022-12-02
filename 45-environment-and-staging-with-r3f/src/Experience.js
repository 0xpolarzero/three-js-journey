import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import {
  AccumulativeShadows,
  BakeShadows,
  ContactShadows,
  Environment,
  Lightformer,
  OrbitControls,
  RandomizedLight,
  Sky,
  softShadows,
  useHelper,
} from '@react-three/drei';
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

export default function Experience() {
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
      <Environment
        background
        // files={[
        //   './environmentMaps/2/px.jpg',
        //   './environmentMaps/2/nx.jpg',
        //   './environmentMaps/2/py.jpg',
        //   './environmentMaps/2/ny.jpg',
        //   './environmentMaps/2/pz.jpg',
        //   './environmentMaps/2/nz.jpg',
        // ]}
        // * or
        // files='./environmentMaps/the_sky_is_on_fire_2k.hdr'
        // * or
        preset='sunset'
        // We can use a low resolution if using Environment only to cast lights
        // resolution={32}
        ground={{
          height: envMapHeight,
          radius: envMapRadius,
          scale: envMapScale,
        }}
      >
        {/* use a custom color */}
        <color attach='background' args={['#131313']} />
        {/* Use an object to impact the environment */}
        {/* <mesh position-z={-5} scale={10}>
          <planeGeometry />
          Use a color array to go beyond and be able to saturate 
          <meshBasicMaterial color={[10, 0, 0]} />
        </mesh> */}
        {/* With a preset, it becomes part of the environment map */}
        {/* <Lightformer
          position-z={-5}
          scale={5}
          color='red'
          intensity={10}
          form='ring'
        /> */}
      </Environment>

      {/* <Sky sunPosition={sunPosition} /> */}

      <Perf position='top-left' />
      {/* Only render shadows once */}
      {/* <BakeShadows /> */}

      {/* Good for single object but only renders from Y, and very heavy on perfs */}
      <ContactShadows
        position={[0, -0.99, 0]}
        scale={10}
        resolution={512}
        // How far it renders shadows
        far={5}
        color={color}
        opacity={opacity}
        blur={blur}
        // Bake it
        // frames={1}
      />

      <OrbitControls makeDefault />

      {/* <directionalLight
        ref={dirLight}
        castShadow
        position={sunPosition}
        intensity={1.5}
        shadow-mapSize={[1024, 1024]}
        // Default values
        shadow-camera-near={1}
        shadow-camera-far={10}
        shadow-camera-top={5}
        shadow-camera-right={5}
        shadow-camera-bottom={-5}
        shadow-camera-left={-5}
      />
      <ambientLight intensity={0.5} /> */}

      {/* <AccumulativeShadows
        // Move it a little above the floor
        position={[0, -0.99, 0]}
        scale={10} // default
        color='#316d39'
        opacity={0.8}
        // How many shadow renders
        frames={Infinity}
        // Prevent the initial freeze by accumulating during first frames
        temporal
        // Prevent the jumpy effect with maps fading in & out
        blend={100}
      >
        <RandomizedLight
          position={[1, 2, 3]}
          amount={8}
          radius={1}
          ambient={0.5}
          intensity={1}
          bias={0.001}
        />
      </AccumulativeShadows> */}

      <mesh castShadow position-x={-2} position-y={1}>
        <sphereGeometry />
        <meshStandardMaterial
          color='orange'
          envMapIntensity={envMapIntensity}
        />
      </mesh>

      <mesh ref={cube} castShadow position-x={2} position-y={1} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial
          color='mediumpurple'
          envMapIntensity={envMapIntensity}
        />
      </mesh>

      {/* <mesh
        // Don't receive the shadow if we're using AccomulativeShadows
        receiveShadow
        position-y={-1}
        rotation-x={-Math.PI * 0.5}
        scale={10}
      >
        <planeGeometry />
        <meshStandardMaterial
          color='greenyellow'
          envMapIntensity={envMapIntensity}
        />
      </mesh> */}
    </>
  );
}
