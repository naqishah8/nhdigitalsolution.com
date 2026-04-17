'use client';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function WireframeNet() {
  const groupRef = useRef();
  const innerRef = useRef();

  // Icosahedron with subdivisions for a clean "net" mesh
  const sphereGeo = useMemo(() => new THREE.IcosahedronGeometry(2, 4), []);
  const innerGeo = useMemo(() => new THREE.IcosahedronGeometry(1.4, 3), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.x = t * 0.15;
      groupRef.current.rotation.y = t * 0.2;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x = -t * 0.25;
      innerRef.current.rotation.y = -t * 0.18;
    }
  });

  return (
    <group>
      <group ref={groupRef}>
        <lineSegments>
          <edgesGeometry args={[sphereGeo]} />
          <lineBasicMaterial color="#b879fb" transparent opacity={0.85} />
        </lineSegments>
        <points geometry={sphereGeo}>
          <pointsMaterial color="#ffffff" size={0.04} transparent opacity={0.9} sizeAttenuation />
        </points>
      </group>
      <group ref={innerRef}>
        <lineSegments>
          <edgesGeometry args={[innerGeo]} />
          <lineBasicMaterial color="#60a5fa" transparent opacity={0.55} />
        </lineSegments>
      </group>
    </group>
  );
}

export default function HeroCanvas() {
  return (
    <div className="canvas-container">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ powerPreference: 'high-performance', antialias: true, alpha: true }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} color="#b879fb" intensity={1.2} />
        <pointLight position={[-5, -3, 4]} color="#60a5fa" intensity={1} />
        <WireframeNet />
      </Canvas>
      <style jsx>{`
        .canvas-container {
          position: absolute;
          top: 0;
          right: 0;
          width: 50%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }

        @media (max-width: 1024px) {
          .canvas-container {
            width: 100%;
            height: 60%;
            opacity: 0.55;
            top: auto;
            bottom: 0;
          }
        }
      `}</style>
    </div>
  );
}
