'use client';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, MeshDistortMaterial } from '@react-three/drei';

function MorphingSphere({ position, color, speed, distort, size }) {
  const ref = useRef();
  useFrame((state) => {
    ref.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
    ref.current.rotation.z = state.clock.elapsedTime * speed * 0.2;
  });
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh ref={ref} position={position} scale={size}>
        <icosahedronGeometry args={[1, 8]} />
        <MeshDistortMaterial
          color={color}
          distort={distort}
          speed={speed}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
    </Float>
  );
}

function PaintStrokes() {
  const ref = useRef();
  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.1;
  });
  return (
    <group ref={ref}>
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 2.5, Math.sin(angle) * 2.5, -1]}>
            <torusGeometry args={[0.3, 0.08, 8, 32]} />
            <meshStandardMaterial
              color={['#3b82f6', '#a855f7', '#ec4899', '#f59e0b', '#10b981'][i]}
              emissive={['#3b82f6', '#a855f7', '#ec4899', '#f59e0b', '#10b981'][i]}
              emissiveIntensity={0.3}
              metalness={0.6}
              roughness={0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export default function DesignScene() {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 6]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#3b82f6" />
      <pointLight position={[-5, -3, 3]} intensity={0.5} color="#ec4899" />
      <MorphingSphere position={[0, 0, 0]} color="#3b82f6" speed={2} distort={0.5} size={1.5} />
      <MorphingSphere position={[2, -1, -2]} color="#a855f7" speed={1.5} distort={0.3} size={0.6} />
      <PaintStrokes />
    </Canvas>
  );
}
