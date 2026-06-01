import React, { useState, useEffect, useMemo } from 'react';
import { APP_CONFIG } from '../config';
import { fetchAvailability, postBooking } from '../services/api';
import { formatCurrency } from '../utils/formatters';

/**
 * AdminPanel Component - The "Villanos" Control Center
 * 
 * Este dashboard permite al dueño de la barbería gestionar la operatividad
 * en tiempo real. Mantiene la estética Luxury Dark con un enfoque funcional.
 */
const AdminPanel = () => {
  // --- ESTADO DE SUCURSAL ---
  const [selectedBranchId, setSelectedBranchId] = useState(() => localStorage.getItem('selected_branch_id') || 'SUCURSAL_CENTRO');
  const activeBranch = APP_CONFIG; // O usar getBranchConfig(selectedBranchId)

  // --- ESTADOS DE DATOS ---
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // --- ESTADOS DE CONFIGURACIÓN ---
  const [config, setConfig] = useState({
    price: '$4500',
    whatsapp: activeBranch.whatsapp,
    bannerText: '10% OFF PAGANDO EN EFECTIVO'
  });

  // --- CARGA DE DATOS ---
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAvailability(activeBranch, true);
        const sortedData = data.sort((a, b) => a.hora.localeCompare(b.hora));
        setBookings(sortedData);
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [selectedBranchId]);

  // --- MÉTRICAS CALCULADAS (Memoizadas para performance) ---
  const metrics = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const turnsToday = bookings.filter(b => b.fecha === today).length;
    const revenue = turnsToday * parseInt(config.price.replace('$', ''));
    const capacity = Math.round((turnsToday / 11) * 100); // Asumiendo 11 slots de 1h (9 a 20)

    return { turnsToday, revenue, capacity };
  }, [bookings, config.price]);

  // --- FUNCIÓN PARA BLOQUEAR HORARIO ---
  const handleBlockTime = async () => {
    if (!window.confirm(`¿Bloquear horario ${blockSlot.time} el día ${blockSlot.date}?`)) return;
    
    try {
      await postBooking({
        name: "BLOQUEADO (ADMIN)",
        date: blockSlot.date,
        time: blockSlot.time,
        type: 'BLOCK'
      });
      alert("Horario bloqueado con éxito.");
      window.location.reload(); // Recarga simple para actualizar lista
    } catch (error) {
      alert("Error al bloquear horario.");
    }
  };

  return (
    <div className="min-h-screen bg-main-bg text-text-tiza p-4 md:p-8 font-lato">
      
      {/* HEADER DEL DASHBOARD */}
      <div className="flex justify-between items-end mb-12 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-poppins font-black text-accent-gold uppercase tracking-tighter">Control Villanos</h1>
          <p className="text-white/30 text-xs uppercase tracking-widest mt-1">Gestión Centralizada de Sucursal</p>
        </div>
        <div className="text-right hidden md:block">
          <span className="text-[10px] bg-accent-gold/10 text-accent-gold px-3 py-1 font-bold uppercase tracking-widest border border-accent-gold/20">Admin Session</span>
        </div>
      </div>

      {/* 1. MÉTRICAS (Cards Superiores) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-card-bg border border-white/5 p-6 relative overflow-hidden group">
          <span className="text-white/20 text-[10px] uppercase font-bold tracking-widest">Turnos Hoy</span>
          <div className="text-4xl font-poppins font-black mt-2 text-accent-gold">{metrics.turnsToday}</div>
          <div className="absolute -right-4 -bottom-4 text-white/5 text-6xl font-black group-hover:scale-110 transition-transform italic">#01</div>
        </div>
        <div className="bg-card-bg border border-white/5 p-6 relative overflow-hidden group">
          <span className="text-white/20 text-[10px] uppercase font-bold tracking-widest">Recaudación Est.</span>
          <div className="text-4xl font-poppins font-black mt-2 text-accent-gold">{formatCurrency(metrics.revenue)}</div>
          <div className="absolute -right-4 -bottom-4 text-white/5 text-6xl font-black group-hover:scale-110 transition-transform italic">$</div>
        </div>
        <div className="bg-card-bg border border-white/5 p-6 relative overflow-hidden group">
          <span className="text-white/20 text-[10px] uppercase font-bold tracking-widest">Capacidad Ocupada</span>
          <div className="text-4xl font-poppins font-black mt-2 text-accent-gold">{metrics.capacity}%</div>
          <div className="w-full bg-white/5 h-1 mt-4">
             <div className="bg-accent-gold h-full transition-all duration-1000" style={{ width: `${metrics.capacity}%` }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* 2. LISTADO DE TURNOS (Tabla central) */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-poppins font-bold uppercase tracking-widest flex items-center gap-3">
               <span className="w-2 h-2 bg-accent-gold rounded-full animate-pulse"></span>
               Agenda Próxima
            </h2>
            <button 
              onClick={() => window.location.reload()} 
              className="text-[10px] text-accent-gold/50 hover:text-accent-gold uppercase font-black tracking-widest transition-all"
            >
              ⟳ Actualizar Lista
            </button>
          </div>
          <div className="bg-card-bg border border-white/5 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/40 uppercase text-[10px] tracking-widest">
                  <th className="p-4 font-normal">Hora</th>
                  <th className="p-4 font-normal">Fecha</th>
                  <th className="p-4 font-normal">Cliente / Servicio</th>
                  <th className="p-4 font-normal">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr><td colSpan="4" className="p-8 text-center text-white/20 uppercase tracking-widest animate-pulse">Sincronizando con base de datos...</td></tr>
                ) : bookings.length === 0 ? (
                  <tr><td colSpan="4" className="p-8 text-center text-white/20 uppercase">Sin turnos registrados</td></tr>
                ) : bookings.map((b, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-poppins font-bold text-accent-gold">{b.hora}</td>
                    <td className="p-4 text-white/60">{b.fecha}</td>
                    <td className="p-4">
                      <div className="font-bold text-white/80">{b.name || 'Sin Nombre'}</div>
                      <div className="text-[10px] text-white/30 uppercase">{b.service || 'Servicio General'}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-tighter ${b.type === 'BLOCK' ? 'text-red-400 bg-red-400/10' : 'text-green-400 bg-green-400/10'}`}>
                        {b.type === 'BLOCK' ? 'BLOQUEADO' : 'CONFIRMADO'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. CONFIGURACIÓN & BLOQUEO */}
        <div className="space-y-8">
          
          {/* Módulo de Configuración */}
          <div className="bg-card-bg border border-white/5 p-6">
            <h3 className="text-sm font-poppins font-bold uppercase mb-6 border-b border-white/10 pb-2 tracking-widest">Business Config</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase text-white/40 block mb-1">Precio Base Servicio</label>
                <input type="text" value={config.price} onChange={e => setConfig({...config, price: e.target.value})} className="w-full bg-main-bg border border-white/10 p-2 text-sm outline-none focus:border-accent-gold" />
              </div>
              <div>
                <label className="text-[10px] uppercase text-white/40 block mb-1">WhatsApp Sucursal</label>
                <input type="text" value={config.whatsapp} onChange={e => setConfig({...config, whatsapp: e.target.value})} className="w-full bg-main-bg border border-white/10 p-2 text-sm outline-none focus:border-accent-gold" />
              </div>
              <div>
                <label className="text-[10px] uppercase text-white/40 block mb-1">Banner de Anuncios</label>
                <textarea value={config.bannerText} onChange={e => setConfig({...config, bannerText: e.target.value})} className="w-full bg-main-bg border border-white/10 p-2 text-sm outline-none focus:border-accent-gold h-20 resize-none" />
              </div>
              <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-bold uppercase py-3 tracking-widest transition-all">Guardar Cambios</button>
            </div>
          </div>

          {/* 4. BOTÓN DE BLOQUEO DE HORARIO */}
          <div className="bg-accent-gold/5 border border-accent-gold/20 p-6">
            <h3 className="text-sm font-poppins font-bold uppercase mb-6 text-accent-gold tracking-widest italic">Break Manager</h3>
            <div className="space-y-4">
              <input type="date" value={blockSlot.date} onChange={e => setBlockSlot({...blockSlot, date: e.target.value})} className="w-full bg-main-bg border border-accent-gold/20 p-2 text-sm text-accent-gold outline-none" />
              <select value={blockSlot.time} onChange={e => setBlockSlot({...blockSlot, time: e.target.value})} className="w-full bg-main-bg border border-accent-gold/20 p-2 text-sm text-accent-gold outline-none">
                {Array.from({length: 11}, (_, i) => `${i+9}:00`).map(h => <option key={h} value={h}>{h} HS</option>)}
              </select>
              <button onClick={handleBlockTime} className="w-full bg-accent-gold text-main-bg font-black uppercase text-[10px] py-4 tracking-[0.2em] hover:brightness-110 transition-all">
                BLOQUEAR HORARIO
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
nClick={handleBlockTime} className="w-full bg-accent-gold text-main-bg font-black uppercase text-[10px] py-4 tracking-[0.2em] hover:brightness-110 transition-all">
                BLOQUEAR HORARIO
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
