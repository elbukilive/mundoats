import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { generateControls } from '@/utilidades/ControlesGenerador.js';

const CamaraCero = () => {
  const fileInputRef = useRef(null);
  const customInputRef = useRef(null);
  const camKeyInputRef = useRef(null);
  const tpKeyInputRef = useRef(null);

  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  // ==================== ACTIVAR CÁMARA CERO ====================
  const [camCtrl, setCamCtrl] = useState(false);
  const [camShift, setCamShift] = useState(false);
  const [camAlt, setCamAlt] = useState(false);
  const [camMainKey, setCamMainKey] = useState('0');
  const [camKeyError, setCamKeyError] = useState(false);

  // ==================== TELEPORT ====================
  const [tpCtrl, setTpCtrl] = useState(true);
  const [tpShift, setTpShift] = useState(false);
  const [tpAlt, setTpAlt] = useState(false);
  const [tpMainKey, setTpMainKey] = useState('F9');
  const [tpKeyError, setTpKeyError] = useState(false);

  // ==================== MOVIMIENTO ====================
  const [movementMode, setMovementMode] = useState("flechas");
  const [activeDir, setActiveDir] = useState("up");

  const emptyMovement = {
    up:    { ctrl: false, shift: false, alt: false, key: '' },
    down:  { ctrl: false, shift: false, alt: false, key: '' },
    left:  { ctrl: false, shift: false, alt: false, key: '' },
    right: { ctrl: false, shift: false, alt: false, key: '' },
  };

  const [movementConfig, setMovementConfig] = useState(emptyMovement);

  const updateDir = (dir, changes) => {
    setMovementConfig(prev => ({
      ...prev,
      [dir]: { ...prev[dir], ...changes }
    }));
  };

  const handleModeChange = (mode) => {
    if (movementMode === "custom" && mode !== "custom") {
      setMovementConfig(emptyMovement);
      setActiveDir("up");
    }

    setMovementMode(mode);
    setActiveDir("up");

    if (mode === "custom") {
      setTimeout(() => customInputRef.current?.focus(), 80);
    }
  };

  useEffect(() => {
    const input = customInputRef.current;
    if (!input || movementMode !== "custom") return;

    const handleKeyDown = (e) => {
      if (!activeDir) return;

      if (e.key === "Control") {
        e.preventDefault();
        updateDir(activeDir, { ctrl: !movementConfig[activeDir].ctrl });
        return;
      }
      if (e.key === "Shift") {
        e.preventDefault();
        updateDir(activeDir, { shift: !movementConfig[activeDir].shift });
        return;
      }
      if (e.key === "Alt") {
        e.preventDefault();
        updateDir(activeDir, { alt: !movementConfig[activeDir].alt });
        return;
      }

      if (e.key === "Backspace") {
        updateDir(activeDir, { key: '' });
        return;
      }

      if (["Escape", "Enter", "Tab", "Meta", "ContextMenu"].includes(e.key)) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      const key = e.key.toLowerCase().trim();

      if (/^[a-z0-9[\]\\;',./\-=`~ ]$/.test(key)) {
        updateDir(activeDir, { key });
      }
    };

    input.addEventListener("keydown", handleKeyDown);
    return () => input.removeEventListener("keydown", handleKeyDown);
  }, [movementMode, activeDir, movementConfig]);

  const getComboText = (dir) => {
    const cfg = movementConfig[dir];
    const parts = [];
    if (cfg.ctrl) parts.push("CTRL");
    if (cfg.shift) parts.push("SHIFT");
    if (cfg.alt) parts.push("ALT");
    if (cfg.key) parts.push(cfg.key.toUpperCase());
    return parts.length ? parts.join(" + ") : "—";
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
    if (cfg.key) parts.push(`keyboard.${cfg.key}?0`);
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

  const handleCamKeyChange = (e) => {
    const value = e.target.value.trim().toUpperCase();
    setCamKeyError(false);

    const lastChar = value.slice(-1);

    if (lastChar === '') {
      setCamMainKey('');
    } else if (/^[A-Z0-9]$/.test(lastChar)) {
      setCamMainKey(lastChar);
    } else {
      setCamKeyError(true);
    }

    // Re-enfoca y sombrea inmediatamente después de escribir
    setTimeout(() => {
      if (camKeyInputRef.current) {
        camKeyInputRef.current.focus();
        camKeyInputRef.current.select();
      }
    }, 0);
  };

  const handleCamKeyBlur = () => {
    if (!camMainKey) setCamMainKey('0');
  };

  const keepCamFocus = () => {
    setTimeout(() => {
      if (camKeyInputRef.current) {
        camKeyInputRef.current.focus();
        camKeyInputRef.current.select();
      }
    }, 0);
  };

  const getTpComboText = () => {
    const parts = [];
    if (tpCtrl) parts.push("CTRL");
    if (tpShift) parts.push("SHIFT");
    if (tpAlt) parts.push("ALT");
    if (tpMainKey) parts.push(tpMainKey.toUpperCase());
    return parts.join(" + ") || "—";
  };

  const handleTpKeyChange = (e) => {
    const value = e.target.value.trim().toUpperCase();
    setTpKeyError(false);

    const lastChar = value.slice(-1);

    if (lastChar === '') {
      setTpMainKey('');
    } else if (/^[A-Z0-9]$/.test(lastChar)) {
      setTpMainKey(lastChar);
    } else {
      setTpKeyError(true);
    }

    // Re-enfoca y sombrea inmediatamente después de escribir
    setTimeout(() => {
      if (tpKeyInputRef.current) {
        tpKeyInputRef.current.focus();
        tpKeyInputRef.current.select();
      }
    }, 0);
  };

  const handleTpKeyBlur = () => {
    if (!tpMainKey) setTpMainKey('F9');
  };

  const keepTpFocus = () => {
    setTimeout(() => {
      if (tpKeyInputRef.current) {
        tpKeyInputRef.current.focus();
        tpKeyInputRef.current.select();
      }
    }, 0);
  };

  const handleGenerate = () => {
    if (!fileContent) {
      toast.error("Sube primero tu archivo controls.sii");
      return;
    }

    const config = {
      camera: buildCombo({ ctrl: camCtrl, shift: camShift, alt: camAlt, key: camMainKey || '0' }),
      teleport: buildCombo({ ctrl: tpCtrl, shift: tpShift, alt: tpAlt, key: tpMainKey || 'F9' }),
      movement: {
        up:    buildCombo(movementConfig.up),
        down:  buildCombo(movementConfig.down),
        left:  buildCombo(movementConfig.left),
        right: buildCombo(movementConfig.right),
      }
    };

    const result = generateControls(fileContent, config);
    setOutput(result);
    toast.success("Controls generado");
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'controls.sii';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white">
      <Header />

      <div className="max-w-5xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-3 mb-10"
        >
          <span className="text-5xl">🎮</span>
          <h1 className="text-4xl font-bold">Controls Generator (Cámara Cero)</h1>
        </motion.div>

        {/* Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          onClick={() => fileInputRef.current.click()}
          className="bg-[#111] border border-gray-700 hover:border-yellow-400 p-8 rounded-2xl text-center cursor-pointer mb-8 transition-all shadow-lg"
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
        </motion.div>

        {/* Activar Cámara Cero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-[#111] border border-gray-700 p-6 rounded-2xl mb-6 shadow-lg"
          onClick={keepCamFocus}
        >
          <h2 className="text-xl font-semibold mb-4">Activar Cámara Cero</h2>
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="flex gap-4 flex-wrap">
              {[
                ["CTRL", camCtrl, setCamCtrl],
                ["SHIFT", camShift, setCamShift],
                ["ALT", camAlt, setCamAlt]
              ].map(([label, val, set]) => (
                <button
                  key={label}
                  onClick={() => {
                    set(!val);
                    keepCamFocus();
                  }}
                  className={`px-6 py-3 rounded-xl border text-sm font-medium transition-all ${
                    val ? 'border-yellow-400 bg-yellow-400/10 shadow-[0_0_12px_rgba(255,215,0,0.5)]' : 'border-gray-600 hover:bg-gray-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex flex-col">
              <input
                ref={camKeyInputRef}
                type="text"
                maxLength={1}
                value={camMainKey.toUpperCase()}
                onChange={(e) => {
                  const value = e.target.value.trim().toUpperCase();
                  const lastChar = value.slice(-1);

                  if (lastChar === '') {
                    setCamMainKey('');
                  } else if (/^[A-Z0-9]$/.test(lastChar)) {
                    setCamMainKey(lastChar);
                  } else {
                    setCamKeyError(true);
                  }
                  keepCamFocus(); // Re-sombrea inmediatamente después de escribir
                }}
                onFocus={(e) => e.target.select()}
                onBlur={handleCamKeyBlur}
                className={`w-20 h-16 text-center bg-black border-2 rounded-xl font-mono text-3xl shadow-[0_0_12px_rgba(255,204,0,0.3)] focus:outline-none focus:border-yellow-500 ${
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

            <div className="flex-1 min-w-[200px]">
              <div className="w-full h-16 flex items-center justify-center bg-black border-2 border-gray-600 rounded-xl font-mono text-xl text-yellow-300">
                {getCameraComboText()}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Teleport */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-[#111] border border-gray-700 p-6 rounded-2xl mb-8 shadow-lg"
          onClick={keepTpFocus}
        >
          <h2 className="text-xl font-semibold mb-4">Teleport</h2>

          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="flex gap-4 flex-wrap">
              {[
                ["CTRL", tpCtrl, () => setTpCtrl(!tpCtrl)],
                ["SHIFT", tpShift, () => setTpShift(!tpShift)],
                ["ALT", tpAlt, () => setTpAlt(!tpAlt)],
                ["F9", tpMainKey === 'F9', () => setTpMainKey(tpMainKey === 'F9' ? '' : 'F9')]
              ].map(([label, val, toggle]) => (
                <button
                  key={label}
                  onClick={() => {
                    toggle();
                    keepTpFocus(); // Re-enfoca y sombrea después de clicar botón
                  }}
                  className={`px-6 py-3 rounded-xl border text-sm font-medium transition-all ${
                    val ? 'border-yellow-400 bg-yellow-400/10 shadow-[0_0_12px_rgba(255,215,0,0.5)]' : 'border-gray-600 hover:bg-gray-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex flex-col">
              <input
                ref={tpKeyInputRef}
                type="text"
                maxLength={1}
                value={tpMainKey.toUpperCase()}
                onChange={(e) => {
                  const value = e.target.value.trim().toUpperCase();
                  const lastChar = value.slice(-1);

                  if (lastChar === '') {
                    setTpMainKey('');
                  } else if (/^[A-Z0-9]$/.test(lastChar)) {
                    setTpMainKey(lastChar);
                  } else {
                    setTpKeyError(true);
                  }
                  keepTpFocus(); // Re-sombrea inmediatamente después de escribir
                }}
                onFocus={(e) => e.target.select()}
                onBlur={handleTpKeyBlur}
                className={`w-20 h-16 text-center bg-black border-2 rounded-xl font-mono text-3xl shadow-[0_0_12px_rgba(255,204,0,0.3)] focus:outline-none focus:border-yellow-500 ${
                  tpKeyError ? 'border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]' : 'border-yellow-400'
                }`}
                placeholder="F9"
              />
              {tpKeyError && (
                <p className="text-xs text-red-400 mt-1 text-center">
                  Tecla inválida (usa solo letras, números o símbolos simples)
                </p>
              )}
            </div>

            <div className="flex-1 min-w-[200px]">
              <div className="w-full h-16 flex items-center justify-center bg-black border-2 border-gray-600 rounded-xl font-mono text-xl text-yellow-300">
                {getTpComboText()}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Movimiento Cámara */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-[#111] border border-gray-700 p-6 rounded-2xl mb-8 shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-6">Movimiento Cámara</h2>

          <div className="flex gap-3 mb-8">
            {["flechas", "numpad", "custom"].map(mode => (
              <button
                key={mode}
                onClick={() => handleModeChange(mode)}
                className={`px-7 py-3 rounded-xl border font-medium transition-all ${
                  movementMode === mode ? 'border-yellow-400 bg-yellow-400/15 shadow-[0_0_12px_rgba(255,204,0,0.5)]' : 'border-gray-600 hover:bg-gray-800'
                }`}
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
                  className={`px-8 py-3 rounded-xl border text-base font-medium transition-all ${
                    movementConfig[activeDir][mod] ? 'border-yellow-400 bg-yellow-500/15 shadow-[0_0_12px_rgba(255,204,0,0.4)]' : 'border-gray-600 hover:bg-gray-800'
                  }`}
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
                onClick={() => {
                  setActiveDir("up");
                  keepCustomFocus();
                }}
                className={`w-24 h-24 flex flex-col items-center justify-center border-2 rounded-2xl text-6xl transition-all ${
                  activeDir === "up" && movementMode === "custom" ? 'border-yellow-400 bg-yellow-500/10 shadow-[0_0_24px_rgba(255,204,0,0.7)]' : 'border-gray-700 bg-gray-900'
                }`}
              >
                {getVisualKey("up")}
                {movementMode === "custom" && (
                  <div className="text-xs mt-2 font-mono text-yellow-300">{getComboText("up")}</div>
                )}
              </button>
              <div />

              <button
                onClick={() => {
                  setActiveDir("left");
                  keepCustomFocus();
                }}
                className={`w-24 h-24 flex flex-col items-center justify-center border-2 rounded-2xl text-6xl transition-all ${
                  activeDir === "left" && movementMode === "custom" ? 'border-yellow-400 bg-yellow-500/10 shadow-[0_0_24px_rgba(255,204,0,0.7)]' : 'border-gray-700 bg-gray-900'
                }`}
              >
                {getVisualKey("left")}
                {movementMode === "custom" && (
                  <div className="text-xs mt-2 font-mono text-yellow-300">{getComboText("left")}</div>
                )}
              </button>

              <button
                onClick={() => {
                  setActiveDir("down");
                  keepCustomFocus();
                }}
                className={`w-24 h-24 flex flex-col items-center justify-center border-2 rounded-2xl text-6xl transition-all ${
                  activeDir === "down" && movementMode === "custom" ? 'border-yellow-400 bg-yellow-500/10 shadow-[0_0_24px_rgba(255,204,0,0.7)]' : 'border-gray-700 bg-gray-900'
                }`}
              >
                {getVisualKey("down")}
                {movementMode === "custom" && (
                  <div className="text-xs mt-2 font-mono text-yellow-300">{getComboText("down")}</div>
                )}
              </button>

              <button
                onClick={() => {
                  setActiveDir("right");
                  keepCustomFocus();
                }}
                className={`w-24 h-24 flex flex-col items-center justify-center border-2 rounded-2xl text-6xl transition-all ${
                  activeDir === "right" && movementMode === "custom" ? 'border-yellow-400 bg-yellow-500/10 shadow-[0_0_24px_rgba(255,204,0,0.7)]' : 'border-gray-700 bg-gray-900'
                }`}
              >
                {getVisualKey("right")}
                {movementMode === "custom" && (
                  <div className="text-xs mt-2 font-mono text-yellow-300">{getComboText("right")}</div>
                )}
              </button>
            </div>
          </div>

          {movementMode === "custom" && (
            <div className="text-center">
              <input
                ref={customInputRef}
                value={getComboText(activeDir)}
                onChange={(e) => {
                  const value = e.target.value.trim().toUpperCase();
                  const lastChar = value.slice(-1);

                  if (lastChar === '') {
                    updateDir(activeDir, { key: '' });
                  } else if (/^[A-Z0-9]$/.test(lastChar)) {
                    updateDir(activeDir, { key: lastChar.toLowerCase() });
                  }
                  keepCustomFocus(); // Re-sombrea inmediatamente después de escribir
                }}
                className="w-96 h-14 text-center bg-black border-2 border-yellow-400 rounded-2xl font-mono text-xl shadow-[0_0_15px_rgba(255,204,0,0.4)] focus:outline-none focus:border-yellow-500"
                placeholder="Presiona teclas para esta dirección..."
              />
              <p className="text-sm text-gray-400 mt-3">
                Configurando: <span className="text-yellow-300 font-bold">{activeDir.toUpperCase()}</span>
              </p>
            </div>
          )}
        </motion.div>

        {/* Botones Generar + Copiar + Descargar */}
        <div className="flex flex-col md:flex-row justify-center gap-6 mt-8">
          <button
            onClick={handleGenerate}
            className="bg-blue-600 hover:bg-blue-700 px-14 py-5 rounded-2xl text-lg font-semibold transition-all shadow-lg"
          >
            Generar Controls
          </button>

          {output && (
            <>
              <button
                onClick={handleCopy}
                className={`px-10 py-5 rounded-2xl text-lg font-semibold transition-all shadow-lg ${
                  copied ? 'bg-green-600' : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {copied ? '¡Copiado!' : 'Copiar'}
              </button>

              <button
                onClick={handleDownload}
                className="bg-purple-600 hover:bg-purple-700 px-10 py-5 rounded-2xl text-lg font-semibold transition-all shadow-lg"
              >
                Descargar controls.sii
              </button>
            </>
          )}
        </div>

        {output && (
          <div className="mt-12">
            <pre className="bg-black p-8 rounded-2xl text-green-300 font-mono text-sm border border-gray-700 overflow-auto max-h-[60vh]">
              {output}
            </pre>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CamaraCero;