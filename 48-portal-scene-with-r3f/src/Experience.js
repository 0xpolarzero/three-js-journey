import portalVertexShader from './shaders/portal/vertex.js';
import portalFragmentShader from './shaders/portal/fragment.js';
import * as THREE from 'three';
import {
  Center,
  shaderMaterial,
  OrbitControls,
  Sparkles,
  useGLTF,
  useTexture,
} from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import { useRef } from 'react';

const PortalMaterial = shaderMaterial(
  // * Provide uniforms without the value property
  {
    uTime: 0,
    uColorStart: new THREE.Color('#ffffff'),
    uColorEnd: new THREE.Color('#000000'),
  },
  // * Provide shaders
  portalVertexShader,
  portalFragmentShader,
);

// * Extend it
extend({ PortalMaterial });
// * Now we get a <portalMaterial /> component

export default function Experience() {
  const { nodes } = useGLTF('./model/portal.glb');
  const bakedTexture = useTexture('./model/baked.jpg');
  bakedTexture.flipY = false;

  const portalMaterialRef = useRef();
  useFrame((state, delta) => {
    portalMaterialRef.current.uTime += delta;
  });

  return (
    <>
      <color args={['#242424']} attach='background' />

      <Center>
        {/* Texture */}
        <mesh geometry={nodes.baked.geometry}>
          <meshBasicMaterial map={bakedTexture} />

          {/* Portal */}
          <mesh
            geometry={nodes.portalLight.geometry}
            position={nodes.portalLight.position}
            rotation={nodes.portalLight.rotation}
          >
            <portalMaterial ref={portalMaterialRef} />
          </mesh>

          {/* Lights */}
          <mesh
            geometry={nodes.poleLightA.geometry}
            position={nodes.poleLightA.position}
          >
            <meshBasicMaterial color='#ffffe5' />
          </mesh>
          <mesh
            geometry={nodes.poleLightB.geometry}
            position={nodes.poleLightB.position}
          >
            <meshBasicMaterial color='#ffffe5' />
          </mesh>
        </mesh>

        {/* Fireflies */}
        <Sparkles
          count={40}
          size={6}
          scale={[4, 2, 4]}
          position-y={1}
          speed={0.2}
        />
      </Center>

      <OrbitControls makeDefault />
    </>
  );
}
