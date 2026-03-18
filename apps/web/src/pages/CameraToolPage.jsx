import React, { useState, useRef } from 'react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { generateControls } from '@/utils/ControlsGenerator.js';

const CameraToolPage = () => {

  const fileInputRef = useRef(null);

  const [fileContent, setFileContent] = useState('');
  const [output, setOutput] = useState('');
  const [fileName, setFileName] = useState('');

  // 🎮 estados
  const [ctrl, setCtrl] = useState(true);
  const [shift, setShift] = useState(true);
  const [alt, setAlt] = useState(false);
  const [key, setKey] = useState("z");

  // 📂 upload
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

  // 🧠 build combo
  const buildCombo = () => {
    let parts = [];

    if (ctrl) parts.push("(keyboard.lctrl?0 | keyboard.rctrl?0)");
    if (shift) parts.push("(keyboard.lshift?0 | keyboard.rshift?0)");
    if (alt) parts.push("(keyboard.lalt?0 | keyboard.ralt?0)");

    parts.push(`keyboard.${key}?0`);

    return parts.join(" & ");
  };

  // 🚀 generate
  const handleGenerate = () => {
    if (!fileContent) {
      alert("Sube un archivo primero");
      return;
    }

    const combo = buildCombo();
    const result = generateControls(fileContent, combo);
    setOutput(result);
  };

  // 📋 copy
  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    alert("Copiado!");
  };

  // ⬇ download
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
    <div className="min-h-screen bg-[#0b0b0f] text-white">

      <Header />

      <div className="max-w-5xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-8">
          🎮 Controls Generator (Camera Zero)
        </h1>

        {/* 📂 Upload */}
        <div
          onClick={() => fileInputRef.current.click()}
          className="cursor-pointer border border-gray-700 bg-[#111] p-6 rounded-xl mb-6 hover:border-yellow-400 transition text-center"
        >
          <input
            type="file"
            accept=".sii,.txt"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />

          <p className="text-gray-400">
            {fileName ? `📂 ${fileName}` : "Click para subir controls.sii"}
          </p>
        </div>

        {/* 🎮 CONTROLES */}
        <div className="bg-[#111] border border-gray-700 p-6 rounded-xl mb-6">

          <h2 className="mb-4 font-semibold text-lg">Cámara Cero</h2>

          <div className="flex items-center gap-6 flex-wrap">

            {/* CTRL */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={ctrl}
                onChange={() => setCtrl(!ctrl)}
              />
              CTRL
            </label>

            {/* SHIFT */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={shift}
                onChange={() => setShift(!shift)}
              />
              SHIFT
            </label>

            {/* ALT */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={alt}
                onChange={() => setAlt(!alt)}
              />
              ALT
            </label>

            {/* 🔥 INPUT + F KEYS */}
            <div className="flex flex-col gap-3">

              <input
                value={key}
                onChange={(e) => setKey(e.target.value.slice(0,1).toLowerCase())}
                className="bg-black border border-gray-600 rounded px-4 py-2 w-24 text-center"
                placeholder="z"
              />

              <div className="flex flex-wrap gap-2">

                {[
                  "f1","f2","f3","f4","f5","f6",
                  "f7","f8","f9","f10","f11","f12"
                ].map((fKey) => (
                  <button
                    key={fKey}
                    onClick={() => setKey(fKey)}
                    className={`px-3 py-1 rounded border text-sm transition 
                      ${key === fKey 
                        ? "bg-yellow-500 text-black border-yellow-400" 
                        : "bg-[#111] border-gray-600 hover:border-yellow-400"}
                    `}
                  >
                    {fKey.toUpperCase()}
                  </button>
                ))}

              </div>

            </div>

          </div>
        </div>

        {/* 🚀 BOTÓN */}
        <button
          onClick={handleGenerate}
          className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition mb-6"
        >
          Generar Controls
        </button>

        {/* 📄 OUTPUT */}
        {output && (
          <div className="bg-[#111] border border-gray-700 rounded-xl p-4">

            <textarea
              value={output}
              readOnly
              className="w-full h-64 bg-black p-4 rounded text-sm mb-4"
            />

            <div className="flex gap-4">

              <button
                onClick={handleCopy}
                className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
              >
                Copiar
              </button>

              <button
                onClick={handleDownload}
                className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700"
              >
                Descargar
              </button>

            </div>

          </div>
        )}

      </div>

      <Footer />

    </div>
  );
};

export default CameraToolPage;