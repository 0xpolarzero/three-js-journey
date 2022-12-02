import { OrbitControls } from '@react-three/drei';
import { button, useControls } from 'leva';
import { Perf } from 'r3f-perf';

export default function Experience() {
  const { position, color, visible, perfVisible } = useControls('sphere', {
    position: {
      value: { x: -2, y: 0 },
      min: -5,
      max: 5,
      step: 0.1,
      joystick: 'invertY',
    },
    color: 'red',
    visible: true,
    clickMe: button(() => console.log('ok')),
    perfVisible: true,

    choice: { options: ['a', 'b', 'c'], value: 'a' },
  });
  return (
    <>
      {perfVisible && <Perf position='top-left' />}
      <OrbitControls makeDefault />

      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      <mesh position={[position.x, position.y, 0]}>
        <sphereGeometry />
        <meshStandardMaterial visible={visible} color={color} />
      </mesh>

      <mesh position-x={2} scale={1.5}>
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
