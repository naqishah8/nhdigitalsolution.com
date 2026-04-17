'use client';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Sphere } from '@react-three/drei';
import * as THREE from 'three';

function NetworkNode({ position, color, size = 0.2 }) {
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
      <Sphere args={[size, 16, 16]} position={position}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} metalness={0.7} roughness={0.3} />
      </Sphere>
    </Float>
  );
}

function Connections({ nodes }) {
  const ref = useRef();
  const lineGeometry = useMemo(() => {
    const points = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = new THREE.Vector3(...nodes[i].pos).distanceTo(new THREE.Vector3(...nodes[j].pos));
        if (dist < 3) {
          points.push(new THREE.Vector3(...nodes[i].pos));
          points.push(new THREE.Vector3(...nodes[j].pos));
        }
      }
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [nodes]);

  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <group ref={ref}>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#f59e0b" transparent opacity={0.2} />
      </lineSegments>
    </group>
  );
}

function PulsingCore() {
  const ref = useRef();
  useFrame((state) => {
    const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    ref.current.scale.set(scale, scale, scale);
  });
  return (
    <Sphere ref={ref} args={[0.4, 32, 32]} position={[0, 0, 0]}>
      <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.5} metalness={0.9} roughness={0.1} />
    </Sphere>
  );
}

export default function SMMScene() {
  const nodes = useMemo(() => [
    { pos: [1.5, 1, 0.5], color: '#f59e0b' },
    { pos: [-1.5, 0.8, -0.3], color: '#d97706' },
    { pos: [0.5, -1.5, 0.8], color: '#fbbf24' },
    { pos: [-1, -0.5, 1.5], color: '#f59e0b' },
    { pos: [1.8, -0.8, -1], color: '#d97706' },
    { pos: [-0.5, 1.8, -1], color: '#fbbf24' },
    { pos: [0, 0, 2], color: '#f59e0b' },
    { pos: [-2, 0, 0], color: '#d97706' },
  ], []);

  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 6]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={0.6} color="#f59e0b" />
      <pointLight position={[-5, -3, 3]} intensity={0.4} color="#fbbf24" />
      <PulsingCore />
      {nodes.map((node, i) => (
        <NetworkNode key={i} position={node.pos} color={node.color} size={0.15} />
      ))}
      <Connections nodes={nodes} />
    </Canvas>
  );
}
