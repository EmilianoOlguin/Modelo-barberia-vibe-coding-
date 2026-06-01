/**
 * Formatters Utility - BarberFlow Standard
 * 
 * Centraliza el formateo de datos para asegurar consistencia visual en toda la plataforma.
 */

/**
 * Formatea un número o string a moneda local ($ 0.000).
 * @param {number|string} amount - El valor a formatear.
 * @returns {string} - Valor formateado.
 */
export const formatCurrency = (amount) => {
  // Limpiamos el valor por si viene con símbolos de moneda previos
  const numericValue = typeof amount === 'string' 
    ? parseFloat(amount.replace(/[^0-9.-]+/g, "")) 
    : amount;

  if (isNaN(numericValue)) return "$ 0";

  // Usamos Intl.NumberFormat para un formateo estándar y profesional
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericValue).replace('$', '$ '); // Agregamos el espacio solicitado
};
