/** @type {import('tailwindcss').Config} */
// Exportación de la configuración de Tailwind CSS siguiendo estándares de arquitectura escalable.
export default {
  // Definición de las rutas de los archivos donde Tailwind buscará clases para purgar el CSS no utilizado.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // Extensión del tema por defecto para inyectar la identidad visual 'Luxury Dark' de BarberFlow.
    extend: {
      colors: {
        // 'main-bg': Color primario de fondo para una experiencia inmersiva y elegante.
        'main-bg': '#0d0d0d',
        // 'accent-gold': Color de acento premium, evoca exclusividad y calidad (Dorado Villanos).
        'accent-gold': '#C5A059',
        // 'text-tiza': Blanco roto para legibilidad óptima sin el contraste agresivo del blanco puro.
        'text-tiza': '#F5F5F7',
        // 'card-bg': Gris profundo para contenedores y tarjetas, creando jerarquía visual sobre el fondo.
        'card-bg': '#1a1a1a',
      },
      fontFamily: {
        // Configuración de tipografías principales definidas en el diseño de marca.
        'poppins': ['Poppins', 'sans-serif'],
        'lato': ['Lato', 'sans-serif'],
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        }
      },
      animation: {
        shake: 'shake 0.2s ease-in-out 0s 2',
      }
    },
  },
  // Plugins adicionales de Tailwind pueden ser integrados aquí (ej. forms, typography).
  plugins: [],
}
