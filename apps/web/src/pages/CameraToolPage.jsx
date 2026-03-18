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
  const [camKey, setCamKey] = useState("0");

  // ================= TELEPORT =================
  const [tpCtrl, setTpCtrl] = useState(true);
  const [tpShift, setTpShift] = useState(false);
  const [tpAlt, setTpAlt] = useState(false);
  const [tpKey, setTpKey] = useState("f9");

  // ================= MOVIMIENTO =================
  const [movementMode, setMovementMode] = useState("flechas");
  const [activeDir, setActiveDir] = useState("up");

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
    return { up:"↑", down:"↓", left:"←", right:"→" }[dir];
  };

  const renderCombo = (cfg) => {
    let parts = [];
    if (cfg.ctrl) parts.push("C");
    if (cfg.shift) parts.push("S");
    if (cfg.alt) parts.push("A");
    if (cfg.key && !cfg.key.includes("arrow")) parts.push(cfg.key.toUpperCase());
    return parts.join("+");
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
      camera: `keyboard.${camKey}?0`,
      teleport: buildCombo({
        ctrl: tpCtrl,
        shift: tpShift,
        alt: tpAlt,
        key: tpKey
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

        {/* UPLOAD */}
        <div
          onClick={() => fileInputRef.current.click()}
          className="cursor-pointer border border-gray-700 bg-[#111] p-6 rounded-xl mb-6 text-center"
        >
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden"/>
          <p className="text-gray-400">{fileName || "Click para subir controls.sii"}</p>
        </div>

        {/* CAMERA ZERO (UI ORIGINAL) */}
        <div className="bg-[#111] border border-gray-700 p-6 rounded-xl mb-6">
          <h2 className="mb-4 font-semibold text-lg">Activar Cámara Cero</h2>

          <div className="flex gap-4 items-center">
            <button className="px-4 py-2 border border-gray-600 rounded-lg">CTRL</button>
            <button className="px-4 py-2 border border-gray-600 rounded-lg">SHIFT</button>
            <button className="px-4 py-2 border border-gray-600 rounded-lg">ALT</button>

            <div className="w-20 h-14 flex items-center justify-center bg-black border border-yellow-400 rounded-lg shadow-[0_0_10px_rgba(255,204,0,0.5)]">
              {camKey}
            </div>
          </div>
        </div>

        {/* TELEPORT (UI ORIGINAL) */}
        <div className="bg-[#111] border border-gray-700 p-6 rounded-xl mb-6">
          <h2 className="mb-4 font-semibold text-lg">Teleport</h2>

          <div className="flex gap-3 mb-4">
            {[
              ["CTRL",tpCtrl,setTpCtrl],
              ["SHIFT",tpShift,setTpShift],
              ["ALT",tpAlt,setTpAlt]
            ].map(([label,val,set])=>(
              <button
                key={label}
                onClick={()=>set(!val)}
                className={`px-4 py-2 rounded-lg border
                ${val?"border-yellow-400 bg-yellow-400/10":"border-gray-600"}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex gap-3 items-center">
            <button className="px-4 py-2 border border-yellow-400 bg-yellow-400/10 rounded-lg">F9</button>

            <div className="w-20 h-14 flex items-center justify-center bg-black border border-yellow-400 rounded-lg shadow-[0_0_10px_rgba(255,204,0,0.5)]">
              {tpKey.toUpperCase()}
            </div>
          </div>
        </div>

        {/* MOVIMIENTO (PRO + VISUAL) */}
        <div className="bg-[#111] border border-gray-700 p-6 rounded-xl mb-6">

          <h2 className="mb-4 font-semibold text-lg">Movimiento Cámara</h2>

          <div className="flex gap-4 mb-6">
            {["flechas","numpad","custom"].map(mode => (
              <button key={mode} onClick={()=>setMovementMode(mode)}
                className={`px-4 py-2 rounded-lg border ${movementMode===mode?"border-yellow-400 bg-yellow-400/10":"border-gray-600"}`}>
                {mode}
              </button>
            ))}
          </div>

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

          {activeDir && (
            <div className="flex justify-center mt-6">
              <input
                value={movementConfig[activeDir].key}
                onChange={(e)=>updateDir(activeDir,{key:e.target.value.toLowerCase()})}
                placeholder="ej: i"
                className="w-40 h-12 text-center bg-black border border-yellow-400 rounded-lg"
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