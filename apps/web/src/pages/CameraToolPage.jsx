import React, { useState, useRef } from 'react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { generateControls } from '@/utils/ControlsGenerator.js';

const CameraToolPage = () => {

  const fileInputRef = useRef(null);

  const [fileContent, setFileContent] = useState('');
  const [output, setOutput] = useState('');
  const [fileName, setFileName] = useState('');

  // ================= MOVIMIENTO =================
  const [movementMode, setMovementMode] = useState("flechas");
  const [activeDir, setActiveDir] = useState(null);

  const [movementConfig, setMovementConfig] = useState({
    up: { ctrl:false, shift:false, alt:false, key:"arrowup" },
    down: { ctrl:false, shift:false, alt:false, key:"arrowdown" },
    left: { ctrl:false, shift:false, alt:false, key:"arrowleft" },
    right: { ctrl:false, shift:false, alt:false, key:"arrowright" },
  });

  const updateDir = (dir, changes) => {
    setMovementConfig(prev => ({
      ...prev,
      [dir]: { ...prev[dir], ...changes }
    }));
  };

  const renderKey = (dir) => {
    if (movementMode === "numpad") {
      return { up:"2", down:"5", left:"4", right:"6" }[dir];
    }
    return {
      up:"↑",
      down:"↓",
      left:"←",
      right:"→"
    }[dir];
  };

  const buildCombo = (cfg) => {
    let parts = [];

    if (cfg.ctrl) parts.push("(keyboard.lctrl?0 | keyboard.rctrl?0)");
    if (cfg.shift) parts.push("(keyboard.lshift?0 | keyboard.rshift?0)");
    if (cfg.alt) parts.push("(keyboard.lalt?0 | keyboard.ralt?0)");

    if (cfg.key) parts.push(`keyboard.${cfg.key}?0`);

    return parts.join(" & ");
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
          className="cursor-pointer border border-gray-700 bg-[#111] p-6 rounded-xl mb-6 text-center"
        >
          <input
            type="file"
            accept=".sii,.txt"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <p className="text-gray-400">
            {fileName || "Click para subir controls.sii"}
          </p>
        </div>

        {/* ================= MOVIMIENTO ================= */}
        <div className="bg-[#111] border border-gray-700 p-6 rounded-xl mb-6">

          <h2 className="mb-4 font-semibold text-lg">Movimiento Cámara</h2>

          {/* MODOS */}
          <div className="flex gap-4 mb-6">
            {["flechas","numpad","custom"].map(mode => (
              <button
                key={mode}
                onClick={()=>setMovementMode(mode)}
                className={`px-4 py-2 rounded-lg border
                ${movementMode===mode
                  ? "border-yellow-400 bg-yellow-400/10 shadow-[0_0_8px_rgba(255,204,0,0.4)]"
                  : "border-gray-600"
                }`}
              >
                {mode.charAt(0).toUpperCase()+mode.slice(1)}
              </button>
            ))}
          </div>

          {/* MODIFIERS */}
          <div className="flex gap-4 mb-6">
            {["ctrl","shift","alt"].map(mod=>(
              <button
                key={mod}
                onClick={()=>{
                  if(!activeDir) return;
                  updateDir(activeDir, { [mod]: !movementConfig[activeDir][mod] });
                }}
                className={`px-4 py-2 rounded-lg border
                ${activeDir && movementConfig[activeDir][mod]
                  ? "border-yellow-400 bg-yellow-400/10 shadow-[0_0_8px_rgba(255,204,0,0.4)]"
                  : "border-gray-600"
                }`}
              >
                {mod.toUpperCase()}
              </button>
            ))}
          </div>

          {/* GRID */}
          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-4">

              <div></div>

              <button onClick={()=>setActiveDir("up")} className={`w-20 h-20 rounded-lg border text-xl ${activeDir==="up"?"border-yellow-400 bg-yellow-400/10 shadow-[0_0_10px_rgba(255,204,0,0.5)]":"border-gray-600 bg-black"}`}>
                {renderKey("up")}
              </button>

              <div></div>

              <button onClick={()=>setActiveDir("left")} className={`w-20 h-20 rounded-lg border text-xl ${activeDir==="left"?"border-yellow-400 bg-yellow-400/10 shadow-[0_0_10px_rgba(255,204,0,0.5)]":"border-gray-600 bg-black"}`}>
                {renderKey("left")}
              </button>

              <div></div>

              <button onClick={()=>setActiveDir("right")} className={`w-20 h-20 rounded-lg border text-xl ${activeDir==="right"?"border-yellow-400 bg-yellow-400/10 shadow-[0_0_10px_rgba(255,204,0,0.5)]":"border-gray-600 bg-black"}`}>
                {renderKey("right")}
              </button>

              <div></div>

              <button onClick={()=>setActiveDir("down")} className={`w-20 h-20 rounded-lg border text-xl ${activeDir==="down"?"border-yellow-400 bg-yellow-400/10 shadow-[0_0_10px_rgba(255,204,0,0.5)]":"border-gray-600 bg-black"}`}>
                {renderKey("down")}
              </button>

              <div></div>

            </div>
          </div>

          {/* INPUT */}
          {activeDir && (
            <div className="flex justify-center mt-6">
              <input
                value={movementConfig[activeDir].key}
                onChange={(e)=>updateDir(activeDir,{key:e.target.value.toLowerCase()})}
                placeholder="ej: i"
                className="w-40 h-12 text-center bg-black border border-yellow-400 rounded-lg shadow-[0_0_10px_rgba(255,204,0,0.4)]"
              />
            </div>
          )}

        </div>

        <button
          onClick={handleGenerate}
          className="bg-blue-600 px-6 py-3 rounded-lg"
        >
          Generar Controls
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