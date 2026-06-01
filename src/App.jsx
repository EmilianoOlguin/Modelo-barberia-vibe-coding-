import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StoreFront from './components/StoreFront';
import Services from './components/Services';
import Gallery from './components/Gallery';
import ErrorBoundary from './components/ErrorBoundary';
import BranchSelector from './components/BranchSelector';
import AdminPanel from './pages/AdminPanel';
import { getBranchConfig } from './config';

/**
 * Main Content - Componente que envuelve la experiencia de la barbería
 */
const MainApp = ({ activeConfig, selectedBranchId, onResetBranch }) => {
  return (
    <div className="min-h-screen bg-main-bg font-lato text-text-tiza selection:bg-accent-gold selection:text-main-bg relative">
      <header className="fixed top-0 left-0 w-full z-50 p-4 md:p-10 pointer-events-none">
        <h1 className="text-2xl md:text-5xl font-extrabold text-accent-gold tracking-tighter drop-shadow-2xl pointer-events-auto">
          BarberFlow
        </h1>
      </header>

      <Navbar branchName={activeConfig.name} onResetBranch={onResetBranch} />

      <main className="pt-20 md:pt-24">
        <Hero config={activeConfig} />
        <section id="agenda" className="bg-main-bg">
          <ErrorBoundary>
            <StoreFront config={activeConfig} />
          </ErrorBoundary>
        </section>
        <Services branchId={selectedBranchId} />
        <Gallery branchName={activeConfig.name} />
      </main>

      {/* Botón Flotante de WhatsApp - Tamaño Fijo 50x50 */}
      <a 
        href={`https://wa.me/${activeConfig.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[100] bg-[#25D366] w-[50px] h-[50px] flex items-center justify-center rounded-full shadow-[0_10px_25px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform active:scale-95 group"
      >
        <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 group-hover:opacity-40"></div>
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.067 2.877 1.215 3.076.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.393 0 12.029c0 2.119.554 4.188 1.612 6.049L0 24l6.104-1.601a11.82 11.82 0 005.942 1.603h.005c6.634 0 12.032-5.396 12.035-12.032a11.763 11.763 0 00-3.53-8.513" />
        </svg>
      </a>
      <footer className="py-24 border-t border-white/5 bg-main-bg text-center px-6">
        <div className="mb-12">
          <span className="text-accent-gold font-poppins font-bold text-3xl tracking-widest uppercase block mb-4">
            {activeConfig.name.split(' - ')[0]}
          </span>
          <button 
            onClick={onResetBranch}
            className="w-full md:w-auto mt-6 border-2 border-accent-gold text-accent-gold px-12 py-5 rounded-full text-xl md:text-2xl font-black uppercase tracking-[0.2em] hover:bg-accent-gold hover:text-main-bg transition-all active:scale-95 shadow-[0_0_30px_rgba(197,160,89,0.1)]"
          >
            Cambiar de Sucursal
          </button>
        </div>
        <div className="text-sm md:text-lg text-text-tiza/40 uppercase tracking-[0.3em]">
          © 2026 BarberFlow • Luxury Experience
        </div>
      </footer>
    </div>
  );
};

function App() {
  const [selectedBranchId, setSelectedBranchId] = useState(() => localStorage.getItem('selected_branch_id'));
  const activeConfig = selectedBranchId ? getBranchConfig(selectedBranchId) : null;
  const navigate = useNavigate();

  const handleBranchSelect = (id) => {
    if (id) {
      localStorage.setItem('selected_branch_id', id);
    } else {
      localStorage.removeItem('selected_branch_id');
    }
    setSelectedBranchId(id);
    navigate('/');
  };

  return (
    <Routes>
      {/* Ruta Principal: Maneja el Selector de Sedes o la App */}
      <Route 
        path="/" 
        element={
          !activeConfig ? (
            <BranchSelector onSelect={handleBranchSelect} />
          ) : (
            <MainApp 
              activeConfig={activeConfig} 
              selectedBranchId={selectedBranchId} 
              onResetBranch={() => handleBranchSelect(null)} 
            />
          )
        } 
      />

      {/* Ruta de Administración */}
      <Route path="/admin" element={<AdminPanel />} />

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
