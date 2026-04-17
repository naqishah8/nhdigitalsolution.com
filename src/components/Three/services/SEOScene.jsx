'use client';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, RoundedBox } from '@react-three/drei';

function RisingBar({ position, height, color, delay }) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime + delay;
    const scale = (Math.sin(t * 0.8) + 1) * 0.5 * height + 0.3;
    ref.current.scale.y = scale;
    ref.current.position.y = scale * 0.5 + position[1];
  });
  return (
    <RoundedBox ref={ref} args={[0.4, 1, 0.4]} radius={0.06} smoothness={4} position={position}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} metalness={0.7} roughness={0.3} />
    </RoundedBox>
  );
}

function SearchLens() {
  const ref = useRef();
  useFrame((state) => {
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.2 + 1.5;
  });
  return (
    <Float speed={1} floatIntensity={0.5}>
      <group ref={ref} position={[1.5, 1.5, 0.5]}>
        <mesh>
          <torusGeometry args={[0.5, 0.06, 16, 32]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.4} metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.35, -0.35, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
          <meshStandardMaterial color="#10b981" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    </Float>
  );
}

export default function SEOScene() {
  const bars = useMemo(() => [
    { x: -1.5, height: 1.2, color: '#059669', delay: 0 },
    { x: -0.9, height: 1.6, color: '#10b981', delay: 0.5 },
    { x: -0.3, height: 1.0, color: '#34d399', delay: 1.0 },
    { x: 0.3, height: 2.0, color: '#10b981', delay: 1.5 },
    { x: 0.9, height: 1.4, color: '#059669', delay: 2.0 },
    { x: 1.5, height: 2.4, color: '#10b981', delay: 2.5 },
  ], []);

  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 1.5, 6]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 8, 5]} intensity={0.8} color="#10b981" />
      <pointLight position={[-5, 2, 3]} intensity={0.3} color="#3b82f6" />
      {bars.map((bar, i) => (
        <RisingBar key={i} position={[bar.x, -1, 0]} height={bar.height} color={bar.color} delay={bar.delay} />
      ))}
      <SearchLens />
    </Canvas>
  );
}
