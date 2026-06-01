import React, { useState, useMemo, useEffect } from 'react';
import { getOccupiedSlots, fetchBarbersByBranch, saveBooking } from '../services/sheetsService';
import { formatCurrency } from '../utils/formatters';
import { SERVICES } from '../config';
import useScrollReveal from '../hooks/useScrollReveal';

/**
 * StoreFront Component - INDESTRUCTIBLE EDITION (Mobile Optimized)
 */
const StoreFront = ({ config }) => {
  const addToRefs = useScrollReveal();
  const [step, setStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorShake, setErrorShake] = useState(false);

  // --- ESTADOS DE SELECCIÓN ---
  const [selectedService, setSelectedService] = useState(null);
  const [barbers, setBarbers] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [occupiedSlots, setOccupiedSlots] = useState([]);

  // --- ESTADO DE CALENDARIO ---
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // --- ESTADOS DE FORMULARIO ---
  const [customerData, setCustomerData] = useState({ name: '', phone: '' });

  const triggerError = () => {
    setErrorShake(true);
    setTimeout(() => setErrorShake(false), 400);
  };

  /**
   * handleNextStep - Avance Forzado de Pantalla
   */
  const handleNextStep = (nextStep, validationValue) => {
    if (!validationValue) {
      triggerError();
      return;
    }
    setIsLoading(false); 
    setStep(nextStep);
  };

  // Carga de barberos
  useEffect(() => {
    if (config?.id) {
      fetchBarbersByBranch(config.id)
        .then(data => setBarbers(Array.isArray(data) ? data : []))
        .catch(() => setBarbers([]));
    }
  }, [config?.id]);

  const filteredServices = useMemo(() => {
    const list = Array.isArray(SERVICES) ? SERVICES : [];
    return list.filter(s => s?.title?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  // --- CALENDARIO ---
  const calendarData = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // El primer día del mes
    const firstDayDate = new Date(year, month, 1);
    const firstDay = firstDayDate.getDay(); // 0 = Domingo, 1 = Lunes...
    
    // Ajuste para que la semana empiece en Lunes (0=L, 1=M ... 6=D)
    const startingDay = firstDay === 0 ? 6 : firstDay - 1;
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Días vacíos al inicio
    for (let i = 0; i < startingDay; i++) {
      days.push({ day: null });
    }

    // Días del mes
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isSunday = date.getDay() === 0;
      
      // Formato local YYYY-MM-DD para evitar problemas de UTC
      const localFullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      
      days.push({
        day: i,
        fullDate: localFullDate,
        // Un día está deshabilitado si es anterior a hoy o si es Domingo
        disabled: date < today || isSunday,
        isSunday: isSunday
      });
    }
    return days;
  }, [currentMonth]);

  // Funciones seguras para cambiar de mes (evitan el error del día 31)
  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Carga de horarios
  useEffect(() => {
    if (selectedDate && selectedBarber?.id && config?.id) {
      setIsLoading(true);
      getOccupiedSlots(selectedDate, config.id, selectedBarber.id)
        .then(slots => setOccupiedSlots(Array.isArray(slots) ? slots : []))
        .catch(() => setOccupiedSlots([]))
        .finally(() => setIsLoading(false));
    }
  }, [selectedDate, selectedBarber?.id, config?.id]);

  const hours = useMemo(() => {
    const h = [];
    for (let i = 9; i < 20; i++) h.push(`${i.toString().padStart(2, '0')}:00`);
    return h;
  }, []);

  const handleWhatsAppBooking = async () => {
    if (!customerData.name || !customerData.phone) {
      triggerError();
      return;
    }

    const bookingPayload = {
      name: customerData.name,
      phone: customerData.phone,
      service: selectedService?.title,
      barber: selectedBarber?.name,
      barberId: selectedBarber?.id,
      date: selectedDate,
      time: selectedTime,
      branchId: config?.id
    };

    setIsLoading(true);
    try {
      // 1. Guardamos en la base de datos (Google Sheets)
      await saveBooking(bookingPayload);
      
      // 2. Enviamos el mensaje de WhatsApp
      const message = `*NUEVA RESERVA*%0A` +
        `Sede: ${config?.name || 'BarberFlow'}%0A` +
        `Cliente: ${customerData.name}%0A` +
        `Servicio: ${selectedService?.title}%0A` +
        `Barbero: ${selectedBarber?.name}%0A` +
        `Cita: ${selectedDate} - ${selectedTime} HS`;
      
      window.open(`https://wa.me/${config?.whatsapp}?text=${message}`, '_blank');
      
      // 3. Reiniciamos o redirigimos (opcional)
      alert("Reserva registrada con éxito. Redirigiendo a WhatsApp...");
    } catch (error) {
      console.error("Error al procesar reserva:", error);
      alert("Hubo un problema al guardar la reserva, pero podés enviarla por WhatsApp igualmente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`max-w-6xl mx-auto px-6 pt-10 pb-32 md:py-32 font-lato text-text-tiza ${errorShake ? 'animate-shake' : ''}`}>

      {/* 1. HEADER DE PROGRESO (Siempre visible) */}
      <div ref={addToRefs} className="mb-12 flex flex-col md:flex-row justify-between items-center gap-6 animate-reveal">
        <div className="text-center md:text-left">
          <span className="text-accent-gold text-xs font-black tracking-[0.5em] uppercase mb-2 block">Reserva Online</span>
          <h2 className="text-3xl md:text-6xl font-poppins font-black uppercase tracking-tighter">
            {step === 1 && 'Elegí Servicio'}
            {step === 2 && 'Tu Barbero'}
            {step === 3 && 'Tu Fecha'}
            {step === 4 && 'Tu Horario'}
            {step === 5 && 'Confirmar'}
          </h2>
        </div>
        {step === 1 && (
          <input 
            type="text" 
            placeholder="Buscar..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-80 bg-white/5 border-2 border-white/10 rounded-xl py-3 px-6 outline-none focus:border-accent-gold transition-all"
          />
        )}
      </div>

      {/* --- PASO 1: SERVICIOS --- */}
      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredServices.map((s) => (
            <div 
              key={s?.id || Math.random()} 
              onClick={() => { setSelectedService(s); handleNextStep(2, s); }}
              className="group glass-card p-6 cursor-pointer hover:border-accent-gold/50 transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-black uppercase tracking-tight group-hover:text-accent-gold">{s?.title}</h3>
                <span className="text-accent-gold font-bold">{formatCurrency(s?.price || 0)}</span>
              </div>
              <p className="text-sm text-text-tiza/50 italic mb-4">{s?.desc}</p>
              <button className="w-full bg-accent-gold text-main-bg py-2 rounded-lg text-xs font-black uppercase tracking-widest">Seleccionar</button>
            </div>
          ))}
        </div>
      )}

      {/* --- PASO 2: BARBERO --- */}
      {step === 2 && (
        <div className="animate-fade-in">
          <button onClick={() => setStep(1)} className="text-accent-gold/40 text-xs mb-8 uppercase tracking-widest">← Volver</button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {barbers.length > 0 ? barbers.map(b => (
              <div 
                key={b?.id || Math.random()} 
                onClick={() => { setSelectedBarber(b); handleNextStep(3, b); }}
                className="flex flex-col items-center p-10 glass-card hover:border-accent-gold transition-all cursor-pointer"
              >
                <div className="w-20 h-20 rounded-full bg-accent-gold text-main-bg flex items-center justify-center text-3xl font-black mb-4">
                  {b?.name?.charAt(0)}
                </div>
                <h4 className="text-xl font-bold uppercase tracking-widest">{b?.name}</h4>
                <p className="text-[10px] text-accent-gold uppercase tracking-[0.2em]">{b?.specialty}</p>
              </div>
            )) : (
              <p className="col-span-full text-center py-20 opacity-30 italic">Cargando barberos...</p>
            )}
          </div>
        </div>
      )}

      {/* --- PASO 3: CALENDARIO --- */}
      {step === 3 && (
        <div className="animate-fade-in">
          <button onClick={() => setStep(2)} className="text-accent-gold/40 text-xs mb-8 uppercase tracking-widest">← Volver</button>
          <div className="max-w-md mx-auto glass-card p-6 rounded-3xl">
            <div className="flex justify-between items-center mb-8">
              <button 
                onClick={handlePrevMonth}
                className="w-10 h-10 flex items-center justify-center text-accent-gold hover:bg-accent-gold/10 rounded-full transition-all"
              >
                ←
              </button>
              <h3 className="text-xl font-bold uppercase">{currentMonth.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}</h3>
              <button 
                onClick={handleNextMonth}
                className="w-10 h-10 flex items-center justify-center text-accent-gold hover:bg-accent-gold/10 rounded-full transition-all"
              >
                →
              </button>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(d => <div key={d} className="text-center text-[10px] text-accent-gold/30 font-black">{d}</div>)}
              {calendarData.map((d, i) => (
                <div key={i} className="aspect-square flex items-center justify-center">
                  {d.day && (
                    <button 
                      disabled={d.disabled}
                      onClick={() => { setSelectedDate(d.fullDate); handleNextStep(4, d.fullDate); }}
                      className={`w-10 h-10 rounded-full font-bold text-sm transition-all
                        ${d.disabled ? 'opacity-10 cursor-not-allowed' : 'text-white hover:bg-accent-gold/20'}
                        ${selectedDate === d.fullDate ? 'bg-accent-gold text-main-bg' : ''}`}
                    >
                      {d.day}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- PASO 4: HORARIOS --- */}
      {step === 4 && (
        <div className="animate-fade-in">
          <button onClick={() => setStep(3)} className="text-accent-gold/40 text-xs mb-8 uppercase tracking-widest">← Volver</button>
          <div className="text-center mb-10"><h3 className="text-2xl font-bold uppercase">{selectedDate}</h3></div>
          
          {isLoading ? (
            <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-accent-gold border-t-transparent rounded-full animate-spin"></div></div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {hours.map(h => (
                <button 
                  key={h}
                  disabled={occupiedSlots.includes(h)}
                  onClick={() => { setSelectedTime(h); handleNextStep(5, h); }}
                  className={`py-6 glass-card font-bold text-xl transition-all
                    ${occupiedSlots.includes(h) ? 'opacity-10' : 'hover:border-accent-gold'}
                    ${selectedTime === h ? 'bg-accent-gold text-main-bg' : ''}`}
                >
                  {h}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- PASO 5: CONFIRMACIÓN --- */}
      {step === 5 && (
        <div className="animate-fade-in max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2 glass-card p-10">
            <h3 className="text-accent-gold text-xs font-black uppercase mb-8">Tu Reserva</h3>
            <div className="space-y-6">
              <div><p className="text-[10px] uppercase text-white/20">Servicio</p><p className="text-xl font-bold">{selectedService?.title}</p></div>
              <div><p className="text-[10px] uppercase text-white/20">Barbero</p><p className="text-xl font-bold">{selectedBarber?.name}</p></div>
              <div><p className="text-[10px] uppercase text-white/20">Fecha y Hora</p><p className="text-xl font-bold text-accent-gold">{selectedDate} - {selectedTime} HS</p></div>
            </div>
          </div>
          <div className="md:w-1/2 space-y-6">
            <input type="text" placeholder="TU NOMBRE" value={customerData.name} onChange={(e) => setCustomerData({...customerData, name: e.target.value})} className="w-full bg-transparent border-b-2 border-white/10 py-4 outline-none text-xl font-bold focus:border-accent-gold transition-all" />
            <input type="tel" placeholder="TU WHATSAPP" value={customerData.phone} onChange={(e) => setCustomerData({...customerData, phone: e.target.value})} className="w-full bg-transparent border-b-2 border-white/10 py-4 outline-none text-xl font-bold focus:border-accent-gold transition-all" />
            <button onClick={handleWhatsAppBooking} className="w-full bg-accent-gold text-main-bg py-6 font-black uppercase tracking-[0.3em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">Confirmar WhatsApp</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default StoreFront;
