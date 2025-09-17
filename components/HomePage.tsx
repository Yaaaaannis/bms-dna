'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Header from './Header';
import HeroSection from './HeroSection';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animation du header gauche (descend pendant le scroll)
    gsap.to('.header-left', {
      y: '100vh',
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1
      }
    });

    // Animation du header droite (monte pendant le scroll)
    gsap.to('.header-right', {
      y: '-100vh',
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1
      }
    });
  }, []);

  return (
    <>
      {/* Section principale avec scroll */}
      <div ref={containerRef} className="h-[200vh] w-full relative bg-black">
        {/* Conteneur fixe pour le contenu */}
        <div className="sticky top-0 h-screen w-full flex items-center justify-center">
          <Header />
          {/* Vidéo de fond */}
          <video 
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay 
            muted 
            loop 
            playsInline
          >
            <source src="/bg.mp4" type="video/mp4" />
          </video>
          
          {/* Effet de vignette noir sur les bordures */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-60"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-60"></div>
          
          {/* Logo SVG au centre */}
          <div className="relative z-10 flex flex-col items-center">
            <Image 
              src="/logo.svg" 
              alt="BMS DNA Logo" 
              width={384}
              height={192}
              className="w-96 h-auto mb-8"
            />
          </div>
        </div>
      </div>
      
      {/* Section Hero - maintenant dans le contexte de scroll */}
      <div className="relative">
        <HeroSection />
      </div>
    </>
  );
}
