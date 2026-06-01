import React, { useEffect, useRef } from 'react';

/**
 * Custom Hook useScrollReveal (Optimizado)
 * Evita reseteo de refs en cada render para prevenir bucles de IntersectionObserver.
 */
const useScrollReveal = () => {
  const revealRefs = useRef([]);

  const addToRefs = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    // Copiamos el valor actual para la limpieza del efecto
    const currentRefs = revealRefs.current;
    currentRefs.forEach((el) => observer.observe(el));

    return () => {
      currentRefs.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  return addToRefs;
};

export default useScrollReveal;
