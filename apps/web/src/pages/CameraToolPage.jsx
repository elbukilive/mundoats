import React, { useState, useRef } from 'react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { generateControls } from '@/utils/ControlsGenerator.js';

const CameraToolPage = () => {
  const fileInputRef = useRef(null);

  const [fileContent, setFileContent] = useState('');
  const [output, setOutput] = useState('');
  const [fileName, setFileName] = useState('');

  // ===== ACTIVAR CÁMARA CERO =====
  const [camCtrl, setCamCtrl] = useState(false);
  const [camShift, setCamShift] = useState(false);
  const [camAlt, setCamAlt] = useState(false);
  const [camKey, setCamKey] = useState('key0');

  // ===== TELEPORT =====
  const [tpCtrl, setTpCtrl] = useState(true);
  const [tpShift, setTpShift] = useState(false);
  const [tpAlt, setTpAlt] = useState(false);
  const [tpUseF9, setTpUseF9] = useState(true);
  const [tpKey, setTpKey] = useState('');

  // ===== MOVIMIENTO =====
  const [moveMode, setMoveMode] = useState('arrows'); // arrows | numpad | custom
  const [mvCtrl, setMvCtrl] = useState(false);
  const [mvShift, setMvShift] = useState(false);
  const [mvAlt, setMvAlt] = useState(false);

  const [mvUp, setMvUp] = useState('');
  const [mvDown, setMvDown] = useState('');
  const [mvLeft, setMvLeft] = useState('');
  const [mvRight, setMvRight] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      setFileContent(event.target.result || '');
    };
    reader.readAsText(file);
  };

  const normalizeKey = (raw) => {
    if (!raw) return '';

    const value = raw.toLowerCase().trim();

    const specialMap = {
      '0': 'key0',
      '1': 'key1',
      '2': 'key2',
      '3': 'key3',
      '4': 'key4',
      '5': 'key5',
      '6': 'key6',
      '7': 'key7',
      '8': 'key8',
      '9': 'key9',
      arrowup: 'uarrow',
      up: 'uarrow',
      '↑': 'uarrow',
      arrowdown: 'darrow',
      down: 'darrow',
      '↓': 'darrow',
      arrowleft: 'larrow',
      left: 'larrow',
      '←': 'larrow',
      arrowright: 'rarrow',
      right: 'rarrow',
      '→': 'rarrow',
      f1: 'f1',
      f2: 'f2',
      f3: 'f3',
      f4: 'f4',
      f5: 'f5',
      f6: 'f6',
      f7: 'f7',
      f8: 'f8',
      f9: 'f9',
      f10: 'f10',
      f11: 'f11',
      f12: 'f12',
      np2: 'num2',
      numpad2: 'num2',
      num2: 'num2',
      np5: 'num5',
      numpad5: 'num5',
      num5: 'num5',
      np4: 'num4',
      numpad4: 'num4',
      num4: 'num4',
      np6: 'num6',
      numpad6: 'num6',
      num6: 'num6',
    };

    if (specialMap[value]) return specialMap[value];

    if (value.length === 1 && /[a-z]/.test(value)) return value;

    return value;
  };

  const displayKey = (keyCode) => {
    const map = {
      key0: '0',
      key1: '1',
      key2: '2',
      key3: '3',
      key4: '4',
      key5: '5',
      key6: '6',
      key7: '7',
      key8: '8',
      key9: '9',
      uarrow: '↑',
      darrow: '↓',
      larrow: '←',
      rarrow: '→',
      num2: '2',
      num5: '5',
      num4: '4',
      num6: '6',
      f1: 'F1',
      f2: 'F2',
      f3: 'F3',
      f4: 'F4',
      f5: 'F5',
      f6: 'F6',
      f7: 'F7',
      f8: 'F8',
      f9: 'F9',
      f10: 'F10',
      f11: 'F11',
      f12: 'F12',
    };

    return map[keyCode] || keyCode?.toUpperCase() || '';
  };

  const buildCombo = (ctrl, shift, alt, key) => {
    const parts = [];

    if (ctrl) parts.push('(keyboard.lctrl?0 | keyboard.rctrl?0)');
    if (shift) parts.push('(keyboard.lshift?0 | keyboard.rshift?0)');
    if (alt) parts.push('(keyboard.lalt?0 | keyboard.ralt?0)');
    if (key) parts.push(`keyboard.${key}?0`);

    return parts.join(' & ');
  };

  const getMovementKeys = () => {
    if (moveMode === 'custom') {
      return {
        up: normalizeKey(mvUp),
        down: normalizeKey(mvDown),
        left: normalizeKey(mvLeft),
        right: normalizeKey(mvRight),
      };
    }

    if (moveMode === 'numpad') {
      return {
        up: 'num2',
        down: 'num5',
        left: 'num4',
        right: 'num6',
      };
    }

    return {
      up: 'uarrow',
      down: 'darrow',
      left: 'larrow',
      right: 'rarrow',
    };
  };

  const handleGenerate = () => {
    if (!fileContent) {
      alert('Sube un archivo primero');
      return;
    }

    const cameraCombo = buildCombo(camCtrl, camShift, camAlt, camKey);
    const teleportCombo = buildCombo(tpCtrl, tpShift, tpAlt, tpUseF9 ? 'f9' : normalizeKey(tpKey));

    const moveKeys = getMovementKeys();
    const movement = {
      up: buildCombo(mvCtrl, mvShift, mvAlt, moveKeys.up),
      down: buildCombo(mvCtrl, mvShift, mvAlt, moveKeys.down),
      left: buildCombo(mvCtrl, mvShift, mvAlt, moveKeys.left),
      right: buildCombo(mvCtrl, mvShift, mvAlt, moveKeys.right),
    };

    const result = generateControls(fileContent, {
      camera: cameraCombo,
      teleport: teleportCombo,
      movement,
    });

    setOutput(result);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      alert('Copiado!');
    } catch {
      alert('No se pudo copiar');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'controls.sii';
    a.click();

    URL.revokeObjectURL(url);
  };

  const pillClass = (active) =>
    `px-4 py-2 rounded-lg border cursor-pointer transition-all select-none ${
      active
        ? 'border-yellow-400 bg-yellow-400/10 shadow-[0_0_10px_rgba(255,204,0,0.45)] text-yellow-300'
        : 'border-gray-600 hover:border-yellow-400/40 text-white'
    }`;

  const boxClass = (active) =>
    `w-16 h-16 flex items-center justify-center rounded-xl border text-xl font-semibold transition-all ${
      active
        ? 'border-yellow-400 bg-yellow-400/10 shadow-[0_0_12px_rgba(255,204,0,0.4)] text-yellow-300'
        : 'border-gray-600 bg-black text-white'
    }`;

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white">
      <Header />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">
          🎮 Controls Generator (Camera Zero)
        </h1>

        {/* UPLOAD */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer border border-gray-700 bg-[#111] p-6 rounded-xl mb-8 text-center hover:border-yellow-400/50 transition"
        >
          <input
            type="file"
            accept=".sii,.txt"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <p className="text-gray-400">
            {fileName ? `📂 ${fileName}` : 'Click para subir controls.sii'}
          </p>
        </div>

        {/* ACTIVAR CAMARA CERO */}
        <div className="bg-[#111] border border-gray-700 p-6 rounded-xl mb-6">
          <h2 className="mb-6 font-semibold text-2xl">Activar Cámara Cero</h2>

          <div className="flex flex-wrap items-center gap-4">
            <label className={pillClass(camCtrl)}>
              <input
                type="checkbox"
                checked={camCtrl}
                onChange={() => setCamCtrl(!camCtrl)}
                className="hidden"
              />
              CTRL
            </label>

            <label className={pillClass(camShift)}>
              <input
                type="checkbox"
                checked={camShift}
                onChange={() => setCamShift(!camShift)}
                className="hidden"
              />
              SHIFT
            </label>

            <label className={pillClass(camAlt)}>
              <input
                type="checkbox"
                checked={camAlt}
                onChange={() => setCamAlt(!camAlt)}
                className="hidden"
              />
              ALT
            </label>

            <input
              value={displayKey(camKey)}
              onChange={(e) => setCamKey(normalizeKey(e.target.value))}
              className="w-24 h-16 text-center text-2xl font-semibold bg-black text-yellow-300 border border-yellow-400 rounded-xl shadow-[0_0_12px_rgba(255,204,0,0.4)] outline-none"
            />
          </div>
        </div>

        {/* TELEPORT */}
        <div className="bg-[#111] border border-gray-700 p-6 rounded-xl mb-6">
          <h2 className="mb-6 font-semibold text-2xl">Teleport</h2>

          <div className="flex flex-wrap items-center gap-4">
            <label className={pillClass(tpCtrl)}>
              <input
                type="checkbox"
                checked={tpCtrl}
                onChange={() => setTpCtrl(!tpCtrl)}
                className="hidden"
              />
              CTRL
            </label>

            <label className={pillClass(tpShift)}>
              <input
                type="checkbox"
                checked={tpShift}
                onChange={() => setTpShift(!tpShift)}
                className="hidden"
              />
              SHIFT
            </label>

            <label className={pillClass(tpAlt)}>
              <input
                type="checkbox"
                checked={tpAlt}
                onChange={() => setTpAlt(!tpAlt)}
                className="hidden"
              />
              ALT
            </label>

            <label className={pillClass(tpUseF9)}>
              <input
                type="checkbox"
                checked={tpUseF9}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setTpUseF9(checked);
                  if (checked) setTpKey('');
                }}
                className="hidden"
              />
              F9
            </label>

            <input
              value={tpUseF9 ? 'F9' : tpKey}
              onChange={(e) => setTpKey(e.target.value)}
              disabled={tpUseF9}
              placeholder=""
              className={`w-24 h-16 text-center text-2xl font-semibold bg-black rounded-xl outline-none transition-all ${
                tpUseF9
                  ? 'text-yellow-300 border border-yellow-400 shadow-[0_0_12px_rgba(255,204,0,0.4)]'
                  : 'text-white border border-gray-600 focus:border-yellow-400 focus:shadow-[0_0_12px_rgba(255,204,0,0.25)]'
              }`}
            />
          </div>
        </div>

        {/* MOVIMIENTO CAMARA */}
        <div className="bg-[#111] border border-gray-700 p-6 rounded-xl mb-6">
          <h2 className="mb-6 font-semibold text-2xl">Movimiento Cámara</h2>

          <div className="flex flex-wrap gap-4 mb-6">
            <button
              type="button"
              onClick={() => setMoveMode('arrows')}
              className={pillClass(moveMode === 'arrows')}
            >
              Flechas
            </button>

            <button
              type="button"
              onClick={() => setMoveMode('numpad')}
              className={pillClass(moveMode === 'numpad')}
            >
              Numpad
            </button>

            <button
              type="button"
              onClick={() => setMoveMode('custom')}
              className={pillClass(moveMode === 'custom')}
            >
              Custom
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <label className={pillClass(mvCtrl)}>
              <input
                type="checkbox"
                checked={mvCtrl}
                onChange={() => setMvCtrl(!mvCtrl)}
                className="hidden"
              />
              CTRL
            </label>

            <label className={pillClass(mvShift)}>
              <input
                type="checkbox"
                checked={mvShift}
                onChange={() => setMvShift(!mvShift)}
                className="hidden"
              />
              SHIFT
            </label>

            <label className={pillClass(mvAlt)}>
              <input
                type="checkbox"
                checked={mvAlt}
                onChange={() => setMvAlt(!mvAlt)}
                className="hidden"
              />
              ALT
            </label>
          </div>

          {moveMode !== 'custom' ? (
            <div className="flex justify-center">
              <div className="grid grid-cols-3 gap-3">
                <div />
                <div className={boxClass(true)}>
                  {moveMode === 'arrows' ? '↑' : '2'}
                </div>
                <div />

                <div className={boxClass(true)}>
                  {moveMode === 'arrows' ? '←' : '4'}
                </div>
                <div />
                <div className={boxClass(true)}>
                  {moveMode === 'arrows' ? '→' : '6'}
                </div>

                <div />
                <div className={boxClass(true)}>
                  {moveMode === 'arrows' ? '↓' : '5'}
                </div>
                <div />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <input
                value={mvUp}
                onChange={(e) => setMvUp(e.target.value)}
                placeholder="Arriba"
                className="h-14 px-4 text-center bg-black text-white border border-gray-600 rounded-xl outline-none focus:border-yellow-400 focus:shadow-[0_0_12px_rgba(255,204,0,0.25)]"
              />
              <input
                value={mvDown}
                onChange={(e) => setMvDown(e.target.value)}
                placeholder="Abajo"
                className="h-14 px-4 text-center bg-black text-white border border-gray-600 rounded-xl outline-none focus:border-yellow-400 focus:shadow-[0_0_12px_rgba(255,204,0,0.25)]"
              />
              <input
                value={mvLeft}
                onChange={(e) => setMvLeft(e.target.value)}
                placeholder="Izquierda"
                className="h-14 px-4 text-center bg-black text-white border border-gray-600 rounded-xl outline-none focus:border-yellow-400 focus:shadow-[0_0_12px_rgba(255,204,0,0.25)]"
              />
              <input
                value={mvRight}
                onChange={(e) => setMvRight(e.target.value)}
                placeholder="Derecha"
                className="h-14 px-4 text-center bg-black text-white border border-gray-600 rounded-xl outline-none focus:border-yellow-400 focus:shadow-[0_0_12px_rgba(255,204,0,0.25)]"
              />
            </div>
          )}
        </div>

        <button
          onClick={handleGenerate}
          className="bg-gradient-to-r from-blue-500 to-blue-700 px-8 py-4 rounded-xl shadow-lg hover:scale-105 transition mb-6 text-2xl font-semibold"
        >
          Generar Controls
        </button>

        {output && (
          <div className="bg-[#111] border border-gray-700 rounded-xl p-4">
            <textarea
              value={output}
              readOnly
              className="w-full h-72 bg-black p-4 rounded text-sm mb-4 border border-gray-700"
            />

            <div className="flex gap-4">
              <button
                onClick={handleCopy}
                className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
              >
                Copiar
              </button>

              <button
                onClick={handleDownload}
                className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700"
              >
                Descargar
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CameraToolPage;