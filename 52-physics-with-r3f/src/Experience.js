import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import {
  Debug,
  RigidBody,
  Physics,
  CuboidCollider,
  InstancedRigidBodies,
} from '@react-three/rapier';
import { Perf } from 'r3f-perf';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useMemo } from 'react';
export default function Experience() {
  // ! To move objects, avoid using position/rotation
  // ! instead there are forces and kinematic

  const cubesCount = 1000;
  const cubeTransforms = useMemo(() => {
    const positions = [];
    const rotations = [];
    const scales = [];

    for (let i = 0; i < cubesCount; i++) {
      positions.push([
        (Math.random() - 0.5) * 8,
        6 + i * 0.2,
        (Math.random() - 0.5) * 8,
      ]);
      rotations.push([Math.random(), Math.random(), Math.random()]);

      const scale = 0.2 + Math.random() * 0.8;
      scales.push([scale, scale, scale]);
    }

    return { positions, rotations, scales };
  }, []);
  const cubes = useRef();

  const sphere = useRef();
  const twister = useRef();
  const twisterMesh = useRef();

  const sphereJump = () => {
    sphere.current.applyImpulse({ x: 0, y: 5 * sphere.current.mass(), z: 0 });
    sphere.current.applyTorqueImpulse({
      x: Math.random() - 0.5,
      y: Math.random() - 0.5,
      z: Math.random() - 0.5,
    });

    // Access the mass
    console.log(sphere.current.mass());
  };

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Rotation
    const eulerRotation = new THREE.Euler(0, time * 3, 0);
    const quaternionRotation = new THREE.Quaternion();
    quaternionRotation.setFromEuler(eulerRotation);
    twister.current.setNextKinematicRotation(quaternionRotation);

    // Position
    const x = Math.cos(time) * 2;
    const z = Math.sin(time) * 2;
    twister.current.setNextKinematicTranslation({ x: x, y: -0.8, z: z });
  });

  return (
    <>
      <Perf position='top-left' />

      <OrbitControls makeDefault />

      <directionalLight castShadow position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      <Physics gravity={[0, -9.81, 0]}>
        {/* <Debug /> */}

        <RigidBody ref={sphere} colliders='ball'>
          <mesh castShadow position={[0, 4, 0]} onClick={sphereJump}>
            <sphereGeometry />
            <meshStandardMaterial color='orange' />
          </mesh>
        </RigidBody>

        {/* <RigidBody colliders='hull'> */}
        {/* Trimesh more accurate but more difficult to detect collision */}
        {/* so more prone to bug (especially with moving bodies) */}
        <RigidBody colliders='trimesh' gravityScale={1} friction={0.7}>
          <mesh
            castShadow
            position={[0, 1, -0.25]}
            rotation={[Math.PI * 0.1, 0, 0]}
          >
            <torusGeometry args={[1, 0.5, 16, 32]} />
            <meshStandardMaterial color='mediumpurple' />
          </mesh>
        </RigidBody>

        {/* With custom collider */}
        <RigidBody
          colliders={false}
          position={[4, 1, -0.25]}
          rotation={[Math.PI * 0.1, 0, 0]}
          // Bounciness (default 0)
          restitution={2}
        >
          <CuboidCollider args={[1.5, 1.5, 0.5]} mass={5} />
          <mesh castShadow>
            <torusGeometry args={[1, 0.5, 16, 32]} />
            <meshStandardMaterial color='mediumpurple' />
          </mesh>
        </RigidBody>

        <RigidBody
          type='fixed'
          // default 0.7
          friction={0.7}
        >
          <mesh receiveShadow position-y={-1.25}>
            <boxGeometry args={[10, 0.5, 10]} />
            <meshStandardMaterial color='greenyellow' />
          </mesh>
        </RigidBody>

        <RigidBody
          ref={twister}
          position={[0, -0.8, 0]}
          friction={0}
          type='kinematicPosition'
          onCollisionEnter={() =>
            twisterMesh.current.material.color.set('blue')
          }
          onCollisionExit={() => twisterMesh.current.material.color.set('red')}
        >
          <mesh ref={twisterMesh} castShadow scale={[0.4, 0.4, 3]}>
            <boxGeometry />
            <meshStandardMaterial color='red' />
          </mesh>
        </RigidBody>

        <InstancedRigidBodies
          positions={cubeTransforms.positions}
          rotations={cubeTransforms.rotations}
          scales={cubeTransforms.scales}
        >
          <instancedMesh
            ref={cubes}
            receiveShadow
            castShadow
            args={[null, null, cubesCount]}
          >
            <boxGeometry />
            <meshStandardMaterial color='lightblue' />
          </instancedMesh>
        </InstancedRigidBodies>

        {/* Invisible walls */}
        <RigidBody type='fixed'>
          <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, 5.5]} />
          <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, -5.5]} />
          <CuboidCollider args={[0.5, 2, 5]} position={[5.5, 1, 0]} />
          <CuboidCollider args={[0.5, 2, 5]} position={[-5.5, 1, 0]} />
        </RigidBody>
      </Physics>
    </>
  );
}
