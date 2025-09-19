'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sphere } from '@react-three/drei';
import { Group, Mesh } from 'three';

interface InteractivePointProps {
  position: [number, number, number];
  label: string;
  onClick: () => void;
  isActive: boolean;
}

export function InteractivePoint({ position, label, onClick, isActive }: InteractivePointProps) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      // Animation de pulsation
      groupRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.1);
      
      // Rotation lente
      groupRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Sphère interactive */}
      <Sphere
        args={[0.3, 16, 16]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={isActive ? "#ff6b6b" : hovered ? "#4ecdc4" : "#45b7d1"}
          emissive={isActive ? "#ff6b6b" : hovered ? "#4ecdc4" : "#45b7d1"}
          emissiveIntensity={0.3}
          transparent
          opacity={0.8}
        />
      </Sphere>
      
      {/* Texte du label */}
      <Text
        position={[0, 0.8, 0]}
        fontSize={0.2}
        color={isActive ? "#ff6b6b" : "#ffffff"}
        anchorX="center"
        anchorY="middle"
        font="/DrukWideBold.woff"
      >
        {label}
      </Text>
      
      {/* Anneau de sélection */}
      {isActive && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.4, 0.5, 32]} />
          <meshBasicMaterial color="#ff6b6b" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}
