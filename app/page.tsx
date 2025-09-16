'use client';

import { useState } from 'react';
import Loader from '../components/Loader';
import HomePage from '../components/HomePage';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative">
      {/* HomePage toujours présente en arrière-plan */}
      <HomePage />
      
      {/* Loader par-dessus pendant le chargement */}
      {isLoading && (
        <div className="absolute inset-0 z-50">
          <Loader onComplete={handleLoadingComplete} />
        </div>
      )}
    </div>
  );
}
