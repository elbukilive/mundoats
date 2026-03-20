// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from '@/components/ScrollToTop';

// Solo las páginas que ya existen y estás trabajando
import Inicio from '@/paginas/Inicio';
import Config from '@/paginas/Config';
import CamaraCero from '@/paginas/CamaraCero';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Toaster 
        position="top-right" 
        richColors 
        closeButton 
      />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/config" element={<Config />} />
        <Route path="/camara-cero" element={<CamaraCero />} />
        
        {/* Ruta 404 temporal: muestra un mensaje simple hasta que tengas NoEncontrado */}
        <Route path="*" element={
          <div style={{ 
            padding: '4rem', 
            textAlign: 'center', 
            minHeight: '100vh', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center' 
          }}>
            <h1 style={{ fontSize: '3rem', color: '#333' }}>404</h1>
            <p style={{ fontSize: '1.5rem' }}>Página no encontrada</p>
            <p style={{ marginTop: '1rem' }}>
              <a href="/" style={{ color: '#0066cc', textDecoration: 'underline' }}>Volver al inicio</a>
            </p>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;