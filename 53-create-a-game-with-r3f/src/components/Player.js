import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { RigidBody, useRapier } from '@react-three/rapier';
import { useEffect, useRef, useState } from 'react';
import useGame from '../stores/useGame';

export const Player = () => {
  const ballBody = useRef();
  const [smoothedCameraPosition] = useState(
    () => new THREE.Vector3(10, 10, 10),
  );
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3());
  const [sub, getKeys] = useKeyboardControls();
  const { rapier, world } = useRapier();

  const start = useGame((state) => state.start);
  const restart = useGame((state) => state.restart);
  const end = useGame((state) => state.end);
  const blocksCount = useGame((state) => state.blocksCount);

  const reset = () => {
    ballBody.current.setTranslation({ x: 0, y: 1, z: 0 });
    ballBody.current.setLinvel({ x: 0, y: 0, z: 0 });
    ballBody.current.setAngvel({ x: 0, y: 0, z: 0 });
  };

  useFrame((state, delta) => {
    // Controls
    const { forward, backward, leftward, rightward } = getKeys();
    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };
    const impulseStrength = 0.6 * delta;
    const torqueStrength = 0.2 * delta;

    if (forward) {
      impulse.z -= impulseStrength;
      torque.x -= torqueStrength;
    }
    if (backward) {
      impulse.z += impulseStrength;
      torque.x += torqueStrength;
    }
    if (rightward) {
      impulse.x += impulseStrength;
      torque.z -= torqueStrength;
    }
    if (leftward) {
      impulse.x -= impulseStrength;
      torque.z += torqueStrength;
    }

    ballBody.current.applyImpulse(impulse);
    ballBody.current.applyTorqueImpulse(torque);

    // Camera
    const ballPosition = ballBody.current.translation();
    // Position
    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(ballPosition);
    cameraPosition.z += 2.25;
    cameraPosition.y += 0.65;
    // Rotation
    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(ballPosition);
    cameraTarget.y += 0.25;

    smoothedCameraPosition.lerp(cameraPosition, 5 * delta);
    smoothedCameraTarget.lerp(cameraTarget, 5 * delta);

    state.camera.position.copy(smoothedCameraPosition);
    state.camera.lookAt(smoothedCameraTarget);

    // Game
    if (ballPosition.z < -(blocksCount * 4 + 2)) end();
    if (ballPosition.y < -4) restart();
  });

  useEffect(() => {
    // Use subscribeWithSelector to know when space is pressed
    const unsubscribeJump = sub(
      (state) => state.jump,
      (space) => {
        if (space) {
          // Make sure it's not already jumping
          const origin = ballBody.current.translation();
          origin.y -= 0.31;
          const direction = { x: 0, y: -1, z: 0 };
          const ray = new rapier.Ray(origin, direction);
          const hit = world.raw().castRay(ray, 10, true);

          if (hit.toi < 0.15) {
            ballBody.current.applyImpulse({ x: 0, y: 0.5, z: 0 });
          }
        }
      },
    );

    const unsubscribeAny = sub(() => start());

    const unsubscribeReset = useGame.subscribe(
      (state) => state.phase,
      (value) => {
        if (value === 'ready') {
          reset();
        }
      },
    );

    return () => {
      unsubscribeJump();
      unsubscribeAny();
      unsubscribeReset();
    };
  }, []);

  return (
    <RigidBody
      ref={ballBody}
      colliders='ball'
      position={[0, 1, 0]}
      restitution={0.2}
      friction={1}
      // Don't move indefinitely
      linearDamping={0.5}
      angularDamping={0.5}
    >
      <mesh castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial flatShading color='mediumpurple' />
      </mesh>
    </RigidBody>
  );
};
