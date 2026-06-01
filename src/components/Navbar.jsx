import React from 'react';

/**
 * Navbar Component - BarberFlow Luxury Edition
 */
const Navbar = ({ branchName, onResetBranch }) => {
  const brand = branchName ? branchName.split(' - ')[0] : 'BarberFlow';
  const location = branchName ? branchName.split(' - ')[1] : '';

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-main-bg/80 backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto px-6 h-24 flex items-center justify-between">
        {/* Branding - Movido a la izquierda con impacto Senior */}
        <div className="flex flex-col cursor-pointer group" onClick={onResetBranch}>
          <span className="text-accent-gold font-poppins font-black text-3xl md:text-5xl tracking-tighter uppercase leading-none group-hover:scale-105 transition-transform origin-left">
            {brand}
          </span>
          {location && (
            <span className="text-xs md:text-sm text-text-tiza/40 uppercase tracking-[0.4em] font-black mt-1">
              Sede: {location}
            </span>
          )}
        </div>

        {/* Links de navegación - Traducidos y estilizados */}
        <div className="hidden lg:flex items-center gap-12">
          <a href="#inicio" className="text-lg uppercase tracking-[0.2em] font-bold hover:text-accent-gold transition-colors">Inicio</a>
          <a href="#servicios" className="text-lg uppercase tracking-[0.2em] font-bold hover:text-accent-gold transition-colors">Servicios</a>
          <button 
            onClick={() => document.getElementById('agenda').scrollIntoView({ behavior: 'smooth' })}
            className="text-lg uppercase tracking-[0.3em] font-black text-accent-gold border-2 border-accent-gold/40 px-8 py-3 rounded-full hover:bg-accent-gold hover:text-main-bg hover:border-accent-gold transition-all shadow-lg"
          >
            Reservar Cita
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
