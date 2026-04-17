'use client';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

function MovingBox({ startPos, endPos, color, speed, offset }) {
  const ref = useRef();
  useFrame((state) => {
    const t = ((state.clock.elapsedTime * speed + offset) % 4) / 4;
    ref.current.position.lerpVectors(
      new THREE.Vector3(...startPos),
      new THREE.Vector3(...endPos),
      t
    );
    ref.current.rotation.y = state.clock.elapsedTime * 0.5;
  });
  return (
    <RoundedBox ref={ref} args={[0.4, 0.4, 0.4]} radius={0.05} smoothness={4} position={startPos}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.15} metalness={0.6} roughness={0.3} />
    </RoundedBox>
  );
}

function ConveyorPath() {
  const points = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-3, -0.5, 0),
      new THREE.Vector3(-1, 0, 1),
      new THREE.Vector3(1, 0.5, 0),
      new THREE.Vector3(3, 0, -1),
    ]);
    return curve.getPoints(50);
  }, []);

  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#8b5cf6" transparent opacity={0.3} />
    </line>
  );
}

function GridFloor() {
  return (
    <gridHelper args={[10, 20, '#1e1b4b', '#1e1b4b']} position={[0, -2, 0]} />
  );
}

export default function LogisticsScene() {
  const boxes = useMemo(() => [
    { start: [-3, -0.5, 0], end: [3, 0, -1], color: '#8b5cf6', speed: 0.4, offset: 0 },
    { start: [-3, -0.5, 0], end: [3, 0, -1], color: '#7c3aed', speed: 0.4, offset: 1.3 },
    { start: [-3, -0.5, 0], end: [3, 0, -1], color: '#a78bfa', speed: 0.4, offset: 2.6 },
  ], []);

  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 2, 6]} rotation={[-0.2, 0, 0]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 8, 5]} intensity={0.7} color="#8b5cf6" />
      <pointLight position={[-5, 3, 3]} intensity={0.3} color="#a78bfa" />
      <ConveyorPath />
      {boxes.map((box, i) => (
        <MovingBox key={i} startPos={box.start} endPos={box.end} color={box.color} speed={box.speed} offset={box.offset} />
      ))}
      {/* Warehouse markers */}
      <Float speed={1} floatIntensity={0.5}>
        <RoundedBox args={[0.8, 0.8, 0.8]} radius={0.1} smoothness={4} position={[-3, 0, 0]}>
          <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={0.2} metalness={0.7} roughness={0.3} />
        </RoundedBox>
      </Float>
      <Float speed={1.2} floatIntensity={0.5}>
        <RoundedBox args={[0.8, 0.8, 0.8]} radius={0.1} smoothness={4} position={[3, 0.5, -1]}>
          <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.2} metalness={0.7} roughness={0.3} />
        </RoundedBox>
      </Float>
      <GridFloor />
    </Canvas>
  );
}
