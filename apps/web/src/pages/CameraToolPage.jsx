import React, { useState, useRef } from 'react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { generateControls } from '@/utils/ControlsGenerator.js';

const CameraToolPage = () => {

  const fileInputRef = useRef(null);

  const [fileContent, setFileContent] = useState('');
  const [output, setOutput] = useState('');
  const [fileName, setFileName] = useState('');

  // ===== MOVIMIENTO CUSTOM PRO =====
  const [activeDir, setActiveDir] = useState("up");

  const [movementConfig, setMovementConfig] = useState({
    up: { ctrl:false, shift:false, alt:false, key:"" },
    down: { ctrl:false, shift:false, alt:false, key:"" },
    left: { ctrl:false, shift:false, alt:false, key:"" },
    right: { ctrl:false, shift:false, alt:false, key:"" }
  });

  const current = movementConfig[activeDir];

  const updateCurrent = (changes) => {
    setMovementConfig(prev => ({
      ...prev,
      [activeDir]: {
        ...prev[activeDir],
        ...changes
      }
    }));
  };

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

  // ================= BUILD =================
  const buildCombo = (cfg) => {
    let parts = [];

    if (cfg.ctrl) parts.push("(keyboard.lctrl?0 | keyboard.rctrl?0)");
    if (cfg.shift) parts.push("(keyboard.lshift?0 | keyboard.rshift?0)");
    if (cfg.alt) parts.push("(keyboard.lalt?0 | keyboard.ralt?0)");

    if (cfg.key) parts.push(`keyboard.${cfg.key}?0`);

    return parts.join(" & ");
  };

  // ================= GENERATE =================
  const handleGenerate = () => {
    if (!fileContent) {
      alert("Sube archivo primero");
      return;
    }

    const result = generateControls(fileContent, {
      movement: {
        up: buildCombo(movementConfig.up),
        down: buildCombo(movementConfig.down),
        left: buildCombo(movementConfig.left),
        right: buildCombo(movementConfig.right),
      }
    });

    setOutput(result);
  };

  // ================= UI HELPERS =================
  const pill = (active) =>
    `px-3 py-2 rounded-lg border cursor-pointer transition-all
    ${active
      ? "border-yellow-400 bg-yellow-400/10 shadow-[0_0_10px_rgba(255,204,0,0.4)]"
      : "border-gray-600"
    }`;

  const dirButton = (dir, label) => (
    <button
      onClick={() => setActiveDir(dir)}
      className={`w-16 h-16 rounded-lg border text-xl
      ${activeDir === dir
        ? "border-yellow-400 bg-yellow-400/10 shadow-[0_0_10px_rgba(255,204,0,0.4)]"
        : "border-gray-600 bg-black"
      }`}
    >
      {label}
    </button>
  );

  const buildPreview = () => {
    let parts = [];
    if (current.ctrl) parts.push("CTRL");
    if (current.shift) parts.push("SHIFT");
    if (current.alt) parts.push("ALT");
    if (current.key) parts.push(current.key.toUpperCase());

    return parts.join("+");
  };

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white">

      <Header />

      <div className="max-w-5xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-8">
          🎮 Movimiento PRO
        </h1>

        {/* UPLOAD */}
        <div
          onClick={() => fileInputRef.current.click()}
          className="cursor-pointer border border-gray-700 bg-[#111] p-6 rounded-xl mb-6 text-center"
        >
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden"/>
          <p className="text-gray-400">
            {fileName || "Subir controls.sii"}
          </p>
        </div>

        {/* DIRECCIONES */}
        <div className="flex justify-center mb-6">
          <div className="grid grid-cols-3 gap-3">

            <div></div>
            {dirButton("up","↑")}
            <div></div>

            {dirButton("left","←")}
            <div></div>
            {dirButton("right","→")}

            <div></div>
            {dirButton("down","↓")}
            <div></div>

          </div>
        </div>

        {/* MODIFIERS */}
        <div className="flex gap-4 mb-6 justify-center">

          <label className={pill(current.ctrl)}>
            <input type="checkbox" checked={current.ctrl} onChange={()=>updateCurrent({ctrl:!current.ctrl})} className="hidden"/>
            CTRL
          </label>

          <label className={pill(current.shift)}>
            <input type="checkbox" checked={current.shift} onChange={()=>updateCurrent({shift:!current.shift})} className="hidden"/>
            SHIFT
          </label>

          <label className={pill(current.alt)}>
            <input type="checkbox" checked={current.alt} onChange={()=>updateCurrent({alt:!current.alt})} className="hidden"/>
            ALT
          </label>

        </div>

        {/* INPUT */}
        <div className="flex justify-center mb-6">

          <input
            value={buildPreview()}
            onChange={(e)=>updateCurrent({key: e.target.value.toLowerCase()})}
            placeholder="Ej: CTRL+SHIFT+I"
            className="w-64 h-14 text-center text-xl bg-black border border-yellow-400 rounded-lg shadow-[0_0_10px_rgba(255,204,0,0.4)]"
          />

        </div>

        <button
          onClick={handleGenerate}
          className="bg-blue-600 px-6 py-3 rounded-lg"
        >
          Generar
        </button>

        {output && (
          <textarea value={output} readOnly className="w-full h-64 mt-6 bg-black p-4"/>
        )}

      </div>

      <Footer />

    </div>
  );
};

export default CameraToolPage;