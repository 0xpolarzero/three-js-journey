import {
  Bloom,
  EffectComposer,
  Glitch,
  Noise,
  Vignette,
} from '@react-three/postprocessing';
import { OrbitControls } from '@react-three/drei';
import { BlendFunction, GlitchMode } from 'postprocessing';
import { Perf } from 'r3f-perf';

export default function Experience() {
  return (
    <>
      <EffectComposer>
        {/* <Vignette
          offset={0.3}
          darkness={0.9}
          blendFunction={BlendFunction.NORMAL}
        /> */}

        {/* <Glitch
          delay={[0.5, 1]}
          duration={[0.1, 0.3]}
          strength={[0.2, 0.4]}
          mode={GlitchMode.CONSTANT_MILD}
        /> */}

        {/* <Noise
          // Multiply the noise with the input color before applying the blending.
          premultiply
          blendFunction={BlendFunction.AVERAGE}
        /> */}

        {/* Need to deactivate the tone mapping on objects so the colors are not clamped */}
        <Bloom mipmapBlur intensity={0.5} />
      </EffectComposer>

      {/* Might need to add a background, if it's transparent, effects won't render on it */}
      <color args={['#131313']} attach='background' />

      <Perf position='top-left' />

      <OrbitControls makeDefault />

      <directionalLight castShadow position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      <mesh castShadow position-x={-2}>
        <sphereGeometry />
        <meshStandardMaterial
          color='orange'
          emissive='orange'
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      <mesh castShadow position-x={2} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color={[4, 1, 2]} toneMapped={false} />
      </mesh>

      <mesh
        receiveShadow
        position-y={-1}
        rotation-x={-Math.PI * 0.5}
        scale={10}
      >
        <planeGeometry />
        <meshBasicMaterial color={[1.5, 1, 4]} toneMapped={false} />
      </mesh>
    </>
  );
}
