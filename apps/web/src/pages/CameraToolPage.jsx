import React, { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { generateControls } from '@/utils/ControlsGenerator.js';

const CameraToolPage = () => {
  const inputRef = useRef(null);

  const [fileContent, setFileContent] = useState('');
  const [output, setOutput] = useState('');

  // Camera Zero
  const [camCtrl, setCamCtrl] = useState(false);
  const [camShift, setCamShift] = useState(false);
  const [camAlt, setCamAlt] = useState(false);
  const [camKey] = useState('0');

  // Teleport
  const [tpCtrl, setTpCtrl] = useState(true);
  const [tpShift, setTpShift] = useState(false);
  const [tpAlt, setTpAlt] = useState(false);
  const [tpKey, setTpKey] = useState('f9');

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
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  // Custom mode key listener
  useEffect(() => {
    if (movementMode !== 'custom') return;

    const handleKeyDown = (e) => {
      if (!activeDir) return;

      // Modifiers toggle
      if (e.key === 'Control') {
        updateDir(activeDir, { ctrl: !movementConfig[activeDir].ctrl });
        return;
      }
      if (e.key === 'Shift') {
        updateDir(activeDir, { shift: !movementConfig[activeDir].shift });
        return;
      }
      if (e.key === 'Alt') {
        updateDir(activeDir, { alt: !movementConfig[activeDir].alt });
        return;
      }

      e.preventDefault();

      const key = e.key.toLowerCase();

      setMovementConfig((prev) => {
        const current = prev[activeDir];
        const alreadyHas = current.keys.includes(key);

        return {
          ...prev,
          [activeDir]: {
            ...current,
            keys: alreadyHas
              ? current.keys.filter((k) => k !== key)
              : [...current.keys, key],
          },
        };
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movementMode, activeDir, movementConfig]);

  // ────────────────────────────────────────────────
  // Visual rendering helpers
  // ────────────────────────────────────────────────

  const renderKey = (dir) => {
    if (movementMode === 'numpad') {
      return { up: '8', down: '2', left: '4', right: '6' }[dir];
    }
    return { up: '↑', down: '↓', left: '←', right: '→' }[dir];
  };

  const renderHint = (dir) => {
    const cfg = movementConfig[dir];
    const parts = [];

    if (cfg.ctrl) parts.push('CTRL');
    if (cfg.shift) parts.push('SHIFT');
    if (cfg.alt) parts.push('ALT');
    if (cfg.keys.length) parts.push(...cfg.keys.map((k) => k.toUpperCase()));

    return parts.length ? parts.join(' + ') : '—';
  };

  const buildCombo = (cfg) => {
    const parts = [];

    if (cfg.ctrl) parts.push('(keyboard.lctrl?0 | keyboard.rctrl?0)');
    if (cfg.shift) parts.push('(keyboard.lshift?0 | keyboard.rshift?0)');
    if (cfg.alt) parts.push('(keyboard.lalt?0 | keyboard.ralt?0)');

    cfg.keys.forEach((k) => {
      parts.push(`keyboard.${k}?0`);
    });

    if (parts.length === 0) return '';
    return parts.join(' & ');
  };

  const handleGenerate = () => {
    const config = {
      camera: buildCombo({ ctrl: camCtrl, shift: camShift, alt: camAlt, keys: [camKey] }),
      teleport: tpKey
        ? buildCombo({ ctrl: tpCtrl, shift: tpShift, alt: tpAlt, keys: [tpKey] })
        : '',
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

  // ────────────────────────────────────────────────
  // RENDER
  // ────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white">
      <Header />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">🎮 Controls Generator (Camera Zero)</h1>

        {/* CAMERA ZERO */}
        <div className="bg-[#111] p-6 rounded-xl mb-6">
          <h2 className="mb-4 font-semibold">Activar Cámara Cero</h2>
          <div className="flex flex-wrap gap-4 items-center">
            {[
              ['CTRL', camCtrl, setCamCtrl],
              ['SHIFT', camShift, setCamShift],
              ['ALT', camAlt, setCamAlt],
            ].map(([label, value, setter]) => (
              <button
                key={label}
                onClick={() => setter(!value)}
                className={`px-5 py-2 border rounded-lg transition-colors ${
                  value ? 'border-yellow-400 bg-yellow-400/10' : 'border-gray-600 hover:bg-gray-800'
                }`}
              >
                {label}
              </button>
            ))}

            <div className="w-20 h-14 flex items-center justify-center bg-black border border-yellow-400 rounded-lg shadow-[0_0_10px_rgba(255,204,0,0.4)] font-mono">
              {camKey}
            </div>
          </div>
        </div>

        {/* TELEPORT */}
        <div className="bg-[#111] p-6 rounded-xl mb-6">
          <h2 className="mb-4 font-semibold">Teleport</h2>
          <div className="flex flex-wrap gap-4 items-center">
            {[
              ['CTRL', tpCtrl, setTpCtrl],
              ['SHIFT', tpShift, setTpShift],
              ['ALT', tpAlt, setTpAlt],
            ].map(([label, value, setter]) => (
              <button
                key={label}
                onClick={() => setter(!value)}
                className={`px-5 py-2 border rounded-lg transition-colors ${
                  value ? 'border-yellow-400 bg-yellow-400/10' : 'border-gray-600 hover:bg-gray-800'
                }`}
              >
                {label}
              </button>
            ))}

            <button
              onClick={() => setTpKey(tpKey ? '' : 'f9')}
              className={`w-20 h-14 flex items-center justify-center border rounded-lg font-mono transition-all ${
                tpKey
                  ? 'border-yellow-400 shadow-[0_0_10px_rgba(255,204,0,0.4)]'
                  : 'border-gray-600'
              }`}
            >
              {tpKey || 'OFF'}
            </button>
          </div>
        </div>

        {/* MOVIMIENTO */}
        <div className="bg-[#111] p-6 rounded-xl mb-8">
          <h2 className="mb-6 font-semibold">Movimiento Cámara</h2>

          <div className="flex gap-4 mb-8">
            {['flechas', 'numpad', 'custom'].map((mode) => (
              <button
                key={mode}
                onClick={() => handleModeChange(mode)}
                className={`px-5 py-2 border rounded-lg transition-colors ${
                  movementMode === mode
                    ? 'border-yellow-400 bg-yellow-400/10'
                    : 'border-gray-600 hover:bg-gray-800'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex justify-center mb-6">
            <div className="grid grid-cols-3 gap-3 w-fit">
              <div /> {/* empty top-left */}

              <button
                onClick={() => setActiveDir('up')}
                className={`w-24 h-24 flex flex-col items-center justify-center border rounded-xl text-3xl font-bold transition-all ${
                  activeDir === 'up'
                    ? 'border-yellow-400 bg-yellow-400/10 shadow-[0_0_12px_rgba(255,204,0,0.5)]'
                    : 'border-gray-700 bg-gray-900/50 hover:bg-gray-800'
                }`}
              >
                {renderKey('up')}
                <div className="text-xs mt-2 opacity-80">{renderHint('up')}</div>
              </button>

              <div /> {/* empty */}

              <button
                onClick={() => setActiveDir('left')}
                className={`w-24 h-24 flex flex-col items-center justify-center border rounded-xl text-3xl font-bold transition-all ${
                  activeDir === 'left'
                    ? 'border-yellow-400 bg-yellow-400/10 shadow-[0_0_12px_rgba(255,204,0,0.5)]'
                    : 'border-gray-700 bg-gray-900/50 hover:bg-gray-800'
                }`}
              >
                {renderKey('left')}
                <div className="text-xs mt-2 opacity-80">{renderHint('left')}</div>
              </button>

              <button
                onClick={() => setActiveDir('down')}
                className={`w-24 h-24 flex flex-col items-center justify-center border rounded-xl text-3xl font-bold transition-all ${
                  activeDir === 'down'
                    ? 'border-yellow-400 bg-yellow-400/10 shadow-[0_0_12px_rgba(255,204,0,0.5)]'
                    : 'border-gray-700 bg-gray-900/50 hover:bg-gray-800'
                }`}
              >
                {renderKey('down')}
                <div className="text-xs mt-2 opacity-80">{renderHint('down')}</div>
              </button>

              <button
                onClick={() => setActiveDir('right')}
                className={`w-24 h-24 flex flex-col items-center justify-center border rounded-xl text-3xl font-bold transition-all ${
                  activeDir === 'right'
                    ? 'border-yellow-400 bg-yellow-400/10 shadow-[0_0_12px_rgba(255,204,0,0.5)]'
                    : 'border-gray-700 bg-gray-900/50 hover:bg-gray-800'
                }`}
              >
                {renderKey('right')}
                <div className="text-xs mt-2 opacity-80">{renderHint('right')}</div>
              </button>
            </div>
          </div>

          {movementMode === 'custom' && (
            <div className="flex justify-center">
              <input
                ref={inputRef}
                value={renderHint(activeDir)}
                readOnly
                className="w-80 h-12 text-center text-lg bg-black border-2 border-yellow-500/70 rounded-xl focus:outline-none focus:border-yellow-400 shadow-[0_0_10px_rgba(255,204,0,0.3)]"
              />
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleGenerate}
            className="bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-xl text-lg font-semibold transition-colors"
          >
            Generar Controls
          </button>
        </div>

        {output && (
          <div className="mt-10 bg-black/60 p-6 rounded-xl border border-gray-700">
            <pre className="text-green-300 font-mono whitespace-pre-wrap">{output}</pre>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CameraToolPage;