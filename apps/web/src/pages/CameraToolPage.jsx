import React, { useState, useRef } from 'react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { generateControls } from '@/utils/ControlsGenerator.js';

const CameraToolPage = () => {

  const fileInputRef = useRef(null);

  const [fileContent, setFileContent] = useState('');
  const [output, setOutput] = useState('');
  const [fileName, setFileName] = useState('');

  // ===== ACTIVAR CÁMARA =====
  const [camKey, setCamKey] = useState("0");

  // ===== TELEPORT =====
  const [tpCtrl, setTpCtrl] = useState(true);
  const [tpShift, setTpShift] = useState(false);
  const [tpAlt, setTpAlt] = useState(false);

  const [tpUseF9, setTpUseF9] = useState(true);
  const [tpKey, setTpKey] = useState("f9");

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

  // ================= BUILD COMBOS =================
  const buildCombo = (ctrl, shift, alt, key) => {
    let parts = [];

    if (ctrl) parts.push("(keyboard.lctrl?0 | keyboard.rctrl?0)");
    if (shift) parts.push("(keyboard.lshift?0 | keyboard.rshift?0)");
    if (alt) parts.push("(keyboard.lalt?0 | keyboard.ralt?0)");

    if (key) parts.push(`keyboard.${key}?0`);

    return parts.join(" & ");
  };

  // ================= GENERATE =================
  const handleGenerate = () => {
    if (!fileContent) {
      alert("Sube un archivo primero");
      return;
    }

    const cameraCombo = buildCombo(false, false, false, camKey);
    const teleportCombo = buildCombo(tpCtrl, tpShift, tpAlt, tpKey);

    const result = generateControls(fileContent, {
      camera: cameraCombo,
      teleport: teleportCombo
    });

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

        {/* ===== ACTIVAR CÁMARA ===== */}
        <div className="bg-[#111] border border-gray-700 p-6 rounded-xl mb-6">

          <h2 className="mb-4 font-semibold text-lg">Activar Cámara Cero</h2>

          <input
            value={camKey}
            onChange={(e) => setCamKey(e.target.value.slice(0,1))}
            className="w-24 h-14 text-center text-xl bg-black border border-gray-600 rounded-lg"
          />

        </div>

        {/* ===== TELEPORT ===== */}
        <div className="bg-[#111] border border-gray-700 p-6 rounded-xl mb-6">

          <h2 className="mb-6 font-semibold text-lg">Teleport</h2>

          <div className="flex items-center justify-between flex-wrap gap-6">

            {/* MODIFIERS */}
            <div className="flex items-center gap-6">

              <label className="flex items-center gap-2">
                <input type="checkbox" checked={tpCtrl} onChange={() => setTpCtrl(!tpCtrl)} />
                CTRL
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" checked={tpShift} onChange={() => setTpShift(!tpShift)} />
                SHIFT
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" checked={tpAlt} onChange={() => setTpAlt(!tpAlt)} />
                ALT
              </label>

              {/* F9 */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={tpUseF9}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setTpUseF9(checked);
                    setTpKey(checked ? "f9" : "");
                  }}
                />
                <span className={tpUseF9 ? "text-yellow-400" : ""}>F9</span>
              </label>

            </div>

            {/* INPUT */}
            <input
              value={tpUseF9 ? "f9" : tpKey}
              onChange={(e) => setTpKey(e.target.value.slice(0,1))}
              disabled={tpUseF9}
              className="w-24 h-14 text-center text-xl bg-black border border-gray-600 rounded-lg"
            />

          </div>

        </div>

        {/* BOTÓN */}
        <button
          onClick={handleGenerate}
          className="bg-blue-600 px-6 py-3 rounded-lg mb-6"
        >
          Generar Controls
        </button>

        {/* OUTPUT */}
        {output && (
          <div className="bg-[#111] p-4 rounded">

            <textarea
              value={output}
              readOnly
              className="w-full h-64 bg-black p-4 rounded mb-4"
            />

            <div className="flex gap-4">
              <button onClick={handleCopy}>Copiar</button>
              <button onClick={handleDownload}>Descargar</button>
            </div>

          </div>
        )}

      </div>

      <Footer />

    </div>
  );
};

export default CameraToolPage;