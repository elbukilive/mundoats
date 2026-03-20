import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { generateConfig } from '@/utilidades/ConfigGenerador';
import { Toaster, toast } from 'sonner';
import { motion } from 'framer-motion';
import { Copy, Download } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const Config = () => {
  const [level, setLevel] = useState('Ultra');
  const [includePerformance, setIncludePerformance] = useState(true);
  const [includeCamera, setIncludeCamera] = useState(true);
  const [buffer, setBuffer] = useState(80);
  const [generatedConfig, setGeneratedConfig] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('Ningún archivo subido');
  const [uploadedConfigText, setUploadedConfigText] = useState('');
  const [hasValidFile, setHasValidFile] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const bufferPresets = {
    'Ultra Bajo': 30,
    'Bajo': 50,
    'Medio': 70,
    'Alto': 80,
    'Ultra': 90,
    'Pro': 100
  };

  const handleLevelChange = (newLevel) => {
    setLevel(newLevel);
    const newBuffer = bufferPresets[newLevel] || 80;
    setBuffer(newBuffer);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.name.endsWith('.cfg')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setUploadedConfigText(event.target.result);
          setUploadedFileName(file.name);
          setHasValidFile(true);
          toast.success(`Archivo listo: ${file.name}`);
        };
        reader.readAsText(file);
      } else {
        toast.error('Solo archivos .cfg');
      }
    }
  };

  const handleGenerate = () => {
    if (!hasValidFile) return;

    setIsGenerating(true);
    try {
      const newConfig = generateConfig(level, {
        includePerformance,
        includeCamera
      }, buffer, uploadedConfigText);
      setGeneratedConfig(newConfig);
      toast.success('Configuración generada');
    } catch (error) {
      toast.error('Error al generar');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedConfig);
    toast.success('Copiado al portapapeles');
  };

  const handleDownload = () => {
    const blob = new Blob([generatedConfig], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'config.cfg';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Descargado');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0b0f] text-white">
      <Helmet>
        <title>MundoATS - Configuración PRO</title>
      </Helmet>

      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-center mb-4 text-yellow-400"
          >
            Configuración ATS PRO
          </motion.h1>

          {/* Nivel de Rendimiento */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-center">Nivel de Rendimiento</h2>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {['Ultra Bajo', 'Bajo', 'Medio', 'Alto', 'Ultra', 'Pro'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => handleLevelChange(lvl)}
                  className={`py-3 px-4 rounded-lg font-medium transition-all ${
                    level === lvl ? 'bg-yellow-400 text-black shadow-lg scale-105' : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-gray-400 mt-4">
              Seleccionado: <span className="text-yellow-400 font-semibold">{level}</span>
            </p>
          </div>

          {/* Slider de Buffer - JUSTO DEBAJO DE LOS BOTONES */}
          <div className="mb-12 bg-[#111] border border-gray-700 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-center">Buffer de Cámara</h3>
            <p className="text-center text-gray-400 mb-4">
              Cantidad de renderizado por adelantado.<br />
              Más alto = cámara más fluida (menos saltos), pero más exigente para el PC
            </p>
            <label className="block text-sm font-medium mb-2 text-center">
              Buffer actual: <span className="text-yellow-400 font-bold">{buffer}</span>
            </label>
            <input
              type="range"
              min="30"
              max="120"
              step="5"
              value={buffer}
              onChange={(e) => setBuffer(Number(e.target.value))}
              className="w-full accent-yellow-400 cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-3 text-center">
              Recomendado 80–100 para PCs potentes
            </p>
          </div>

          {/* Opciones restantes */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-[#111] border border-gray-700 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4">Optimización de Rendimiento</h3>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includePerformance}
                  onChange={(e) => setIncludePerformance(e.target.checked)}
                  className="w-5 h-5 accent-yellow-400"
                />
                <span>Activar optimizaciones de rendimiento</span>
              </label>
            </div>

            <div className="bg-[#111] border border-gray-700 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4">Cámara Cero</h3>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCamera}
                  onChange={(e) => setIncludeCamera(e.target.checked)}
                  className="w-5 h-5 accent-yellow-400"
                />
                <span>Activar Cámara Cero</span>
              </label>
            </div>
          </div>

          {/* Subir archivo */}
          <div className="mb-12 text-center">
            <label className="inline-block bg-yellow-400 text-black px-8 py-4 rounded-xl cursor-pointer hover:bg-yellow-300 transition text-lg font-bold">
              <input type="file" accept=".cfg" onChange={handleFileUpload} className="hidden" />
              Subir tu config.cfg actual
            </label>
            <p className="text-sm text-gray-500 mt-4">{uploadedFileName}</p>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <button
              onClick={handleGenerate}
              disabled={!hasValidFile || isGenerating}
              className={`px-10 py-5 rounded-xl font-bold text-xl transition shadow-lg flex items-center gap-3 ${
                hasValidFile && !isGenerating ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isGenerating ? 'Generando...' : 'Generar Configuración'}
            </button>

            {generatedConfig && (
              <>
                <button
                  onClick={handleCopy}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-xl font-bold text-xl transition shadow-lg flex items-center gap-3"
                >
                  <Copy className="w-6 h-6" /> Copiar
                </button>

                <button
                  onClick={handleDownload}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-10 py-5 rounded-xl font-bold text-xl transition shadow-lg flex items-center gap-3"
                >
                  <Download className="w-6 h-6" /> Descargar
                </button>
              </>
            )}
          </div>

          {/* Vista previa */}
          {generatedConfig && (
            <div className="mt-12">
              <h3 className="text-2xl font-semibold mb-4 text-center">Config Generada</h3>
              <pre className="bg-[#0a0a0f] p-6 rounded-xl overflow-auto max-h-96 text-sm text-gray-300 border border-gray-700 whitespace-pre-wrap">
                {generatedConfig}
              </pre>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
};

export default Config;