import React, { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { generateControls } from '@/utils/ControlsGenerator.js';

const CameraToolPage = () => {

  const inputRef = useRef(null);

  // =============================
  // STATES
  // =============================

  const [fileContent, setFileContent] = useState('');
  const [output, setOutput] = useState('');

  // CAMERA ZERO
  const [camCtrl, setCamCtrl] = useState(false);
  const [camShift, setCamShift] = useState(false);
  const [camAlt, setCamAlt] = useState(false);
  const [camKey, setCamKey] = useState("0");

  // TELEPORT
  const [tpCtrl, setTpCtrl] = useState(true);
  const [tpShift, setTpShift] = useState(false);
  const [tpAlt, setTpAlt] = useState(false);
  const [tpKey, setTpKey] = useState("f9");

  // MOVIMIENTO
  const [movementMode, setMovementMode] = useState("flechas");
  const [activeDir, setActiveDir] = useState("up");

  const emptyMovement = {
    up: { ctrl:false, shift:false, alt:false, keys:[] },
    down: { ctrl:false, shift:false, alt:false, keys:[] },
    left: { ctrl:false, shift:false, alt:false, keys:[] },
    right: { ctrl:false, shift:false, alt:false, keys:[] },
  };

  const [movementConfig, setMovementConfig] = useState(emptyMovement);

  // =============================
  // HELPERS
  // =============================

  const normalizeKey = (v) => v.toLowerCase().trim();

  const buildDisplay = (ctrl, shift, alt, key) => {
    let parts = [];
    if (ctrl) parts.push("CTRL");
    if (shift) parts.push("SHIFT");
    if (alt) parts.push("ALT");
    if (key) parts.push(key.toUpperCase());
    return parts.join("+");
  };

  const updateDir = (dir, changes) => {
    setMovementConfig(prev => ({
      ...prev,
      [dir]: { ...prev[dir], ...changes }
    }));
  };

  // =============================
  // MOVIMIENTO KEY LISTENER
  // =============================

  useEffect(()=>{
    if(movementMode !== "custom") return;

    const handleKeyDown = (e) => {

      if(e.key === "Backspace"){
        e.preventDefault();

        setMovementConfig(prev=>{
          const current = prev[activeDir];
          return {
            ...prev,
            [activeDir]: {
              ...current,
              keys: current.keys.slice(0, -1)
            }
          };
        });

        return;
      }

      if(["Control","Shift","Alt"].includes(e.key)) return;

      e.preventDefault();

      const key = normalizeKey(e.key);

      setMovementConfig(prev=>{
        const current = prev[activeDir];
        if(current.keys.includes(key)) return prev;

        return {
          ...prev,
          [activeDir]: {
            ...current,
            keys: [...current.keys, key]
          }
        };
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return ()=>window.removeEventListener("keydown", handleKeyDown);

  },[movementMode, activeDir]);

  // =============================
  // GENERATE
  // =============================

  const buildCombo = (cfg) => {
    let parts = [];

    if (cfg.ctrl) parts.push("CTRL");
    if (cfg.shift) parts.push("SHIFT");
    if (cfg.alt) parts.push("ALT");

    if(cfg.keys.length) parts.push(...cfg.keys);

    return parts.join("+");
  };

  const handleGenerate = () => {
    alert("Generado (debug)");
  };

  // =============================
  // RENDER
  // =============================

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white">

      <Header />

      <div className="max-w-5xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-8">
          🎮 Controls Generator (Camera Zero)
        </h1>

        {/* ================= CAMERA ZERO ================= */}
        <div className="bg-[#111] border border-gray-700 p-6 rounded-xl mb-6">

          <h2 className="mb-4 text-lg font-semibold">
            Activar Cámara Cero
          </h2>

          <div className="flex gap-4 items-center">

            <button onClick={()=>setCamCtrl(!camCtrl)} className="px-4 py-2 border rounded-lg">
              CTRL
            </button>

            <button onClick={()=>setCamShift(!camShift)} className="px-4 py-2 border rounded-lg">
              SHIFT
            </button>

            <button onClick={()=>setCamAlt(!camAlt)} className="px-4 py-2 border rounded-lg">
              ALT
            </button>

            <input
              value={camKey}
              onChange={(e)=>setCamKey(e.target.value)}
              className="w-20 h-14 text-center bg-black border rounded-lg"
            />

            <div className="text-yellow-400">
              {buildDisplay(camCtrl,camShift,camAlt,camKey)}
            </div>

          </div>
        </div>

        {/* ================= TELEPORT ================= */}
        <div className="bg-[#111] border border-gray-700 p-6 rounded-xl mb-6">

          <h2 className="mb-4 text-lg font-semibold">
            Teleport
          </h2>

          <div className="flex gap-4 items-center">

            <button onClick={()=>setTpCtrl(!tpCtrl)} className="px-4 py-2 border rounded-lg">
              CTRL
            </button>

            <button onClick={()=>setTpShift(!tpShift)} className="px-4 py-2 border rounded-lg">
              SHIFT
            </button>

            <button onClick={()=>setTpAlt(!tpAlt)} className="px-4 py-2 border rounded-lg">
              ALT
            </button>

            <button onClick={()=>setTpKey("f9")} className="px-4 py-2 border rounded-lg">
              F9
            </button>

            <input
              value={tpKey}
              onChange={(e)=>setTpKey(e.target.value)}
              className="w-20 h-14 text-center bg-black border rounded-lg"
            />

            <div className="text-yellow-400">
              {buildDisplay(tpCtrl,tpShift,tpAlt,tpKey)}
            </div>

          </div>
        </div>

        {/* ================= MOVIMIENTO ================= */}
        <div className="bg-[#111] border border-gray-700 p-6 rounded-xl mb-6">

          <h2 className="mb-4 text-lg font-semibold">
            Movimiento Cámara
          </h2>

          <div className="flex gap-4">
            <button onClick={()=>setMovementMode("flechas")}>flechas</button>
            <button onClick={()=>setMovementMode("numpad")}>numpad</button>
            <button onClick={()=>setMovementMode("custom")}>custom</button>
          </div>

        </div>

        <button
          onClick={handleGenerate}
          className="bg-blue-600 px-6 py-3 rounded-lg"
        >
          Generar Controls
        </button>

      </div>

      <Footer />

    </div>
  );
};

export default CameraToolPage;