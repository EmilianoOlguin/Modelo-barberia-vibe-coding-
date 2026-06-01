import React from 'react';

/**
 * ErrorBoundary Component - System Resilience
 * 
 * Captura errores en el árbol de componentes de React para evitar que toda la app falle.
 * Proporciona una "Fallback UI" amigable para el usuario.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el estado para que el siguiente renderizado muestre la interfaz de repuesto.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Aquí se podría enviar el error a un servicio como Sentry o LogRocket
    console.error("[QA ErrorBoundary]: Error capturado:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Interfaz amigable en caso de fallo crítico
      return (
        <div className="min-h-[400px] flex items-center justify-center bg-card-bg border border-accent-gold/20 p-12 text-center rounded-sm">
          <div>
            <div className="text-4xl mb-4">⏳</div>
            <h2 className="text-xl font-poppins font-bold text-accent-gold uppercase tracking-widest mb-2">
              Estamos actualizando la agenda
            </h2>
            <p className="text-white/40 text-sm italic">
              Por favor, intentá en 2 minutos. Estamos optimizando la experiencia para vos.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-8 text-[10px] border border-white/10 px-6 py-2 uppercase tracking-widest hover:bg-white/5 transition-all"
            >
              Reintentar ahora
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
