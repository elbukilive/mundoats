import React, { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { generateControls } from '@/utils/ControlsGenerator.js';

const CameraToolPage = () => {
  const fileInputRef = useRef(null);
  const customInputRef = useRef(null);
  const camKeyInputRef = useRef(null); // ← NUEVO REF PARA EL INPUT DE TECLA PRINCIPAL

  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [output, setOutput] = useState('');

  // ==================== CAMERA ZERO ====================
  const [camCtrl, setCamCtrl] = useState(false);
  const [camShift, setCamShift] = useState(false);
  const [camAlt, setCamAlt] = useState(false);
  const [camMainKey, setCamMainKey] = useState('0'); // Default visible hasta que el usuario interactúe
  const [camKeyError, setCamKeyError] = useState(false);

  // ==================== TELEPORT ====================
  const [tpCtrl, setTpCtrl] = useState(true);
  const [tpShift, setTpShift] = useState(false);
  const [tpAlt, setTpAlt] = useState(false);
  const [tpEnabled, setTpEnabled] = useState(true);
  const tpKey = "f9";

  // ==================== MOVIMIENTO ====================
  const [movementMode, setMovementMode] = useState("flechas");
  const [activeDir, setActiveDir] = useState("up");

  const emptyMovement = {
    up:    { ctrl: false, shift: false, alt: false, keys: [] },
    down:  { ctrl: false, shift: false, alt: false, keys: [] },
    left:  { ctrl: false, shift: false, alt: false, keys: [] },
    right: { ctrl: false, shift: false, alt: false, keys: [] },
  };

  const [movementConfig, setMovementConfig] = useState(emptyMovement);

  const updateDir = (dir, changes) => {
    setMovementConfig(prev => ({
      ...prev,
      [dir]: { ...prev[dir], ...changes }
    }));
  };

  const handleModeChange = (mode) => {
    setMovementMode(mode);
    setActiveDir("up");
    if (mode === "custom") {
      setTimeout(() => customInputRef.current?.focus(), 80);
    }
  };

  useEffect(() => {
    if (movementMode !== "custom") return;

    const handleKeyDown = (e) => {
      if (!activeDir) return;

      if (e.key === "Control") { updateDir(activeDir, { ctrl: !movementConfig[activeDir].ctrl }); return; }
      if (e.key === "Shift")   { updateDir(activeDir, { shift: !movementConfig[activeDir].shift }); return; }
      if (e.key === "Alt")     { updateDir(activeDir, { alt: !movementConfig[activeDir].alt }); return; }

      e.preventDefault();
      const key = e.key.toLowerCase().trim();

      setMovementConfig(prev => {
        const current = prev[activeDir];
        const hasKey = current.keys.includes(key);
        return {
          ...prev,
          [activeDir]: {
            ...current,
            keys: hasKey ? current.keys.filter(k => k !== key) : [...current.keys, key]
          }
        };
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [movementMode, activeDir, movementConfig]);

  const getComboText = (dir) => {
    const cfg = movementConfig[dir];
    const parts = [];
    if (cfg.ctrl) parts.push("CTRL");
    if (cfg.shift) parts.push("SHIFT");
    if (cfg.alt) parts.push("ALT");
    parts.push(...cfg.keys.map(k => k.toUpperCase()));
    return parts.join(" + ") || "—";
  };

  const getVisualKey = (dir) => {
    if (movementMode === "numpad") {
      return { up: "8", down: "2", left: "4", right: "6" }[dir];
    }
    return { up: "↑", down: "↓", left: "←", right: "→" }[dir];
  };

  const buildCombo = (cfg) => {
    const parts = [];
    if (cfg.ctrl) parts.push("(keyboard.lctrl?0 | keyboard.rctrl?0)");
    if (cfg.shift) parts.push("(keyboard.lshift?0 | keyboard.rshift?0)");
    if (cfg.alt) parts.push("(keyboard.lalt?0 | keyboard.ralt?0)");
    cfg.keys.forEach(k => parts.push(`keyboard.${k}?0`));
    return parts.length ? parts.join(" & ") : "";
  };

  const getCameraComboText = () => {
    const parts = [];
    if (camCtrl) parts.push("CTRL");
    if (camShift) parts.push("SHIFT");
    if (camAlt) parts.push("ALT");
    if (camMainKey) parts.push(camMainKey.toUpperCase());
    return parts.join(" + ") || "—";
  };

  // MANEJO DEL INPUT DE TECLA PRINCIPAL (FIX DEL BUG)
  const handleCamKeyChange = (e) => {
    const value = e.target.value.trim();
    setCamKeyError(false);

    if (value === '') {
      setCamMainKey(''); // Permitimos vacío temporal (mientras esté enfocado)
      return;
    }

    const newKey = value.slice(-1).toLowerCase();
    const isValid = /^[a-z0-9[\]\\;',./\-=`~ ]$/.test(newKey);

    if (isValid) {
      setCamMainKey(newKey);
    } else {
      setCamKeyError(true);
    }
  };

  // Al perder el foco (blur) → si quedó vacío, volvemos al default "0"
  const handleCamKeyBlur = () => {
    if (camMainKey === '') {
      setCamMainKey('0');
    }
  };

  const handleGenerate = () => {
    if (!fileContent) {
      alert("Sube primero tu archivo controls.sii");
      return;
    }

    const config = {
      camera: buildCombo({ ctrl: camCtrl, shift: camShift, alt: camAlt, keys: [camMainKey] }),
      teleport: tpEnabled ? buildCombo({ ctrl: tpCtrl, shift: tpShift, alt: tpAlt, keys: [tpKey] }) : "",
      movement: {
        up:    buildCombo(movementConfig.up),
        down:  buildCombo(movementConfig.down),
        left:  buildCombo(movementConfig.left),
        right: buildCombo(movementConfig.right),
      }
    };

    const result = generateControls(fileContent, config);
    setOutput(result);
  };

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white">
      <Header />

      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-center gap-3 mb-10">
          <span className="text-5xl">🎮</span>
          <h1 className="text-4xl font-bold">Controls Generator (Cámara Zero)</h1>
        </div>

        {/* Upload */}
        <div
          onClick={() => fileInputRef.current.click()}
          className="bg-[#111] border border-gray-700 hover:border-yellow-400 p-8 rounded-2xl text-center cursor-pointer mb-8 transition-all"
        >
          <p className="text-yellow-400 font-semibold text-lg">Click para subir controls.sii</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".sii"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setFileName(file.name);
                const reader = new FileReader();
                reader.onload = (ev) => setFileContent(ev.target.result);
                reader.readAsText(file);
              }
            }}
            className="hidden"
          />
          {fileName && <p className="text-sm text-gray-400 mt-2">Archivo: {fileName}</p>}
        </div>

        {/* Activar Cámara Cero - BUG CORREGIDO */}
        <div className="bg-[#111] border border-gray-700 p-6 rounded-2xl mb-6">
          <h2 className="text-xl font-semibold mb-4">Activar Cámara Cero</h2>
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Toggles */}
            <div className="flex gap-4 flex-wrap">
              {[
                ["CTRL", camCtrl, setCamCtrl],
                ["SHIFT", camShift, setCamShift],
                ["ALT", camAlt, setCamAlt]
              ].map(([label, val, set]) => (
                <button
                  key={label}
                  onClick={() => set(!val)}
                  className={`px-6 py-3 rounded-xl border text-sm font-medium transition-all ${
                    val ? 'border-yellow-400 bg-yellow-400/10 shadow-[0_0_12px_rgba(255,204,0,0.5)]' : 'border-gray-600 hover:bg-gray-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Input editable - AHORA FUNCIONA NATURAL (Backspace directo + reemplazo inmediato) */}
            <div className="flex flex-col">
              <input
                ref={camKeyInputRef}
                type="text"
                maxLength={1}
                value={camMainKey.toUpperCase()}
                onChange={handleCamKeyChange}
                onFocus={(e) => e.target.select()}          {/* ← Selecciona automáticamente al hacer clic */}
                onBlur={handleCamKeyBlur}                   {/* ← Si queda vacío al salir, vuelve a "0" */}
                className={`w-20 h-16 text-center bg-black border-2 rounded-xl font-mono text-3xl shadow-[0_0_12px_rgba(255,204,0,0.3)] focus:outline-none ${
                  camKeyError ? 'border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]' : 'border-yellow-400'
                }`}
                placeholder="0"
              />
              {camKeyError && (
                <p className="text-xs text-red-400 mt-1 text-center">
                  Tecla inválida (usa solo letras, números o símbolos simples)
                </p>
              )}
            </div>

            {/* Casilla de resultado */}
            <div className="flex-1 min-w-[200px]">
              <div className="w-full h-16 flex items-center justify-center bg-black border-2 border-gray-600 rounded-xl font-mono text-xl text-yellow-300">
                {getCameraComboText()}
              </div>
            </div>
          </div>
        </div>

        {/* Teleport */}
        <div className="bg-[#111] border border-gray-700 p-6 rounded-2xl mb-8">
          <h2 className="text-xl font-semibold mb-4">Teleport</h2>
          <div className="flex gap-4 flex-wrap items-center">
            {[
              ["CTRL", tpCtrl, setTpCtrl],
              ["SHIFT", tpShift, setTpShift],
              ["ALT", tpAlt, setTpAlt]
            ].map(([label, val, set]) => (
              <button
                key={label}
                onClick={() => set(!val)}
                className={`px-6 py-3 rounded-xl border text-sm font-medium transition-all ${val ? 'border-yellow-400 bg-yellow-400/10 shadow-[0_0_12px_rgba(255,204,0,0.5)]' : 'border-gray-600'}`}
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => setTpEnabled(!tpEnabled)}
              className={`ml-6 w-16 h-16 flex items-center justify-center border-2 rounded-xl font-mono text-xl transition-all ${tpEnabled ? 'border-yellow-400 shadow-[0_0_18px_rgba(255,204,0,0.5)]' : 'border-gray-600'}`}
            >
              {tpEnabled ? "F9" : "OFF"}
            </button>
          </div>
        </div>

        {/* Movimiento Cámara */}
        <div className="bg-[#111] border border-gray-700 p-6 rounded-2xl mb-8">
          <h2 className="text-xl font-semibold mb-6">Movimiento Cámara</h2>

          <div className="flex gap-3 mb-8">
            {["flechas", "numpad", "custom"].map(mode => (
              <button
                key={mode}
                onClick={() => handleModeChange(mode)}
                className={`px-7 py-3 rounded-xl border font-medium transition-all ${movementMode === mode ? 'border-yellow-400 bg-yellow-400/15 shadow-[0_0_12px_rgba(255,204,0,0.5)]' : 'border-gray-600 hover:bg-gray-800'}`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>

          {movementMode === "custom" && (
            <div className="flex justify-center gap-4 mb-6">
              {["ctrl", "shift", "alt"].map(mod => (
                <button
                  key={mod}
                  onClick={() => updateDir(activeDir, { [mod]: !movementConfig[activeDir][mod] })}
                  className={`px-8 py-3 rounded-xl border text-base font-medium transition-all ${movementConfig[activeDir][mod] ? 'border-yellow-400 bg-yellow-500/15 shadow-[0_0_12px_rgba(255,204,0,0.4)]' : 'border-gray-600 hover:bg-gray-800'}`}
                >
                  {mod.toUpperCase()}
                </button>
              ))}
            </div>
          )}

          <div className="flex justify-center mb-8">
            <div className="grid grid-cols-3 gap-5">
              <div />
              <button
                onClick={() => setActiveDir("up")}
                className={`w-24 h-24 flex flex-col items-center justify-center border-2 rounded-2xl text-6xl transition-all ${activeDir === "up" && movementMode === "custom" ? 'border-yellow-400 bg-yellow-500/10 shadow-[0_0_24px_rgba(255,204,0,0.7)]' : 'border-gray-700 bg-gray-900'}`}
              >
                {getVisualKey("up")}
                {movementMode === "custom" && <div className="text-xs mt-2 font-mono text-yellow-300">{getComboText("up")}</div>}
              </button>
              <div />

              <button
                onClick={() => setActiveDir("left")}
                className={`w-24 h-24 flex flex-col items-center justify-center border-2 rounded-2xl text-6xl transition-all ${activeDir === "left" && movementMode === "custom" ? 'border-yellow-400 bg-yellow-500/10 shadow-[0_0_24px_rgba(255,204,0,0.7)]' : 'border-gray-700 bg-gray-900'}`}
              >
                {getVisualKey("left")}
                {movementMode === "custom" && <div className="text-xs mt-2 font-mono text-yellow-300">{getComboText("left")}</div>}
              </button>

              <button
                onClick={() => setActiveDir("down")}
                className={`w-24 h-24 flex flex-col items-center justify-center border-2 rounded-2xl text-6xl transition-all ${activeDir === "down" && movementMode === "custom" ? 'border-yellow-400 bg-yellow-500/10 shadow-[0_0_24px_rgba(255,204,0,0.7)]' : 'border-gray-700 bg-gray-900'}`}
              >
                {getVisualKey("down")}
                {movementMode === "custom" && <div className="text-xs mt-2 font-mono text-yellow-300">{getComboText("down")}</div>}
              </button>

              <button
                onClick={() => setActiveDir("right")}
                className={`w-24 h-24 flex flex-col items-center justify-center border-2 rounded-2xl text-6xl transition-all ${activeDir === "right" && movementMode === "custom" ? 'border-yellow-400 bg-yellow-500/10 shadow-[0_0_24px_rgba(255,204,0,0.7)]' : 'border-gray-700 bg-gray-900'}`}
              >
                {getVisualKey("right")}
                {movementMode === "custom" && <div className="text-xs mt-2 font-mono text-yellow-300">{getComboText("right")}</div>}
              </button>
            </div>
          </div>

          {movementMode === "custom" && (
            <div className="text-center">
              <input
                ref={customInputRef}
                value={getComboText(activeDir)}
                readOnly
                className="w-96 h-14 text-center bg-black border-2 border-yellow-400 rounded-2xl font-mono text-xl shadow-[0_0_15px_rgba(255,204,0,0.4)]"
                placeholder="Presiona teclas para esta dirección..."
              />
              <p className="text-sm text-gray-400 mt-3">Configurando: <span className="text-yellow-300 font-bold">{activeDir.toUpperCase()}</span></p>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleGenerate}
            className="bg-blue-600 hover:bg-blue-700 px-14 py-5 rounded-2xl text-lg font-semibold transition-all shadow-lg"
          >
            Generar Controls
          </button>
        </div>

        {output && (
          <pre className="mt-12 bg-black p-8 rounded-2xl text-green-300 font-mono text-sm border border-gray-700 overflow-auto">
            {output}
          </pre>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CameraToolPage;