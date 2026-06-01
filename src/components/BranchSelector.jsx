import React from 'react';
import { BRANCHES } from '../config';

/**
 * BranchSelector - Pantalla de entrada 'Luxury'
 * 
 * Permite al usuario seleccionar una sucursal antes de entrar al catálogo.
 * Implementa persistencia vía localStorage.
 */
const BranchSelector = ({ onSelect }) => {
  const branches = Object.values(BRANCHES);

  const handleSelect = (branchId) => {
    // Persistencia: Guardamos la elección para futuras visitas
    localStorage.setItem('selected_branch_id', branchId);
    
    // Notificamos al orquestador principal (App.jsx)
    if (onSelect) {
      onSelect(branchId);
    }
  };

  return (
    <div className="min-h-screen bg-main-bg flex flex-col items-center justify-center px-4 py-10 md:px-6 md:py-20">
      {/* Header de la Landing - Reducido para Mobile */}
      <div className="text-center mb-10 md:mb-20 animate-fade-in">
        <h1 className="text-accent-gold font-poppins font-black text-4xl md:text-9xl tracking-[0.1em] uppercase mb-2 md:mb-6 leading-none text-glow">
          BarberFlow
        </h1>
        <div className="h-[1px] w-24 md:w-48 bg-accent-gold mx-auto mb-4 md:mb-10"></div>
        <p className="text-text-tiza/70 font-lato italic text-base md:text-3xl tracking-widest leading-relaxed px-4">
          Seleccioná tu sede elite
        </p>
      </div>

      {/* Grid de Sucursales - Más compacto pero con mejor separación */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-7xl w-full px-4">
        {branches.map((branch, index) => (
          <React.Fragment key={branch.id}>
            <div 
              className="group relative overflow-hidden bg-card-bg border border-white/5 hover:border-accent-gold/50 transition-all duration-700 cursor-pointer shadow-2xl rounded-xl"
              onClick={() => handleSelect(branch.id)}
            >
              {/* Imagen con Overlay - Altura reducida en móvil */}
              <div className="aspect-[16/9] md:aspect-[3/4] overflow-hidden">
                <img 
                  src={branch.image} 
                  alt={branch.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 opacity-60 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
              </div>

              {/* Info de la Sucursal - Textos ajustados para no cortarse */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-700">
                <h3 className="text-accent-gold font-poppins font-black text-xl md:text-4xl uppercase mb-1 md:mb-4 tracking-tighter truncate">
                  {branch.name.split(' - ')[1]}
                </h3>
                <p className="text-text-tiza/60 text-xs md:text-xl font-bold mb-4 md:mb-8 opacity-90 md:opacity-0 group-hover:opacity-100 transition-opacity duration-700 leading-snug truncate">
                  {branch.address}
                </p>
                
                <button className="w-full py-2.5 md:py-5 border border-accent-gold text-accent-gold font-black text-xs md:text-xl uppercase tracking-[0.2em] hover:bg-accent-gold hover:text-main-bg transition-all duration-300 shadow-xl rounded-lg">
                  Elegir Sede
                </button>
              </div>
            </div>
            
            {/* Divisor Visual Prominente (Solo en móvil entre tarjetas) */}
            {index < branches.length - 1 && (
              <div className="md:hidden flex items-center justify-center py-6">
                <div className="h-[1px] w-20 bg-accent-gold/40"></div>
                <div className="w-2 h-2 rounded-full bg-accent-gold/60 border border-text-tiza/30 mx-3 shadow-[0_0_10px_rgba(197,160,89,0.3)]"></div>
                <div className="h-[1px] w-20 bg-accent-gold/40"></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Footer minimal - Reducido */}
      <div className="mt-16 md:mt-32 text-text-tiza/20 text-[8px] md:text-lg font-black uppercase tracking-[0.4em]">
        Exclusive Grooming • Pure Excellence
      </div>
    </div>
  );
};

export default BranchSelector;
