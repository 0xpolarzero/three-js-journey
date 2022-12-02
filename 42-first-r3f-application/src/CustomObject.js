import * as THREE from 'three';
import { useEffect, useMemo, useRef } from 'react';

export const CustomObject = () => {
  const geometryRef = useRef();

  const verticesCount = 10 * 3; // 10 triangles & 3 points per triangle

  // Use memo so it doesn't get re-created on every component change
  // i.e. the parent component Experience
  const positions = useMemo(() => {
    const pos = new Float32Array(verticesCount * 3);
    for (let i = 0; i < verticesCount * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 3;
    }

    return pos;
  }, []);

  useEffect(() => {
    // When it's defined, compute the normals so it can be lit
    geometryRef.current.computeVertexNormals();
  }, [positions]);

  return (
    <mesh>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach='attributes-position'
          count={verticesCount}
          itemSize={3}
          array={positions}
        />
      </bufferGeometry>
      <meshStandardMaterial color='red' side={THREE.DoubleSide} />
    </mesh>
  );
};
