/**
 * BarberFlow - Centralized Configuration System
 */

export const BRANCHES = {
  'SUCURSAL_CENTRO': {
    id: 'SUCURSAL_CENTRO',
    name: 'BarberFlow - Centro Histórico',
    scriptUrl: 'https://script.google.com/macros/s/AKfycbznohFzfgE4gpBL2tPJlYhqayCtfB56FpBVeenC_j5zuk-EDMguHH0rU0rfsSc8UoKn/exec', // URL final vinculada
    googleSheetUrl: 'https://docs.google.com/spreadsheets/d/1Eqfg_2Ka-3_Z2PMQYuq26KoUR5p6o94UcvUmNDuBSpI/gviz/tq?tqx=out:csv',
    whatsapp: '5492657210268',
    turnDurationMinutes: 60,
    address: 'Av. Principal 123',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800', 
  },
  'SUCURSAL_NORTE': {
    id: 'SUCURSAL_NORTE',
    name: 'BarberFlow - Norte Plaza',
    scriptUrl: '', // Pendiente vincular
    googleSheetUrl: '',
    whatsapp: '5491199999999',
    turnDurationMinutes: 60,
    address: 'Calle Ficticia 456',
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800', 
  },
  'SUCURSAL_CABA': {
    id: 'SUCURSAL_CABA',
    name: 'BarberFlow - CABA Elite',
    scriptUrl: '', // Pendiente vincular
    googleSheetUrl: '',
    whatsapp: '5491100000000',
    turnDurationMinutes: 45,
    address: 'Av. Libertador 2500',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=800', 
  }
};

/**
 * SERVICIOS GLOBALES: Centralizados para facilitar el mantenimiento y la consistencia.
 */
export const SERVICES = [
  { 
    id: 1, 
    title: 'Corte solo', 
    duration: '45m', 
    price: 10000, 
    desc: 'Corte profesional con asesoramiento de imagen.' 
  },
  { 
    id: 2, 
    title: 'Corte + Barba', 
    duration: '1h 15m', 
    price: 15000, 
    desc: 'Combo completo para renovar tu look facial.' 
  },
  { 
    id: 3, 
    title: 'Corte + Cejas', 
    duration: '1h', 
    price: 12000, 
    desc: 'Perfilado de cejas y corte de cabello.' 
  },
  { 
    id: 4, 
    title: 'Barba sola', 
    duration: '30m', 
    price: 8000, 
    desc: 'Perfilado clásico con toalla caliente.' 
  },
  { 
    id: 5, 
    title: 'Combo del Entorno (Corte + Barba + Cejas)', 
    duration: '1h 30m', 
    price: 18000, 
    desc: 'La experiencia definitiva: cuidado premium para tu rostro y cabello.' 
  }
];

/**
 * Factory Function/Getter para obtener la configuración de una sucursal.
 */
export const getBranchConfig = (branchId) => {
  const config = BRANCHES[branchId];
  if (!config) return null;
  return config;
};

// Mantenemos APP_CONFIG para compatibilidad, pero ahora intenta leer de localStorage primero.
const getInitialConfig = () => {
  const savedId = localStorage.getItem('selected_branch_id');
  return getBranchConfig(savedId) || BRANCHES['SUCURSAL_CENTRO'];
};

export const APP_CONFIG = getInitialConfig();
