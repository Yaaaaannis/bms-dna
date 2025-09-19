'use client';

import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, AsciiRenderer } from '@react-three/drei';
import { DnaModel } from './Dna';
import { InteractivePoint } from './InteractivePoint';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
    position: [2, 0, 0],
    label: "DNA"
  },
  {
    id: 2,
    title: "INTERFACE CYBER",
    description: "Interface utilisateur futuriste avec effets de glitch et rendu stylisé pour une expérience immersive.",
    features: ["Design cyberpunk", "Effets Glitch", "Interface responsive", "Animations GSAP"],
    position: [-2, 1, 0],
    label: "UI"
  },
  {
    id: 3,
    title: "TECHNOLOGIE 3D",
    description: "Intégration de technologies 3D modernes avec React Three Fiber et post-processing avancé.",
    features: ["React Three Fiber", "Post-processing", "Shaders personnalisés", "Performance optimisée"],
    position: [0, -2, 1],
    label: "3D"
  }
];

interface DnaScene3DProps {
  onProjectChange: (project: ProjectData) => void;
}

export default function DnaScene3D({ onProjectChange }: DnaScene3DProps) {
  const [activeProject, setActiveProject] = useState<ProjectData>(projects[0]);
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, -10, 20]);
  const sceneRef = useRef<HTMLDivElement>(null);

  const handlePointClick = (project: ProjectData) => {
    setActiveProject(project);
    onProjectChange(project);
  };

  useEffect(() => {
    if (sceneRef.current) {
      // Animation de la caméra au scroll
      gsap.to(cameraPosition, {
        y: 3, // Position finale de la caméra (plus haute)
        duration: 1,
        ease: "none",
        scrollTrigger: {
          trigger: sceneRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            const newY = -10 + (progress * 13); // De -10 à 3
            setCameraPosition([30, newY, 30]);
          }
        }
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === sceneRef.current) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <div ref={sceneRef} className="w-2/3 h-full relative sticky top-0">
      <Canvas
        shadows
        camera={{ position: cameraPosition, fov: 70 }}
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
            position={[-10, -10, 0]}
            scale={[1, 1, 1]}
            rotation={[0, 0, Math.PI / -9]}
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
          fgColor="white"
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
