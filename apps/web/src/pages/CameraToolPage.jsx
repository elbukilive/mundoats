import React, { useState, useRef } from 'react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

import { generateControls } from '@/utils/ControlsGenerator.js';

const CameraToolPage = () => {

  const fileInputRef = useRef(null);

  const [fileContent, setFileContent] = useState('');
  const [output, setOutput] = useState('');
  const [fileName, setFileName] = useState('');

  // 📂 subir archivo
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      setFileContent(event.target.result);
    };
    reader.readAsText(file);
  };

  // 🚀 generar controls
  const handleGenerate = () => {
    if (!fileContent) {
      alert("Sube un archivo primero");
      return;
    }

    const result = generateControls(fileContent, "keyboard.z?0");
    setOutput(result);
  };

  // 📋 copiar
  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    alert("Copiado!");
  };

  // ⬇ descargar
  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "controls.sii";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-black text-white">

      <Header />

      <div className="max-w-4xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-6">
          🎮 Controls Generator (Camera Zero)
        </h1>

        {/* 📂 subir */}
        <div className="mb-6">
          <input
            type="file"
            accept=".sii,.txt"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="mb-4"
          />

          {fileName && (
            <p className="text-green-400">
              Archivo: {fileName}
            </p>
          )}
        </div>

        {/* 🚀 botón */}
        <button
          onClick={handleGenerate}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded mb-6"
        >
          Generar Controls
        </button>

        {/* 📄 preview */}
        {output && (
          <>
            <textarea
              value={output}
              readOnly
              className="w-full h-64 bg-gray-900 p-4 rounded mb-4 text-sm"
            />

            <div className="flex gap-4">
              <button
                onClick={handleCopy}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
              >
                Copiar
              </button>

              <button
                onClick={handleDownload}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
              >
                Descargar
              </button>
            </div>
          </>
        )}

      </div>

      <Footer />

    </div>
  );
};

export default CameraToolPage;