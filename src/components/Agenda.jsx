import React, { useState, useEffect } from 'react';
import { APP_CONFIG } from '../config';
import { saveBooking, getOccupiedSlots } from '../services/sheetsService';

/**
 * Agenda Component - BarberFlow Booking System
 */
const Agenda = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [occupiedSlots, setOccupiedSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Efecto para cargar disponibilidad cuando cambia la fecha
  useEffect(() => {
    const fetchAvailability = async () => {
      const occupied = await getOccupiedSlots(selectedDate);
      setOccupiedSlots(occupied);
      setSelectedSlot(null); // Resetear selección al cambiar fecha
    };
    fetchAvailability();
  }, [selectedDate]);

  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 9;
    const endHour = 20;
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await saveBooking({
        date: selectedDate,
        time: selectedSlot,
        customerName: 'Cliente VIP', // Esto vendría de un form en el futuro
      });
      setIsSuccess(true);
      // Resetear después de 3 segundos
      setTimeout(() => {
        setIsSuccess(false);
        setSelectedSlot(null);
      }, 3000);
    } catch (error) {
      alert("Hubo un error al procesar tu reserva. Por favor intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const timeSlots = generateTimeSlots();

  if (isSuccess) {
    return (
      <section id="agenda" className="py-24 bg-main-bg text-center">
        <div className="container mx-auto px-4">
          <div className="animate-bounce mb-6 text-6xl">✨</div>
          <h2 className="text-4xl font-poppins font-bold text-accent-gold mb-4 uppercase">¡Turno Reservado!</h2>
          <p className="text-text-tiza/60">Te esperamos el {selectedDate} a las {selectedSlot} hs.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="agenda" className="py-24 bg-main-bg relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-poppins font-bold mb-4 uppercase tracking-tighter">Reservá tu lugar</h2>
          <p className="text-text-tiza/40 max-w-lg mx-auto">
            Seleccioná el día y la hora que mejor te quede.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="bg-card-bg p-8 border border-white/5 rounded-sm">
            <label className="block text-accent-gold text-xs font-bold uppercase tracking-widest mb-4">1. Elegí la Fecha</label>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-main-bg border border-white/10 p-4 text-text-tiza focus:border-accent-gold outline-none transition-all cursor-pointer"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="bg-card-bg p-8 border border-white/5 rounded-sm">
            <label className="block text-accent-gold text-xs font-bold uppercase tracking-widest mb-4">2. Elegí el Horario</label>
            <div className="grid grid-cols-3 gap-3">
              {timeSlots.map((slot) => {
                const isOccupied = occupiedSlots.includes(slot);
                return (
                  <button
                    key={slot}
                    disabled={isOccupied}
                    onClick={() => setSelectedSlot(slot)}
                    className={`
                      py-3 text-sm font-bold transition-all border
                      ${isOccupied ? 'opacity-20 cursor-not-allowed bg-transparent border-white/5' : ''}
                      ${selectedSlot === slot 
                        ? 'bg-accent-gold text-main-bg border-accent-gold scale-105' 
                        : !isOccupied ? 'bg-main-bg text-text-tiza border-white/5 hover:border-accent-gold/50' : ''}
                    `}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className={`mt-16 text-center transition-all duration-500 ${selectedSlot ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
          <button 
            disabled={isLoading}
            className={`
              bg-accent-gold text-main-bg px-12 py-5 font-black uppercase tracking-[0.2em] text-sm transition-all
              ${isLoading ? 'opacity-50 cursor-wait' : 'hover:brightness-110 active:scale-95'}
            `}
            onClick={handleConfirm}
          >
            {isLoading ? 'Procesando...' : 'Confirmar Reserva'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Agenda;
