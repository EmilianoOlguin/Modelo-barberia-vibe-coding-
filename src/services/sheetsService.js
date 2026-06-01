import { BRANCHES, SERVICES } from '../config';
import { postBooking, fetchAvailability } from './api';

/**
 * Sheets Service - BarberFlow Data Layer (Stateless)
 */

/**
 * Obtiene los turnos ocupados para una fecha Y un barbero específico.
 */
export const getOccupiedSlots = async (date, branchId, barberId) => {
  try {
    console.log(`[SheetsService]: Consultando agenda real: ${barberId} | ${date}`);
    const branchConfig = BRANCHES[branchId];
    if (!branchConfig) throw new Error("Branch config not found");
    
    const availability = await fetchAvailability(branchConfig, true);
    
    // Filtrar turnos para la fecha, sucursal (si aplica) y barbero
    return availability
      .filter(slot => slot.fecha === date && slot.barberoId === barberId)
      .map(slot => slot.hora);
  } catch (error) {
    console.error('[SheetsService]: Error en slots.', error);
    return [];
  }
};

/**
 * Obtiene barberos activos para una sucursal.
 */
export const fetchBarbersByBranch = async (branchId) => {
  try {
    const barberDatabase = {
      'SUCURSAL_CENTRO': [
        { id: 'b1', name: 'Enzo "The Blade"', specialty: 'Fade & Beard' },
        { id: 'b2', name: 'Julian Classic', specialty: 'Scissors Only' },
      ],
      'SUCURSAL_NORTE': [
        { id: 'b3', name: 'Marcos Street', specialty: 'Freestyle' },
        { id: 'b4', name: 'Santi Gold', specialty: 'Luxury Rituals' },
      ],
      'SUCURSAL_CABA': [
        { id: 'b5', name: 'Franco Elite', specialty: 'Executive Cut' },
        { id: 'b6', name: 'Nico Sharp', specialty: 'Modern Trends' },
      ]
    };

    return new Promise((resolve) => {
      setTimeout(() => resolve(barberDatabase[branchId] || []), 300);
    });
  } catch (error) {
    console.error('[SheetsService]: Error en barberos.', error);
    return [];
  }
};

/**
 * Envía reserva y persiste en la base de datos.
 */
export const saveBooking = async (bookingData) => {
  try {
    console.log('[SheetsService]: Guardando reserva en la base de datos...', bookingData);
    const response = await postBooking({
      ...bookingData,
      timestamp: new Date().toISOString()
    });
    return response;
  } catch (error) {
    console.error('[SheetsService]: Error al guardar en DB.', error);
    // No bloqueamos al usuario si falla la DB, pero notificamos el error en consola
    return { success: false, error };
  }
};
