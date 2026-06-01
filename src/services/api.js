import Papa from 'papaparse';

// Cache dinámica por sucursal
let availabilityCache = {};
let lastFetchTime = {};
const CACHE_DURATION = 10000;

/**
 * fetchAvailability - Obtiene los turnos para una sucursal específica
 */
export const fetchAvailability = async (branchConfig, forceRefresh = false) => {
  const branchId = branchConfig.id;
  const now = Date.now();
  
  if (!forceRefresh && availabilityCache[branchId] && (now - lastFetchTime[branchId] < CACHE_DURATION)) {
    return availabilityCache[branchId];
  }

  try {
    // Si hay un scriptUrl configurado para la sede, intentamos usarlo
    if (branchConfig.scriptUrl) {
      const response = await fetch(branchConfig.scriptUrl);
      const data = await response.json();
      if (data.bookings) {
        availabilityCache[branchId] = data.bookings;
        lastFetchTime[branchId] = now;
        return data.bookings;
      }
    }

    // Fallback al CSV si el script no está disponible
    return new Promise((resolve, reject) => {
      Papa.parse(branchConfig.googleSheetUrl, {
        download: true,
        header: true,
        complete: (results) => {
          const occupied = results.data
            .filter(row => row.Fecha && row.Hora)
            .map(row => ({
              fecha: row.Fecha.trim(),
              hora: row.Hora.trim(),
              name: row.Nombre?.trim() || row.Cliente?.trim(),
              service: row.Servicio?.trim(),
              barberoId: row.BarberoID?.trim(),
              branch: row.Sucursal?.trim(),
              type: row.Tipo?.trim() || 'BOOKING'
            }));
          availabilityCache[branchId] = occupied;
          lastFetchTime[branchId] = now;
          resolve(occupied);
        },
        error: (error) => reject(error)
      });
    });
  } catch (error) {
    console.error(`[DataEngine]: Fallo en sucursal ${branchId}`, error);
    return availabilityCache[branchId] || [];
  }
};

/**
 * postBooking - Envía el turno al script específico de la sucursal
 */
export const postBooking = async (bookingData, scriptUrl) => {
  if (!scriptUrl) {
    console.error("[DataEngine]: No hay URL de script para esta sede.");
    return { success: false, error: "No config" };
  }

  try {
    await fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });
    return { success: true };
  } catch (error) {
    console.error("[DataEngine]: Error en postBooking:", error);
    throw error;
  }
};
