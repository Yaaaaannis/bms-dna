'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { TextureLoader, VideoTexture, SphereGeometry, MeshBasicMaterial, Mesh, Group, LinearFilter, SRGBColorSpace, ClampToEdgeWrapping, FrontSide, Texture } from 'three';

interface VideoProjectionProps {
  gridSize?: number;
  spacing?: number;
  videoSrc: string;
  maskSrc: string;
}

function VideoProjectionGrid({ gridSize = 10, spacing = 0.75, videoSrc, maskSrc }: VideoProjectionProps) {
  const groupRef = useRef<Group>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoTexture, setVideoTexture] = useState<VideoTexture | null>(null);
  const [maskTexture, setMaskTexture] = useState<Texture | null>(null);
  const [meshes, setMeshes] = useState<Mesh[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Créer l'élément vidéo
    const video = document.createElement('video');
    video.src = videoSrc;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.autoplay = true;
    video.play().catch(console.error);
    videoRef.current = video;

    // Créer la texture vidéo
    const texture = new VideoTexture(video);
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.colorSpace = SRGBColorSpace;
    texture.wrapS = ClampToEdgeWrapping;
    texture.wrapT = ClampToEdgeWrapping;
    setVideoTexture(texture);

    // Charger la texture de masque
    const loader = new TextureLoader();
    loader.load(maskSrc, (mask) => {
      setMaskTexture(mask);
    });

    return () => {
      video.pause();
      video.src = '';
    };
  }, [videoSrc, maskSrc]);

  useEffect(() => {
    if (!videoTexture || !groupRef.current) return;

    const newMeshes: Mesh[] = [];
    const material = new MeshBasicMaterial({ 
      map: videoTexture,
      side: FrontSide
    });

    // Créer la grille de sphères
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const geometry = new SphereGeometry(0.1, 16, 16);
        
        // Calculer les coordonnées UV pour cette sphère spécifique
        const uvX = x / gridSize;
        const uvY = y / gridSize;
        const uvWidth = 1 / gridSize;
        const uvHeight = 1 / gridSize;
        
        // Modifier les UVs pour mapper la portion de vidéo correspondante
        const uvAttribute = geometry.attributes.uv;
        const uvArray = uvAttribute.array;
        
        for (let i = 0; i < uvArray.length; i += 2) {
          uvArray[i] = uvX + (uvArray[i] * uvWidth);
          uvArray[i + 1] = uvY + (uvArray[i + 1] * uvHeight);
        }
        
        uvAttribute.needsUpdate = true;
        
        const mesh = new Mesh(geometry, material.clone());
        mesh.position.x = (x - (gridSize - 1) / 2) * spacing;
        mesh.position.y = (y - (gridSize - 1) / 2) * spacing;
        mesh.position.z = 0;
        
        groupRef.current.add(mesh);
        newMeshes.push(mesh);
      }
    }
    
    setMeshes(newMeshes);
    setIsReady(true);
  }, [videoTexture, gridSize, spacing]);

  // Appliquer le masque après le chargement de la texture de masque
  useEffect(() => {
    if (!maskTexture || !meshes.length) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx || !maskTexture.image) return;

    // Utiliser la taille originale de l'image pour plus de précision
    canvas.width = maskTexture.image.width;
    canvas.height = maskTexture.image.height;
    
    // Dessiner l'image de masque à sa taille originale
    ctx.drawImage(maskTexture.image, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    meshes.forEach((mesh, index) => {
      const x = index % gridSize;
      const y = Math.floor(index / gridSize);
      
      // Calculer les coordonnées dans l'image de masque
      const maskX = Math.floor((x / (gridSize - 1)) * (canvas.width - 1));
      const maskY = Math.floor((y / (gridSize - 1)) * (canvas.height - 1));
      
      // Obtenir le pixel correspondant dans l'image de masque
      const pixelIndex = (maskY * canvas.width + maskX) * 4;
      
      const r = data[pixelIndex];
      const g = data[pixelIndex + 1];
      const b = data[pixelIndex + 2];
      const brightness = (r + g + b) / 3;
      
      // Si le pixel est trop clair (fond blanc), masquer le cube
      if (brightness > 128) {
        mesh.scale.setScalar(0);
      } else {
        mesh.scale.setScalar(1);
      }
    });
  }, [maskTexture, meshes, gridSize]);

  // Animation des sphères
  useFrame((state) => {
    if (!isReady || !groupRef.current) return;
    
    // Animation des sphères individuelles (mouvement vertical subtil)
    meshes.forEach((mesh, index) => {
      const time = state.clock.elapsedTime;
      mesh.position.z = Math.sin(time + index * 0.1) * 0.05;
    });
  });

  return (
    <group ref={groupRef} scale={[0.5, 0.5, 0.5]}>
      {/* La grille sera ajoutée dynamiquement */}
    </group>
  );
}

export default function VideoProjectionSection() {

  return (
    <section className="relative h-screen w-full bg-black overflow-hidden">
      {/* Canvas Three.js */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 75 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          
          <VideoProjectionGrid
            gridSize={90}
            spacing={0.5}
            videoSrc="/video1.mp4"
            maskSrc="/dna.jpg"
          />
          
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={15}
            minPolarAngle={0}
            maxPolarAngle={Math.PI}
          />
        </Canvas>
      </div>


      {/* Titre */}
      <div className="absolute top-8 left-8 z-10">
        <h2 className="text-4xl font-bold text-white mb-2">
          Video Projection Mapping
        </h2>
        <p className="text-white/70 text-lg">
          Projection vidéo interactive sur grille de sphères 3D
        </p>
        <p className="text-white/50 text-sm mt-2">
          Utilisez la souris pour tourner, zoomer et naviguer autour du modèle
        </p>
      </div>

      {/* Effet de vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 pointer-events-none"></div>
    </section>
  );
}