import React, { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { generateControls } from '@/utils/ControlsGenerator.js';

const CameraToolPage = () => {
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  const [fileContent, setFileContent] = useState('');
  const [output, setOutput] = useState('');
  const [fileName, setFileName] = useState('');

  // CAMERA ZERO
  const [camCtrl, setCamCtrl] = useState(false);
  const [camShift, setCamShift] = useState(false);
  const [camAlt, setCamAlt] = useState(false);
  const [camKey, setCamKey] = useState('0');

  // TELEPORT
  const [tpCtrl, setTpCtrl] = useState(true);
  const [tpShift, setTpShift] = useState(true);
  const [tpAlt, setTpAlt] = useState(true);
  const [tpKey, setTpKey] = useState('f9');

  // MOVIMIENTO
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

  const normalizeKey = (value) => {
    return value.toLowerCase().trim().replace(/\s+/g, '');
  };

  const handleModeChange = (mode) => {
    setMovementMode(mode);
    setMovementConfig(emptyMovement);
    setActiveDir('up');

    if (mode === 'custom') {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  };

  useEffect(() => {
    if (movementMode === 'custom') {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [movementMode, activeDir]);

  useEffect(() => {
    if (movementMode !== 'custom') return;

    const handleKeyDown = (e) => {
      if (!activeDir) return;

      if (e.key === 'Backspace') {
        e.preventDefault();

        setMovementConfig((prev) => {
          const current = prev[activeDir];
          return {
            ...prev,
            [activeDir]: {
              ...current,
              keys: current.keys.slice(0, -1),
            },
          };
        });

        return;
      }

      if (['Control', 'Shift', 'Alt'].includes(e.key)) return;

      e.preventDefault();

      const key = normalizeKey(e.key);
      if (!key) return;

      setMovementConfig((prev) => {
        const current = prev[activeDir];
        if (current.keys.includes(key)) return prev;

        return {
          ...prev,
          [activeDir]: {
            ...current,
            keys: [...current.keys, key],
          },
        };
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movementMode, activeDir]);

  const renderKey = (dir) => {
    if (movementMode === 'numpad') {
      return { up: '8', down: '2', left: '4', right: '6' }[dir];
    }
    return { up: '↑', down: '↓', left: '←', right: '→' }[dir];
  };

  const buildCombo = (cfg) => {
    const parts = [];

    if (cfg.ctrl) parts.push('(keyboard.lctrl?0 | keyboard.rctrl?0)');
    if (cfg.shift) parts.push('(keyboard.lshift?0 | keyboard.rshift?0)');
    if (cfg.alt) parts.push('(keyboard.lalt?0 | keyboard.ralt?0)');

    cfg.keys.forEach((k) => {
      if (k) parts.push(`keyboard.${k}?0`);
    });

    return parts.join(' & ');
  };

  const buildInputValue = () => {
    const cfg = movementConfig[activeDir];

    const parts = [];
    if (cfg.ctrl) parts.push('CTRL');
    if (cfg.shift) parts.push('SHIFT');
    if (cfg.alt) parts.push('ALT');
    if (cfg.keys.length) parts.push(...cfg.keys.map((k) => k.toUpperCase()));

    return parts.join('+');
  };

  const handleInputChange = (value) => {
    const keys = value
      .toLowerCase()
      .replace(/ctrl|shift|alt/gi, '')
      .split('+')
      .map((k) => k.trim())
      .filter((k) => k);

    updateDir(activeDir, { keys });
  };

  const handleGenerate = () => {
    if (!fileContent) {
      alert('Sube archivo primero');
      return;
    }

    const result = generateControls(fileContent, {
      camera: buildCombo({
        ctrl: camCtrl,
        shift: camShift,
        alt: camAlt,
        keys: [normalizeKey(camKey)],
      }),
      teleport: buildCombo({
        ctrl: tpCtrl,
        shift: tpShift,
        alt: tpAlt,
        keys: [normalizeKey(tpKey)],
      }),
      movement: {
        up: buildCombo(movementConfig.up),
        down: buildCombo(movementConfig.down),
        left: buildCombo(movementConfig.left),
        right: buildCombo(movementConfig.right),
      },
    });

    setOutput(result);
  };

  const renderToggleButton = (label, value, setter) => (
    <button
      type="button"
      onClick={() => setter(!value)}
      className={`px-4 py-2 rounded-lg border transition ${
        value ? 'border-yellow-400 bg-yellow-400/10' : 'border-gray-600'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white">
      <Header />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">
          🎮 Controls Generator (Camera Zero)
        </h1>

        {/* CAMERA ZERO */}
        <div className="bg-[#111] border border-gray-700 p-6 rounded-xl mb-6">
          <h2 className="mb-4 font-semibold text-lg">Activar Cámara Cero</h2>

          <div className="flex gap-4 items-center flex-wrap">
            {renderToggleButton('CTRL', camCtrl, setCamCtrl)}
            {renderToggleButton('SHIFT', camShift, setCamShift)}
            {renderToggleButton('ALT', camAlt, setCamAlt)}

            <input
              type="text"
              value={camKey}
              onChange={(e) => setCamKey(e.target.value)}
              placeholder="0"
              className="w-20 h-14 text-center bg-black border border-yellow-400 rounded-lg shadow-[0_0_10px_rgba(255,204,0,0.5)] outline-none"
            />
          </div>
        </div>

        {/* TELEPORT */}
        <div className="bg-[#111] border border-gray-700 p-6 rounded-xl mb-6">
          <h2 className="mb-4 font-semibold text-lg">Teleport</h2>

          <div className="flex gap-4 items-center flex-wrap">
            {renderToggleButton('CTRL', tpCtrl, setTpCtrl)}
            {renderToggleButton('SHIFT', tpShift, setTpShift)}
            {renderToggleButton('ALT', tpAlt, setTpAlt)}

            <button
              type="button"
              onClick={() => setTpKey('f9')}
              className={`px-4 py-2 rounded-lg border transition ${
                normalizeKey(tpKey) === 'f9'
                  ? 'border-yellow-400 bg-yellow-400/10'
                  : 'border-gray-600'
              }`}
            >
              F9
            </button>

            <input
              type="text"
              value={tpKey}
              onChange={(e) => setTpKey(e.target.value)}
              placeholder="F9"
              className="w-20 h-14 text-center bg-black border border-yellow-400 rounded-lg shadow-[0_0_10px_rgba(255,204,0,0.5)] outline-none"
            />
          </div>
        </div>

        {/* MOVIMIENTO */}
        <div className="bg-[#111] border border-gray-700 p-6 rounded-xl mb-6">
          <h2 className="mb-6 font-semibold text-lg">Movimiento Cámara</h2>

          <div className="grid grid-cols-2">
            {/* IZQUIERDA */}
            <div className="flex flex-col pt-10">
              <div className="flex gap-4 mb-8">
                {['flechas', 'numpad', 'custom'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handleModeChange(mode)}
                    className={`px-4 py-2 rounded-lg border ${
                      movementMode === mode
                        ? 'border-yellow-400 bg-yellow-400/10'
                        : 'border-gray-600'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {movementMode === 'custom' && (
                <div className="flex gap-4">
                  {['ctrl', 'shift', 'alt'].map((mod) => (
                    <button
                      key={mod}
                      type="button"
                      onClick={() =>
                        updateDir(activeDir, {
                          [mod]: !movementConfig[activeDir][mod],
                        })
                      }
                      className={`px-4 py-2 rounded-lg border ${
                        movementConfig[activeDir][mod]
                          ? 'border-yellow-400 bg-yellow-400/10'
                          : 'border-gray-600'
                      }`}
                    >
                      {mod.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* DERECHA */}
            <div className="flex justify-end pr-20 pt-0">
              <div className="grid grid-cols-3 gap-4">
                <div></div>

                <button
                  type="button"
                  onClick={() => setActiveDir('up')}
                  className={`w-20 h-20 rounded-lg border ${
                    activeDir === 'up'
                      ? 'border-yellow-400 bg-yellow-400/10'
                      : 'border-gray-600 bg-black'
                  }`}
                >
                  {renderKey('up')}
                </button>

                <div></div>

                <button
                  type="button"
                  onClick={() => setActiveDir('left')}
                  className={`w-20 h-20 rounded-lg border ${
                    activeDir === 'left'
                      ? 'border-yellow-400 bg-yellow-400/10'
                      : 'border-gray-600 bg-black'
                  }`}
                >
                  {renderKey('left')}
                </button>

                <div></div>

                <button
                  type="button"
                  onClick={() => setActiveDir('right')}
                  className={`w-20 h-20 rounded-lg border ${
                    activeDir === 'right'
                      ? 'border-yellow-400 bg-yellow-400/10'
                      : 'border-gray-600 bg-black'
                  }`}
                >
                  {renderKey('right')}
                </button>

                <div></div>

                <button
                  type="button"
                  onClick={() => setActiveDir('down')}
                  className={`w-20 h-20 rounded-lg border ${
                    activeDir === 'down'
                      ? 'border-yellow-400 bg-yellow-400/10'
                      : 'border-gray-600 bg-black'
                  }`}
                >
                  {renderKey('down')}
                </button>

                <div></div>
              </div>
            </div>
          </div>

          {movementMode === 'custom' && (
            <div className="flex justify-center mt-6">
              <input
                ref={inputRef}
                value={buildInputValue()}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="CTRL+C"
                className="w-60 h-12 text-center bg-black border border-yellow-400 rounded-lg outline-none"
              />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          className="bg-blue-600 px-6 py-3 rounded-lg"
        >
          Generar Controls
        </button>

        {!!output && (
          <div className="mt-6 bg-[#111] border border-gray-700 p-4 rounded-xl whitespace-pre-wrap">
            {output}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CameraToolPage;