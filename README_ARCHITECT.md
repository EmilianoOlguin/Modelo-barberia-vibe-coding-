# BarberFlow - Arquitectura Senior

Este proyecto ha sido diseñado bajo los principios de **Modularidad**, **Desacoplamiento** y **Escalabilidad**.

## Estructura de Capas
1. **Config Layer (`src/config.js`)**: Single Source of Truth. Controla la identidad de la sucursal.
2. **UI Layer (`src/components/`)**: Componentes funcionales atómicos. No manejan lógica de persistencia directamente.
3. **Service Layer (`src/services/`)**: Encapsula la comunicación con APIs externas (Google Sheets).
4. **Design System (`tailwind.config.js` & `index.css`)**: Define la identidad visual 'Luxury Dark'.

## Configuración de Google Sheets (Backend)
Para activar la persistencia real:
1. Crear un Google Sheet.
2. Crear un script en `Extensions > Apps Script`.
3. Implementar una función `doPost(e)` que reciba el JSON y lo inserte en la hoja.
4. Desplegar como Web App y pegar la URL en `src/config.js`.

---
*Arquitectura entregada con estándares de ingeniería de software para entornos exclusivos.*
