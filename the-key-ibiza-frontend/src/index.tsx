import React from 'react';
import ReactDOM from 'react-dom/client';
import 'leaflet/dist/leaflet.css';
import './index.css';    // <-- Tailwind aquí
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("No se encontró el root element");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
