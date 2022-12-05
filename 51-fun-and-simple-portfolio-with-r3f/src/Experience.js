import {
  Center,
  ContactShadows,
  Environment,
  Float,
  Html,
  PresentationControls,
  Sparkles,
  useGLTF,
} from '@react-three/drei';

export default function Experience() {
  const laptop = useGLTF(
    'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf',
  );
  return (
    <>
      <color args={['#444444']} attach='background' />
      {/* <Environment preset='city' /> */}
      {/* <OrbitControls makeDefault maxPolarAngle={Math.PI / 2} /> */}

      <Environment preset='city' />
      <PresentationControls
        global
        rotation={[0.13, 0.1, 0]}
        polar={[-0.4, 0.2]}
        azimuth={[-1, 0.75]}
        config={{ mass: 2, tension: 400 }}
        snap={{ mass: 4, tension: 400 }}
      >
        <Float rotationIntensity={0.3}>
          <primitive object={laptop.scene} position-y={-1.2}>
            <Html
              transform
              wrapperClass='html-screen'
              distanceFactor={1.17}
              position={[0, 1.56, -1.4]}
              rotation-x={-0.256}
            >
              <iframe src='https://polarzero.xyz/' />
            </Html>
          </primitive>

          <rectAreaLight
            width={2.5}
            height={1.65}
            intensity={65}
            // Have a dynamic color

            color={'#ff6900'}
            rotation={[-0.1, Math.PI, 0]}
            position={[0, 0.55, -1.15]}
          />
        </Float>
      </PresentationControls>

      <Sparkles
        count={100}
        // Extend the area
        scale={[6, 6, 6]}
        speed={0.5}
        size={2}
      />

      <ContactShadows opacity={0.4} scale={5} blur={2.4} />
    </>
  );
}
