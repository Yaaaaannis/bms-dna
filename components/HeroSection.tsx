'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const images = [
    { src: '/chien.jpg', alt: 'Chien' },
    { src: '/img1.webp', alt: 'Image 1' }
  ];

  useEffect(() => {
    // Charger la police DrukWideBold
    const font = new FontFace('DrukWideBold', 'url(/DrukWideBold.woff)');
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
    });
  }, []);

  useEffect(() => {
    // Changer d'image toutes les 2 secondes
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Vidéo de fond */}
      <video 
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay 
        muted 
        loop 
        playsInline
      >
        <source src="/video1.mp4" type="video/mp4" />
      </video>
      
      {/* Overlay sombre pour le contraste */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Titre en haut à gauche */}
      <div className="absolute top-20 left-10 z-20">
        <h1 
          className="text-white text-4xl font-bold"
          style={{
            fontFamily: 'DrukWideBold, sans-serif',
            letterSpacing: '2px'
          }}
        >
          Projet Marque Café
        </h1>
      </div>

      {/* Titre en haut à droite */}
      <div className="absolute top-38 right-10 z-20">
        <div 
          className="text-white text-xl font-bold"
          style={{
            fontFamily: 'DrukWideBold, sans-serif',
            letterSpacing: '2px'
          }}
        >
          <div className="text-left">Développement</div>
          <div className="text-center">/</div>
          <div className="text-right">Design</div>
        </div>
      </div>
      
      {/* Numéros en bas à gauche */}
      <div className="absolute bottom-8 left-8 z-20">
        <div className="flex space-x-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md text-white flex items-center justify-center text-xl font-black border border-white/30">1</div>
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md text-white flex items-center justify-center text-xl font-black border border-white/20">2</div>
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md text-white flex items-center justify-center text-xl font-black border border-white/20">3</div>
        </div>
      </div>

      {/* Images au centre avec carrousel */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="relative">
          {images.map((image, index) => (
            <Image 
              key={index}
              src={image.src} 
              alt={image.alt} 
              width={300}
              height={300}
              className={`w-80 h-80 object-cover shadow-2xl transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-80' : 'opacity-0 absolute inset-0'
              }`}
            />
          ))}
          
          {/* Bouton "View more" en overlay */}
         
        </div>
      </div>
    </div>
  );
}
