import React, { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { generateControls } from '@/utils/ControlsGenerator.js';

const CameraToolPage = () => {
  const inputRef = useRef(null);

  const [fileContent, setFileContent] = useState('');
  const [output, setOutput] = useState('');

  // Camera Zero (fijo por ahora)
  const camKey = '0';

  // Teleport
  const [tpCtrl, setTpCtrl] = useState(true);
  const [tpShift, setTpShift] = useState(false);
  const [tpAlt, setTpAlt] = useState(false);
  const tpKey = 'f9';

  // Movement
  const [movementMode, setMovementMode] = useState('flechas');
  const [activeDir, setActiveDir] = useState('up');

  const emptyMovement = {
    up: { ctrl: false, shift: false, alt: false, keys: [] },
    down: { ctrl: false, shift: false, alt: false, keys: [] },
    left: { ctrl: false, shift: false, alt: false, keys: [] },
    right: { ctrl: false, shift: false, alt: false, keys: [] },
  };

  const [movementConfig, setMovementConfig] = useState(emptyMovement);

  const updateDir = (dir, changes) => {
    setMovementConfig((prev) => ({
      ...prev,
      [dir]: { ...prev[dir], ...changes },
    }));
  };

  const handleModeChange = (mode) => {
    setMovementMode(mode);
    setActiveDir('up');
    if (mode === 'custom') {
      // Reset al cambiar a custom (opcional, quítalo si no lo quieres)
      setMovementConfig(emptyMovement);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // Render visual de la tecla principal según modo
  const renderMainKey = (dir) => {
    if (movementMode === 'numpad') {
      return { up: '8', down: '2', left: '4', right: '6' }[dir];
    }
    return { up: '↑', down: '↓', left: '←', right: '→' }[dir];
  };

  // Muestra la combinación actual (para input y visual)
  const getComboText = (dir) => {
    const cfg = movementConfig[dir];
    const parts = [];
    if (cfg.ctrl) parts.push('CTRL');
    if (cfg.shift) parts.push('SHIFT');
    if (cfg.alt) parts.push('ALT');
    if (cfg.keys.length) parts.push(...cfg.keys.map((k) => k.toUpperCase()));
    return parts.join(' + ') || '—';
  };

  const buildCombo = (cfg) => {
    const parts = [];
    if (cfg.ctrl) parts.push('(keyboard.lctrl?0 | keyboard.rctrl?0)');
    if (cfg.shift) parts.push('(keyboard.lshift?0 | keyboard.rshift?0)');
    if (cfg.alt) parts.push('(keyboard.lalt?0 | keyboard.ralt?0)');
    cfg.keys.forEach((k) => parts.push(`keyboard.${k}?0`));
    return parts.length ? parts.join(' & ') : '';
  };

  const handleGenerate = () => {
    if (!fileContent) {
      alert('Sube el archivo controls.sii primero');
      return;
    }

    const config = {
      camera: `keyboard.${camKey}?0`,
      teleport: buildCombo({ ctrl: tpCtrl, shift: tpShift, alt: tpAlt, keys: [tpKey] }),
      movement: {
        up: buildCombo(movementConfig.up),
        down: buildCombo(movementConfig.down),
        left: buildCombo(movementConfig.left),
        right: buildCombo(movementConfig.right),
      },
    };

    const result = generateControls(fileContent, config);
    setOutput(result);
  };

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white pb-12">
      <Header />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-10 text-center">
          🎮 Controls Generator (Cámara Zero)
        </h1>

        {/* Sección subir archivo - simulado como en tu captura */}
        <div className="bg-[#111] border border-gray-700 p-5 rounded-xl mb-8 text-center">
          <div className="text-yellow-400 font-semibold mb-2">
            Click para subir controls.sii
          </div>
          {/* Aquí iría tu input file real */}
        </div>

        {/* Cámara Zero */}
        <div className="bg-[#111] border border-gray-700 p-6 rounded-xl mb-6">
          <h2 className="text-xl font-semibold mb-4">Activar Cámara Cero</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <button className="px-5 py-2 border border-gray-600 rounded-lg">CTRL</button>
            <button className="px-5 py-2 border border-gray-600 rounded-lg">SHIFT</button>
            <button className="px-5 py-2 border border-gray-600 rounded-lg">ALT</button>
            <div className="w-16 h-12 flex items-center justify-center bg-black border-2 border-yellow-500 rounded-lg shadow-[0_0_12px_rgba(234,179,8,0.5)] font-mono text-lg">
              {camKey}
            </div>
          </div>
        </div>

        {/* Teleport */}
        <div className="bg-[#111] border border-gray-700 p-6 rounded-xl mb-8">
          <h2 className="text-xl font-semibold mb-4">Teleport</h2>
          <div className="flex flex-wrap gap-4 items-center">
            {[
              ['CTRL', tpCtrl, setTpCtrl],
              ['SHIFT', tpShift, setTpShift],
              ['ALT', tpAlt, setTpAlt],
            ].map(([label, val, setter]) => (
              <button
                key={label}
                onClick={() => setter(!val)}
                className={`px-5 py-2 rounded-lg border transition-colors ${
                  val ? 'border-yellow-400 bg-yellow-500/10' : 'border-gray-600 hover:bg-gray-800'
                }`}
              >
                {label}
              </button>
            ))}
            <div className="w-16 h-12 flex items-center justify-center bg-black border-2 border-yellow-500 rounded-lg shadow-[0_0_12px_rgba(234,179,8,0.5)] font-mono text-lg">
              F9
            </div>
          </div>
        </div>

        {/* Movimiento - parte principal */}
        <div className="bg-[#111] border border-gray-700 p-6 rounded-xl mb-8">
          <h2 className="text-xl font-semibold mb-6">Movimiento Cámara</h2>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Columna izquierda: modos + modificadores (en custom) */}
            <div className="flex-1">
              <div className="flex flex-wrap gap-3 mb-6">
                {['flechas', 'numpad', 'custom'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => handleModeChange(mode)}
                    className={`px-6 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                      movementMode === mode
                        ? 'border-yellow-400 bg-yellow-500/15 shadow-[0_0_10px_rgba(234,179,8,0.4)]'
                        : 'border-gray-600 hover:bg-gray-800'
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>

              {movementMode === 'custom' && (
                <div className="flex gap-3 mb-6">
                  {['ctrl', 'shift', 'alt'].map((mod) => (
                    <button
                      key={mod}
                      onClick={() => updateDir(activeDir, { [mod]: !movementConfig[activeDir][mod] })}
                      className={`px-5 py-2 rounded-lg border text-sm transition-colors ${
                        movementConfig[activeDir][mod]
                          ? 'border-yellow-400 bg-yellow-500/15'
                          : 'border-gray-600 hover:bg-gray-800'
                      }`}
                    >
                      {mod.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Columna derecha: cruceta */}
            <div className="flex justify-center md:justify-end">
              <div className="grid grid-cols-3 gap-3 w-fit">
                <div />
                <button
                  onClick={() => setActiveDir('up')}
                  className={`w-20 h-20 flex items-center justify-center rounded-xl border text-3xl font-bold transition-all ${
                    activeDir === 'up'
                      ? 'border-yellow-400 bg-yellow-500/10 shadow-[0_0_14px_rgba(234,179,8,0.5)]'
                      : 'border-gray-700 bg-gray-900/40 hover:bg-gray-800'
                  }`}
                >
                  {renderMainKey('up')}
                </button>
                <div />

                <button
                  onClick={() => setActiveDir('left')}
                  className={`w-20 h-20 flex items-center justify-center rounded-xl border text-3xl font-bold transition-all ${
                    activeDir === 'left'
                      ? 'border-yellow-400 bg-yellow-500/10 shadow-[0_0_14px_rgba(234,179,8,0.5)]'
                      : 'border-gray-700 bg-gray-900/40 hover:bg-gray-800'
                  }`}
                >
                  {renderMainKey('left')}
                </button>

                <button
                  onClick={() => setActiveDir('down')}
                  className={`w-20 h-20 flex items-center justify-center rounded-xl border text-3xl font-bold transition-all ${
                    activeDir === 'down'
                      ? 'border-yellow-400 bg-yellow-500/10 shadow-[0_0_14px_rgba(234,179,8,0.5)]'
                      : 'border-gray-700 bg-gray-900/40 hover:bg-gray-800'
                  }`}
                >
                  {renderMainKey('down')}
                </button>

                <button
                  onClick={() => setActiveDir('right')}
                  className={`w-20 h-20 flex items-center justify-center rounded-xl border text-3xl font-bold transition-all ${
                    activeDir === 'right'
                      ? 'border-yellow-400 bg-yellow-500/10 shadow-[0_0_14px_rgba(234,179,8,0.5)]'
                      : 'border-gray-700 bg-gray-900/40 hover:bg-gray-800'
                  }`}
                >
                  {renderMainKey('right')}
                </button>
              </div>
            </div>
          </div>

          {/* Input custom visible solo en modo custom */}
          {movementMode === 'custom' && (
            <div className="mt-8 text-center">
              <input
                ref={inputRef}
                value={getComboText(activeDir)}
                onChange={(e) => {
                  // Aquí podrías parsear mejor la entrada si quieres
                  // Por simplicidad solo mostramos (puedes expandir parseo)
                  console.log('Editado:', e.target.value);
                }}
                className="w-72 h-12 px-4 text-center bg-black border-2 border-yellow-500/70 rounded-xl focus:outline-none focus:border-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.3)]"
                placeholder="Escribe combinación (ej: ctrl + w)"
              />
              <p className="text-sm text-gray-400 mt-2">
                Dirección actual: {activeDir.charAt(0).toUpperCase() + activeDir.slice(1)}
              </p>
            </div>
          )}
        </div>

        <div className="text-center">
          <button
            onClick={handleGenerate}
            className="bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-xl text-lg font-semibold transition-colors shadow-lg"
          >
            Generar Controls
          </button>
        </div>

        {output && (
          <div className="mt-10 bg-black/50 p-6 rounded-xl border border-gray-700">
            <pre className="text-green-300 font-mono whitespace-pre-wrap text-sm">{output}</pre>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CameraToolPage;