import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import {
  Center,
  useMatcapTexture,
  OrbitControls,
  Text3D,
} from '@react-three/drei';
import { Perf } from 'r3f-perf';
import { useEffect } from 'react';
import { useRef } from 'react';

// * Create the donuts geometry and material outside of the component
// * so it's not recreated for each one
const torusGeometry = new THREE.TorusGeometry(1, 0.6, 16, 32);
const material = new THREE.MeshMatcapMaterial();

export default function Experience() {
  // * Matcap materials
  // https://github.com/nidorx/matcaps/blob/master/PAGE-1.md
  //   const [matcapTexture] = useMatcapTexture('7877EE_D87FC5_75D9C7_1C78C0', 256);
  //   const [matcapTexture] = useMatcapTexture('0A0A0A_A9A9A9_525252_747474', 256);
  //   const [matcapTexture] = useMatcapTexture('2E763A_78A0B7_B3D1CF_14F209', 256);
  //   const [matcapTexture] = useMatcapTexture('7B5254_E9DCC7_B19986_C8AC91', 256);
  //   const [matcapTexture] = useMatcapTexture('161B1F_C7E0EC_90A5B3_7B8C9B', 256);
  const [matcapTexture] = useMatcapTexture('736655_D9D8D5_2F281F_B1AEAB', 256);

  const donuts = useRef([]);

  useFrame((state, delta) => {
    donuts.current.forEach((donut, i) => {
      donut.rotation.x = donut.rotation.y += delta * 0.2;
    });
  });

  useEffect(() => {
    matcapTexture.encoding = THREE.sRGBEncoding;
    matcapTexture.needsUpdate = true;
    material.matcap = matcapTexture;
    material.needsUpdate = true;
  }, []);

  return (
    <>
      <Perf position='top-left' />

      <OrbitControls makeDefault />

      <Center>
        <Text3D
          font='./fonts/helvetiker_regular.typeface.json'
          size={0.75}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          polarzero
          <meshMatcapMaterial matcap={matcapTexture} />
        </Text3D>
      </Center>

      {[...Array(100)].map((value, index) => (
        <mesh
          ref={(element) => {
            donuts.current[index] = element;
          }}
          key={index}
          geometry={torusGeometry}
          material={material}
          position={[
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
          ]}
          scale={0.2 + Math.random() * 0.2}
          rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
        />
      ))}
    </>
  );
}
