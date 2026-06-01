import React from 'react';

/**
 * Hero Component - BarberFlow Luxury Edition
 */
const Hero = ({ config }) => {
  if (!config) return null;

  return (
    <section id="inicio" className="relative min-height-[90vh] pt-12 pb-10 md:pt-48 md:pb-40 overflow-hidden flex items-center">
      {/* Elementos decorativos de fondo (Glow effects) */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-gold/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-gold/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl">
          {/* Tagline superior - Refinado */}
          <span className="inline-block text-accent-gold text-base md:text-lg font-black tracking-[0.4em] uppercase mb-6 animate-fade-in">
            Experiencia de Corte Premium
          </span>
          
          {/* Título Principal - Impacto Equilibrado */}
          <h1 className="text-4xl md:text-8xl font-poppins font-black mb-8 leading-[0.9] tracking-tighter">
            Elevá tu estilo en <br/>
            <span className="text-accent-gold drop-shadow-lg">{config.name.split(' - ')[0]}</span>
          </h1>

          <p className="text-xl md:text-2xl text-text-tiza/70 mb-14 max-w-2xl leading-relaxed font-medium">
            Combinamos la tradición de la barbería clásica con técnicas modernas 
            en <span className="text-text-tiza font-bold underline decoration-accent-gold/40">{config.address}</span>. Tu imagen es nuestra firma.
          </p>

          {/* Call to Action Principal - Único y Fuerte */}
          <div className="flex flex-col sm:flex-row gap-6 mt-10 md:mt-0">
            <button 
              onClick={() => document.getElementById('agenda')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-accent-gold text-main-bg px-8 py-4 md:px-14 md:py-6 font-black uppercase tracking-[0.3em] text-lg md:text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(197,160,89,0.3)]"
            >
              Agendar Turno
            </button>
            {/* El botón de WhatsApp se ha movido a un icono flotante global para mejor UX */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
