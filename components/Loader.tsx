'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const line3Ref = useRef<HTMLDivElement>(null);
  const line4Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Variables pour stocker les timelines
    const tl1: gsap.core.Timeline = gsap.timeline({ repeat: -1 });
    const tl2: gsap.core.Timeline = gsap.timeline({ repeat: -1 });
    const tl3: gsap.core.Timeline = gsap.timeline({ repeat: -1 });
    const tl4: gsap.core.Timeline = gsap.timeline({ repeat: -1 });

    // Créer les animations initiales
    if (line1Ref.current) {
      tl1.to(line1Ref.current, {
        backgroundPosition: '100% 0',
        duration: 3,
        ease: 'none'
      });
    }

    if (line2Ref.current) {
      tl2.fromTo(line2Ref.current, 
        { backgroundPosition: '100% 0' },
        {
          backgroundPosition: '0% 0',
          duration: 3,
          ease: 'none'
        }
      );
    }

    if (line3Ref.current) {
      tl3.to(line3Ref.current, {
        backgroundPosition: '100% 0',
        duration: 3,
        ease: 'none'
      });
    }

    if (line4Ref.current) {
      tl4.fromTo(line4Ref.current, 
        { backgroundPosition: '100% 0' },
        {
          backgroundPosition: '0% 0',
          duration: 3,
          ease: 'none'
        }
      );
    }

    // Commencer à vitesse 0.5
    gsap.set([tl1, tl2, tl3, tl4], { timeScale: 0.5 });

    // Animation d'accélération progressive sur 3 secondes
    gsap.to([tl1, tl2, tl3, tl4], {
      timeScale: 1.1, // Accélère jusqu'à 1.1x la vitesse
      duration: 3,
      ease: 'linear'
    });

    // Animation de collapse sur la dernière seconde
    const collapseTimer = setTimeout(() => {
      // Animation simultanée : collapse des lignes + fond vers transparent
      gsap.to([line1Ref.current, line2Ref.current, line3Ref.current, line4Ref.current], {
        scaleY: 0,
        duration: 1,
        ease: 'power2.inOut'
      });
      
      // Transition du fond noir vers transparent
      gsap.to('.loader-container', {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        duration: 1,
        ease: 'power2.inOut',
        onComplete: () => {
          onComplete();
        }
      });
    }, 3000); // Commence le collapse à 3 secondes

    // Timer pour simuler un chargement
    const timer = setTimeout(() => {
      // Le collapse se charge de appeler onComplete
    }, 4000); // 4 secondes de chargement total

    return () => {
      clearTimeout(timer);
      clearTimeout(collapseTimer);
      // Nettoyer les animations
      if (tl1) tl1.kill();
      if (tl2) tl2.kill();
      if (tl3) tl3.kill();
      if (tl4) tl4.kill();
    };
  }, [onComplete]);

  return (
    <div className="loader-container h-screen w-full flex flex-col bg-black">
      {/* Ligne 1 - Droite */}
      <div 
        ref={line1Ref}
        className="flex-1 w-full"
        style={{
          backgroundImage: 'url(/logorep.svg)',
          backgroundRepeat: 'repeat-x',
          backgroundSize: 'auto 100%',
          backgroundPosition: '0 0'
        }}
      ></div>
      
      {/* Ligne 2 - Gauche */}
      <div 
        ref={line2Ref}
        className="flex-1 w-full"
        style={{
          backgroundImage: 'url(/logorep.svg)',
          backgroundRepeat: 'repeat-x',
          backgroundSize: 'auto 100%',
          backgroundPosition: '80px 0'
        }}
      ></div>
      
      {/* Ligne 3 - Droite */}
      <div 
        ref={line3Ref}
        className="flex-1 w-full"
        style={{
          backgroundImage: 'url(/logorep.svg)',
          backgroundRepeat: 'repeat-x',
          backgroundSize: 'auto 100%',
          backgroundPosition: '160px 0'
        }}
      ></div>
      
      {/* Ligne 4 - Gauche */}
      <div 
        ref={line4Ref}
        className="flex-1 w-full"
        style={{
          backgroundImage: 'url(/logorep.svg)',
          backgroundRepeat: 'repeat-x',
          backgroundSize: 'auto 100%',
          backgroundPosition: '240px 0'
        }}
      ></div>
    </div>
  );
}
