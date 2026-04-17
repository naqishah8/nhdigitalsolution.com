'use client';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, RoundedBox, PerspectiveCamera } from '@react-three/drei';

function FloatingScreen({ position, rotation, scale, speed }) {
  const ref = useRef();
  useFrame((state) => {
    ref.current.rotation.y = Math.sin(state.clock.elapsedTime * speed) * 0.1 + rotation[1];
  });
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1}>
      <group ref={ref} position={position} rotation={rotation} scale={scale}>
        <RoundedBox args={[2.4, 1.5, 0.08]} radius={0.08} smoothness={4}>
          <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.3} />
        </RoundedBox>
        <RoundedBox args={[2.2, 1.3, 0.01]} radius={0.04} smoothness={4} position={[0, 0, 0.05]}>
          <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.15} metalness={0.8} roughness={0.2} />
        </RoundedBox>
        {/* Code lines */}
        {[0.35, 0.15, -0.05, -0.25, -0.45].map((y, i) => (
          <mesh key={i} position={[-0.3 + i * 0.05, y, 0.06]}>
            <boxGeometry args={[0.6 + Math.random() * 0.8, 0.04, 0.001]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#7c3aed' : '#3b82f6'} emissive={i % 2 === 0 ? '#7c3aed' : '#3b82f6'} emissiveIntensity={0.4} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

function Particles() {
  const ref = useRef();
  const count = 30;
  const positions = useRef(
    Array.from({ length: count * 3 }, () => (Math.random() - 0.5) * 10)
  ).current;

  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={new Float32Array(positions)} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#a855f7" transparent opacity={0.6} />
    </points>
  );
}

export default function WebDevScene() {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 6]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#a855f7" />
      <pointLight position={[-5, -3, 3]} intensity={0.4} color="#3b82f6" />
      <FloatingScreen position={[0, 0.2, 0]} rotation={[0.1, -0.2, 0]} scale={1} speed={0.5} />
      <FloatingScreen position={[1.8, -0.8, -1.5]} rotation={[0.05, 0.3, 0.05]} scale={0.6} speed={0.7} />
      <Particles />
    </Canvas>
  );
}
