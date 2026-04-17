'use client';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, RoundedBox } from '@react-three/drei';

function Phone() {
  const ref = useRef();
  useFrame((state) => {
    ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1.5}>
      <group ref={ref}>
        {/* Phone body */}
        <RoundedBox args={[1.4, 2.6, 0.12]} radius={0.12} smoothness={4}>
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
        </RoundedBox>
        {/* Screen */}
        <RoundedBox args={[1.2, 2.3, 0.01]} radius={0.08} smoothness={4} position={[0, 0, 0.07]}>
          <meshStandardMaterial color="#0f172a" emissive="#ef4444" emissiveIntensity={0.05} metalness={0.5} roughness={0.3} />
        </RoundedBox>
        {/* App icons */}
        {[
          [-0.3, 0.7], [0.3, 0.7],
          [-0.3, 0.1], [0.3, 0.1],
          [-0.3, -0.5], [0.3, -0.5],
        ].map(([x, y], i) => (
          <RoundedBox key={i} args={[0.35, 0.35, 0.01]} radius={0.06} smoothness={4} position={[x, y, 0.08]}>
            <meshStandardMaterial
              color={['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'][i]}
              emissive={['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'][i]}
              emissiveIntensity={0.3}
              metalness={0.6}
              roughness={0.3}
            />
          </RoundedBox>
        ))}
        {/* Notch */}
        <RoundedBox args={[0.4, 0.06, 0.01]} radius={0.03} smoothness={4} position={[0, 1.05, 0.08]}>
          <meshStandardMaterial color="#0f172a" />
        </RoundedBox>
      </group>
    </Float>
  );
}

function FloatingNotifications() {
  const ref = useRef();
  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.1;
  });
  return (
    <group ref={ref}>
      {[
        [1.8, 0.8, 0.5, '#ef4444'],
        [-1.5, -0.5, 1, '#3b82f6'],
        [1.2, -1.2, -0.5, '#10b981'],
      ].map(([x, y, z, color], i) => (
        <Float key={i} speed={2 + i * 0.3} floatIntensity={1}>
          <RoundedBox args={[0.6, 0.2, 0.02]} radius={0.05} smoothness={4} position={[x, y, z]}>
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} metalness={0.5} roughness={0.3} />
          </RoundedBox>
        </Float>
      ))}
    </group>
  );
}

export default function AppDevScene() {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 5.5]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={0.7} color="#ef4444" />
      <pointLight position={[-5, -3, 3]} intensity={0.4} color="#3b82f6" />
      <Phone />
      <FloatingNotifications />
    </Canvas>
  );
}
