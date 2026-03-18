import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import ConfigToolPage from './pages/ConfigToolPage';
import CameraToolPage from './pages/CameraToolPage';
import ModToolPage from './pages/ModToolPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/config" element={<ConfigToolPage />} />
        <Route path="/camera" element={<CameraToolPage />} />
        <Route path="/mods" element={<ModToolPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;