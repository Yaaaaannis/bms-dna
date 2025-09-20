'use client';

import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, AsciiRenderer } from '@react-three/drei';
import { DnaModel } from './Dna';
import { InteractivePoint } from './InteractivePoint';

interface ProjectData {
  id: number;
  title: string;
  description: string;
  features: string[];
  position: [number, number, number];
  label: string;
}

const projects: ProjectData[] = [
  {
    id: 1,
    title: "PROJET DNA",
    description: "Modélisation 3D avancée d'une structure ADN avec animations et effets visuels interactifs.",
    features: ["Modélisation 3D", "Animations fluides", "Effets ASCII art", "Rendu temps réel"],
    position: [2, 8, 0],
    label: "DNA"
  },
  {
    id: 2,
    title: "INTERFACE CYBER",
    description: "Interface utilisateur futuriste avec effets de glitch et rendu stylisé pour une expérience immersive.",
    features: ["Design cyberpunk", "Effets Glitch", "Interface responsive", "Animations GSAP"],
    position: [-2, 7, 0],
    label: "UI"
  },
  {
    id: 3,
    title: "TECHNOLOGIE 3D",
    description: "Intégration de technologies 3D modernes avec React Three Fiber et post-processing avancé.",
    features: ["React Three Fiber", "Post-processing", "Shaders personnalisés", "Performance optimisée"],
    position: [0, 10, 1],
    label: "3D"
  }
];

interface DnaScene3DProps {
  onProjectChange: (project: ProjectData) => void;
}

export default function DnaScene3D({ onProjectChange }: DnaScene3DProps) {
  const [activeProject, setActiveProject] = useState<ProjectData>(projects[0]);

  const handlePointClick = (project: ProjectData) => {
    setActiveProject(project);
    onProjectChange(project);
  };

  return (
    <div className="w-2/3 h-full relative">
      <Canvas
        shadows
        camera={{ position: [3, 5, 2], fov: 70, rotation: [0, 0, 0] }}
        className="w-full h-full"
        style={{ background: '#000000' }}
      >
        <Suspense fallback={null}>
          {/* Background noir */}
          <color attach="background" args={['#000000']} />
          
          {/* Éclairage */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-10, -10, -5]} intensity={0.5} />
          
          {/* Environnement */}
          <Environment preset="studio" />
          
          {/* Modèle DNA avec animation */}
          <DnaModel 
            position={[-3, -2, 0]}
            scale={[1, 1, 1]}
            rotation={[Math.PI / -10, Math.PI / 6, Math.PI / -4]}
          />
          
          {/* Points interactifs */}
          {projects.map((project) => (
            <InteractivePoint
              key={project.id}
              position={project.position}
              label={project.label}
              onClick={() => handlePointClick(project)}
              isActive={activeProject.id === project.id}
            />
          ))}
          
          {/* Contrôles d'orbite */}
          
        </Suspense>
        
        {/* AsciiRenderer pour l'effet ASCII art */}
        <AsciiRenderer
          fgColor="red"
          bgColor="black"
          characters=" .:-=+*#%@"
          invert
        />
        
      </Canvas>
      
      {/* Overlay avec informations dynamiques */}
      <div className="absolute top-8 left-8 z-10">
        <h2 
          className="text-black text-2xl font-bold mb-2"
          style={{
            fontFamily: 'DrukWideBold, sans-serif',
            letterSpacing: '1px'
          }}
        >
          {activeProject.title}
        </h2>
        <p className="text-black/70 text-sm mb-3 max-w-xs">
          {activeProject.description}
        </p>
        <div className="space-y-1">
          {activeProject.features.map((feature, index) => (
            <div key={index} className="text-black/60 text-xs flex items-center">
              <span className="w-1 h-1 bg-black/60 rounded-full mr-2"></span>
              {feature}
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
