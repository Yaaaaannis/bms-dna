'use client';

import { useEffect } from 'react';

export default function Header() {
  useEffect(() => {
    // Charger la police DrukWideBold
    const font = new FontFace('DrukWideBold', 'url(/DrukWideBold.woff)');
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
    });
  }, []);

  const leftMenuItems = [
    { text: 'DÉVELOPPEMENT', href: '/developpement' },
    { text: 'DESIGN', href: '/design' }
  ];

  const rightMenuItems = [
    { text: 'PHOTO', href: '/photo' },
    { text: 'CONTACT', href: '/contact' }
  ];

  return (
    <>
      {/* Header gauche */}
      <div className="header-left fixed left-0 top-0 h-full w-20 z-40 flex flex-col justify-start items-center pt-32 space-y-20">
        {leftMenuItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className="text-white hover:text-gray-300 transition-colors duration-300 group flex flex-col items-center"
            style={{
              fontFamily: 'DrukWideBold, sans-serif',
              fontSize: '18px',
              letterSpacing: '2px'
            }}
          >
            {item.text.split('').map((letter, letterIndex) => (
              <span
                key={letterIndex}
                className="block group-hover:scale-110 transition-transform duration-200"
                style={{ lineHeight: '1' }}
              >
                {letter}
              </span>
            ))}
          </a>
        ))}
      </div>

      {/* Header droite */}
      <div className="header-right fixed right-0 top-0 h-full w-20 z-40 flex flex-col justify-end items-center pb-24 space-y-12">
        {rightMenuItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className="text-white hover:text-gray-300 transition-colors duration-300 group flex flex-col items-center"
            style={{
              fontFamily: 'DrukWideBold, sans-serif',
              fontSize: '20px',
              letterSpacing: '3px'
            }}
          >
            {item.text.split('').map((letter, letterIndex) => (
              <span
                key={letterIndex}
                className="block group-hover:scale-110 transition-transform duration-200"
                style={{ lineHeight: '1.1' }}
              >
                {letter}
              </span>
            ))}
          </a>
        ))}
      </div>
    </>
  );
}
