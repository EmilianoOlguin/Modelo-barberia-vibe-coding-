import React from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

/**
 * Gallery Component - BarberFlow Showcase Elite
 * 
 * Diseño de Portafolio Compacto: Estilo Feed de Instagram en móvil.
 */
const Gallery = ({ branchName }) => {
  const addToRefs = useScrollReveal();

  // Lista de imágenes ampliada y mejorada para un look profesional
  const images = [
    { id: 1, url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800' },
    { id: 2, url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=800' },
    { id: 3, url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800' },
    { id: 4, url: 'https://images.unsplash.com/photo-1512690196252-751d3948e42c?auto=format&fit=crop&q=80&w=800' },
    { id: 5, url: 'https://images.unsplash.com/photo-1622286332618-f2803b414273?auto=format&fit=crop&q=80&w=800' },
    { id: 6, url: 'https://images.unsplash.com/photo-1599351431247-f10b21ce5037?auto=format&fit=crop&q=80&w=800' },
    { id: 7, url: 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&q=80&w=800' },
    { id: 8, url: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&q=80&w=800' },
    { id: 9, url: 'https://images.unsplash.com/photo-1532710093739-9470acff878f?auto=format&fit=crop&q=80&w=800' },
  ];

  return (
    <section id="galeria" className="py-20 md:py-32 bg-main-bg">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Encabezado Minimalista */}
        <div ref={addToRefs} className="text-center mb-12 md:mb-24 animate-reveal">
          <span className="text-accent-gold text-[10px] md:text-xs font-black tracking-[0.5em] uppercase mb-4 block">Portafolio</span>
          <h2 className="text-3xl md:text-5xl font-poppins font-black uppercase tracking-tighter">Nuestro Arte</h2>
          <div className="w-12 h-[1px] bg-accent-gold/30 mx-auto mt-6"></div>
        </div>

        {/* Grilla de Portafolio - 2 columnas en móvil para más tamaño, 3 en desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-6">
          {images.map((item, index) => (
            <div 
              key={item.id} 
              ref={addToRefs}
              style={{ transitionDelay: `${index * 50}ms` }}
              className="group relative overflow-hidden bg-card-bg border border-white/5 animate-reveal aspect-square"
            >
              {/* Imagen Limpia con Zoom suave al pasar el mouse */}
              <img 
                src={item.url} 
                alt="Trabajo de Barbería"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
              />
              
              {/* Overlay sutil para profundidad */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Gallery;
