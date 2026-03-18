import React, { useState, useRef } from 'react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { generateControls } from '@/utils/ControlsGenerator.js';

const CameraToolPage = () => {

  const fileInputRef = useRef(null);

  const [fileContent, setFileContent] = useState('');
  const [output, setOutput] = useState('');
  const [fileName, setFileName] = useState('');

  const [ctrl, setCtrl] = useState(true);
  const [shift, setShift] = useState(true);
  const [alt, setAlt] = useState(false);

  // 🔥 DEFAULT F9 ACTIVO
  const [useF9, setUseF9] = useState(true);
  const [key, setKey] = useState("f9");

  // ================= FILE =================
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

  // ================= COMBO =================
  const buildCombo = () => {
    let parts = [];

    if (ctrl) parts.push("(keyboard.lctrl?0 | keyboard.rctrl?0)");
    if (shift) parts.push("(keyboard.lshift?0 | keyboard.rshift?0)");
    if (alt) parts.push("(keyboard.lalt?0 | keyboard.ralt?0)");

    parts.push(`keyboard.${key}?0`);

    return parts.join(" & ");
  };

  // ================= GENERATE =================
  const handleGenerate = () => {
    if (!fileContent) {
      alert("Sube un archivo primero");
      return;
    }

    const combo = buildCombo();
    const result = generateControls(fileContent, combo);
    setOutput(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    alert("Copiado!");
  };

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

        {/* UPLOAD */}
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

        {/* ===== ACTIVAR CÁMARA CERO ===== */}
        <div className="bg-[#111] border border-gray-700 p-6 rounded-xl mb-6">

          <h2 className="mb-6 font-semibold text-lg">Activar Cámara Cero</h2>

          <div className="flex items-center justify-between flex-wrap gap-6">

            {/* MODIFIERS + F9 */}
            <div className="flex items-center gap-6">

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={ctrl} onChange={() => setCtrl(!ctrl)} />
                CTRL
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={shift} onChange={() => setShift(!shift)} />
                SHIFT
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={alt} onChange={() => setAlt(!alt)} />
                ALT
              </label>

              {/* 🔥 F9 COMO OPCIÓN PRINCIPAL */}
              <label className="flex items-center gap-2 cursor-pointer">

                <input
                  type="checkbox"
                  checked={useF9}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setUseF9(checked);

                    if (checked) {
                      setKey("f9");
                    } else {
                      setKey("z"); // default cuando lo quitan
                    }
                  }}
                />

                <span className={`px-3 py-1 rounded border text-sm
                  ${useF9
                    ? "bg-yellow-500 text-black border-yellow-400"
                    : "border-gray-600"}
                `}>
                  F9
                </span>

              </label>

            </div>

            {/* INPUT */}
            <input
              value={useF9 ? "f9" : key}
              onChange={(e) => {
                const val = e.target.value.slice(0,1).toLowerCase();
                if (val) setKey(val);
              }}
              disabled={useF9}
              className={`w-24 h-14 text-center text-xl font-semibold 
              bg-black text-white 
              border rounded-lg outline-none
              transition-all duration-200
              ${useF9
                ? "border-yellow-400 text-yellow-300 bg-[#1a1a1a] cursor-not-allowed"
                : "border-gray-600 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 hover:border-yellow-400/50"
              }`}
            />

          </div>

        </div>

        {/* BOTÓN GENERAR */}
        <button
          onClick={handleGenerate}
          className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition mb-6"
        >
          Generar Controls
        </button>

        {/* OUTPUT */}
        {output && (
          <div className="bg-[#111] border border-gray-700 rounded-xl p-4">

            <textarea
              value={output}
              readOnly
              className="w-full h-64 bg-black p-4 rounded text-sm mb-4"
            />

            <div className="flex gap-4">

              <button onClick={handleCopy} className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">
                Copiar
              </button>

              <button onClick={handleDownload} className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700">
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