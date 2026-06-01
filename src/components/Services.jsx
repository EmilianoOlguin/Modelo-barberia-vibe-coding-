import React from 'react';
import { formatCurrency } from '../utils/formatters';
import useScrollReveal from '../hooks/useScrollReveal';
import { SERVICES } from '../config';

/**
 * Services Component - Listado de Experiencias Elite
 */
const Services = ({ branchId }) => {
  const addToRefs = useScrollReveal();

  // Usamos los servicios de la config para consistencia
  const serviceList = SERVICES.slice(0, 3); // Mostramos los 3 principales en esta sección

  return (
    <section id="servicios" className="py-32 bg-main-bg relative overflow-hidden">
      {/* Background Decorator */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 text-[18rem] font-black text-white/[0.01] select-none pointer-events-none uppercase tracking-tighter">
        Elite
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div ref={addToRefs} className="text-center mb-24 animate-reveal">
          <span className="text-accent-gold text-sm font-black tracking-[0.4em] uppercase mb-4 block">Nuestras Experiencias</span>
          <h2 className="text-4xl md:text-6xl font-poppins font-black uppercase tracking-tighter">El Arte del Cuidado</h2>
          <div className="w-24 h-[1px] bg-accent-gold/50 mx-auto mt-8"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {serviceList.map((service, index) => (
            <div 
              key={service.id} 
              ref={addToRefs}
              style={{ transitionDelay: `${index * 150}ms` }}
              className="group glass-card p-10 md:p-12 hover:border-accent-gold/40 transition-all duration-700 relative flex flex-col justify-between overflow-hidden animate-reveal gold-glow-hover"
            >
              {/* Brillo decorativo superior */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-gold/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div>
                <div className="flex justify-between items-start mb-10">
                  <div className="text-5xl group-hover:scale-110 transition-all duration-700 group-hover:text-glow">
                    {index === 0 ? '✂️' : index === 1 ? '🪒' : '👑'}
                  </div>
                  <div className="flex items-center gap-2 bg-accent-gold/10 border border-accent-gold/20 px-4 py-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-accent-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-black text-accent-gold uppercase tracking-wider">{service.duration}</span>
                  </div>
                </div>

                <h3 className="text-2xl md:text-3xl font-poppins font-bold mb-6 group-hover:text-accent-gold transition-colors duration-500 uppercase tracking-tight">
                  {service.title}
                </h3>
                <p className="text-text-tiza/50 text-xl leading-relaxed mb-10 font-medium italic">
                  "{service.desc}"
                </p>
              </div>
              
              <div className="flex items-center justify-between mt-auto">
                <span className="text-3xl font-poppins font-black text-accent-gold tracking-tighter">
                  {formatCurrency(service.price)}
                </span>
                <a 
                  href="#agenda" 
                  className="bg-white/5 hover:bg-accent-gold hover:text-main-bg border border-white/10 hover:border-accent-gold px-6 py-3 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-300"
                >
                  Reservar
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
