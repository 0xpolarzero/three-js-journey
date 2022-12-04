import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef } from 'react';

// !
// * onPointerMissed can be registered on the Canvas
// * so it is fired when none of the other listeners have fired

export default function Experience() {
  const cube = useRef();
  const sphere = useRef();
  useFrame((state, delta) => {
    cube.current.rotation.y += delta * 0.2;
  });

  // * Just need to use a regular click/hover handler
  const onHover = (e, value) => {
    console.log(e);
    e.stopPropagation();
    sphere.current.scale.set(value, value, value);
  };
  const onClick = (e) => {
    e.stopPropagation();
    console.log('click');
  };

  return (
    <>
      <OrbitControls makeDefault />

      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      <mesh
        ref={sphere}
        position-x={-2}
        onClick={onClick}
        onPointerEnter={(e) => {
          document.body.style.cursor = 'pointer';
          onHover(e, 1.5);
        }}
        onPointerLeave={(e) => {
          document.body.style.cursor = 'default';
          onHover(e, 1);
        }}
        // onContextMenu is a right click / long press on mobile
      >
        <sphereGeometry />
        <meshStandardMaterial color='orange' />
      </mesh>

      <mesh
        ref={cube}
        position-x={2}
        scale={1.5}
        onPointerEnter={(e) => e.stopPropagation()}
      >
        <boxGeometry />
        <meshStandardMaterial color='mediumpurple' />
      </mesh>

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color='greenyellow' />
      </mesh>
    </>
  );
}
