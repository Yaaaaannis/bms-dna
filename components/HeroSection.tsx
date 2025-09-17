'use client';

import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [displayedNumbers, setDisplayedNumbers] = useState([0, 0, 0]);
  
  const images = [
    { src: '/chien.jpg', alt: 'Chien' },
    { src: '/img1.webp', alt: 'Image 1' }
  ];

  const twitterLinksRef = useRef<HTMLDivElement>(null);
  const numbersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Charger la police DrukWideBold
    const font = new FontFace('DrukWideBold', 'url(/DrukWideBold.woff)');
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
    });
  }, []);

  useEffect(() => {
    // Changer d'image toutes les 3 secondes
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  // Animations avec ScrollTrigger
  useEffect(() => {
    // Délai pour s'assurer que les éléments sont rendus
    const timer = setTimeout(() => {
      const heroSection = document.querySelector('.hero-section');
      if (!heroSection) return;

      console.log('HeroSection trouvée, initialisation des animations...');

      // Animation typewriter pour les liens Twitter
      if (twitterLinksRef.current) {
        const links = twitterLinksRef.current.querySelectorAll('a');
        console.log('Liens Twitter trouvés:', links.length);
        
        links.forEach((link, index) => {
          const text = link.textContent || '';
          link.textContent = '';
          
          gsap.fromTo(link, 
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.5,
              delay: index * 0.3,
              scrollTrigger: {
                trigger: heroSection,
                start: "top 80%",
                toggleActions: "play none none none"
              },
              onComplete: () => {
                // Effet typewriter
                let i = 0;
                const typewriterInterval = setInterval(() => {
                  if (i < text.length) {
                    link.textContent = text.substring(0, i + 1);
                    i++;
                  } else {
                    clearInterval(typewriterInterval);
                  }
                }, 50);
              }
            }
          );
        });
      }

      // Animation compteur pour les numéros
      if (numbersRef.current) {
        const targetNumbers = [1, 2, 3];
        console.log('Numéros trouvés, initialisation du compteur...');
        
        targetNumbers.forEach((target, index) => {
          gsap.to({}, {
            duration: 1.5,
            delay: index * 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: heroSection,
              start: "top 80%",
              toggleActions: "play none none none"
            },
            onUpdate: function() {
              const progress = this.progress();
              const currentValue = Math.round(target * progress);
              setDisplayedNumbers(prev => {
                const newNumbers = [...prev];
                newNumbers[index] = currentValue;
                return newNumbers;
              });
            }
          });
        });
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      // Nettoyer seulement les ScrollTriggers de cette section
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger && trigger.trigger.classList.contains('hero-section')) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <div className="hero-section relative h-screen w-full overflow-hidden">
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
        <div ref={numbersRef} className="absolute bottom-8 left-8 z-20">
          <div className="flex space-x-3">
            <div className="group w-12 h-12 bg-white/20 backdrop-blur-md text-white flex items-center justify-center text-xl font-black border border-white/30 relative overflow-hidden cursor-pointer transition-all duration-300">
              <div className="absolute inset-0 bg-white transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
              <span className="relative z-10 group-hover:text-black transition-colors duration-300">
                {displayedNumbers[0]}
              </span>
            </div>
            <div className="group w-12 h-12 bg-white/10 backdrop-blur-md text-white flex items-center justify-center text-xl font-black border border-white/20 relative overflow-hidden cursor-pointer transition-all duration-300">
              <div className="absolute inset-0 bg-white transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
              <span className="relative z-10 group-hover:text-black transition-colors duration-300">
                {displayedNumbers[1]}
              </span>
            </div>
            <div className="group w-12 h-12 bg-white/10 backdrop-blur-md text-white flex items-center justify-center text-xl font-black border border-white/20 relative overflow-hidden cursor-pointer transition-all duration-300">
              <div className="absolute inset-0 bg-white transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
              <span className="relative z-10 group-hover:text-black transition-colors duration-300">
                {displayedNumbers[2]}
              </span>
            </div>
          </div>
        </div>

      {/* Liens Twitter des participants en bas à droite */}
      <div className="absolute bottom-8 right-8 z-20">
        <div ref={twitterLinksRef} className="flex space-x-4">
          <a 
            href="https://x.com/Yannis_dev" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white transition-colors duration-300 text-xs"
            style={{
              fontFamily: 'DrukWideBold, sans-serif',
              letterSpacing: '1px'
            }}
          >
            @Yannis_dev
          </a>
          <a 
            href="https://x.com/idamah_" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white transition-colors duration-300 text-xs"
            style={{
              fontFamily: 'DrukWideBold, sans-serif',
              letterSpacing: '1px'
            }}
          >
            @idamah_
          </a>
          <a 
            href="https://x.com/super8_studiio" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white transition-colors duration-300 text-xs"
            style={{
              fontFamily: 'DrukWideBold, sans-serif',
              letterSpacing: '1px'
            }}
          >
            @super8_studiio
          </a>
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
