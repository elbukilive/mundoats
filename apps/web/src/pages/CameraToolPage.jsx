import React, { useState, useRef } from 'react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { generateControls } from '@/utils/ControlsGenerator.js';

const CameraToolPage = () => {

  const fileInputRef = useRef(null);

  const [fileContent, setFileContent] = useState('');
  const [output, setOutput] = useState('');
  const [fileName, setFileName] = useState('');

  // ================= CAMERA ZERO =================
  const [camKey] = useState("0");

  // ================= TELEPORT =================
  const [tpCtrl, setTpCtrl] = useState(true);
  const [tpShift, setTpShift] = useState(false);
  const [tpAlt, setTpAlt] = useState(false);
  const [tpKey] = useState("f9");

  // ================= MOVIMIENTO =================
  const [movementMode, setMovementMode] = useState("flechas");
  const [activeDir, setActiveDir] = useState("up");

  const emptyConfig = {
    up: { ctrl:false, shift:false, alt:false, keys:[] },
    down: { ctrl:false, shift:false, alt:false, keys:[] },
    left: { ctrl:false, shift:false, alt:false, keys:[] },
    right: { ctrl:false, shift:false, alt:false, keys:[] },
  };

  const [movementConfig, setMovementConfig] = useState(emptyConfig);

  // 👉 LIMPIAR CUANDO CAMBIA A CUSTOM
  const handleModeChange = (mode) => {
    setMovementMode(mode);

    if (mode === "custom") {
      setMovementConfig(emptyConfig);
      setActiveDir("up");
    }
  };

  const updateDir = (dir, changes) => {
    setMovementConfig(prev => ({
      ...prev,
      [dir]: { ...prev[dir], ...changes }
    }));
  };

  // ================= VISUAL =================
  const renderKey = (dir) => {
    if (movementMode === "numpad") {
      return { up:"2", down:"5", left:"4", right:"6" }[dir];
    }
    return { up:"↑", down:"↓", left:"←", right:"→" }[dir];
  };

  const renderCombo = (cfg) => {
    if (movementMode !== "custom") return "";

    let parts = [];
    if (cfg.ctrl) parts.push("C");
    if (cfg.shift) parts.push("S");
    if (cfg.alt) parts.push("A");
    if (cfg.keys.length) parts.push(...cfg.keys.map(k=>k.toUpperCase()));

    return parts.join("+");
  };

  const buildCombo = (cfg) => {
    let parts = [];

    if (cfg.ctrl) parts.push("(keyboard.lctrl?0 | keyboard.rctrl?0)");
    if (cfg.shift) parts.push("(keyboard.lshift?0 | keyboard.rshift?0)");
    if (cfg.alt) parts.push("(keyboard.lalt?0 | keyboard.ralt?0)");

    cfg.keys.forEach(k => {
      parts.push(`keyboard.${k}?0`);
    });

    return parts.join(" & ");
  };

  // ================= INPUT =================
  const buildInputValue = () => {
    const cfg = movementConfig[activeDir];

    let parts = [];
    if (cfg.ctrl) parts.push("CTRL");
    if (cfg.shift) parts.push("SHIFT");
    if (cfg.alt) parts.push("ALT");
    if (cfg.keys.length) parts.push(...cfg.keys.map(k=>k.toUpperCase()));

    return parts.join("+");
  };

  const handleInputChange = (value) => {
    const keys = value
      .toLowerCase()
      .replace(/ctrl|shift|alt/gi, '')
      .split('+')
      .map(k=>k.trim())
      .filter(k=>k);

    updateDir(activeDir, { keys });
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
      camera: `keyboard.${camKey}?0`,
      teleport: buildCombo({
        ctrl: tpCtrl,
        shift: tpShift,
        alt: tpAlt,
        keys: [tpKey]
      }),
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

        {/* MOVIMIENTO */}
        <div className="bg-[#111] border border-gray-700 p-6 rounded-xl mb-6">

          <h2 className="mb-4 font-semibold text-lg">Movimiento Cámara</h2>

          <div className="flex gap-4 mb-6">
            {["flechas","numpad","custom"].map(mode => (
              <button key={mode} onClick={()=>handleModeChange(mode)}
                className={`px-4 py-2 rounded-lg border ${movementMode===mode?"border-yellow-400 bg-yellow-400/10":"border-gray-600"}`}>
                {mode}
              </button>
            ))}
          </div>

          {movementMode === "custom" && (
            <div className="flex gap-4 mb-6">
              {["ctrl","shift","alt"].map(mod=>(
                <button
                  key={mod}
                  onClick={()=>updateDir(activeDir,{[mod]:!movementConfig[activeDir][mod]})}
                  className={`px-4 py-2 rounded-lg border ${movementConfig[activeDir][mod]?"border-yellow-400 bg-yellow-400/10":"border-gray-600"}`}
                >
                  {mod.toUpperCase()}
                </button>
              ))}
            </div>
          )}

          {/* GRID */}
          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-4">

              <div></div>

              {["up","left","right","down"].map(dir => (
                <button
                  key={dir}
                  onClick={()=>setActiveDir(dir)}
                  className={`w-20 h-20 rounded-lg border relative
                  ${activeDir===dir?"border-yellow-400 bg-yellow-400/10":"border-gray-600 bg-black"}`}
                >
                  <div className="text-xl">{renderKey(dir)}</div>
                  <div className="text-[10px] text-yellow-400 absolute bottom-1 w-full text-center">
                    {renderCombo(movementConfig[dir])}
                  </div>
                </button>
              ))}

            </div>
          </div>

          {/* INPUT */}
          {movementMode === "custom" && activeDir && (
            <div className="flex justify-center mt-6">
              <input
                value={buildInputValue()}
                onChange={(e)=>handleInputChange(e.target.value)}
                placeholder="CTRL+C"
                className="w-60 h-12 text-center bg-black border border-yellow-400 rounded-lg"
              />
            </div>
          )}

        </div>

        <button onClick={handleGenerate} className="bg-blue-600 px-6 py-3 rounded-lg">
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