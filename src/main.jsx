import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AdminPanel from './pages/AdminPanel.jsx'

/**
 * Orquestador de Rutas - BarberFlow
 * Aquí definimos los "links" de acceso a cada sección.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Link Principal: La web de reserva para clientes */}
        <Route path="/" element={<App />} />
        
        {/* Link de Administración: El panel para el dueño */}
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
