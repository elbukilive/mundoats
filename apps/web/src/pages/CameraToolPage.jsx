import React, { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { generateControls } from '@/utils/ControlsGenerator.js';

const CameraToolPage = () => {

  const inputRef = useRef(null);

  // ========================
  // STATES
  // ========================

  const [camCtrl, setCamCtrl] = useState(false);
  const [camShift, setCamShift] = useState(false);
  const [camAlt, setCamAlt] = useState(false);
  const [camKey, setCamKey] = useState("");

  const [tpCtrl, setTpCtrl] = useState(false);
  const [tpShift, setTpShift] = useState(false);
  const [tpAlt, setTpAlt] = useState(false);
  const [tpKey, setTpKey] = useState("f9");

  const [movementMode, setMovementMode] = useState("flechas");
  const [activeDir, setActiveDir] = useState("up");

  const emptyMovement = {
    up: { ctrl:false, shift:false, alt:false, keys:[] },
    down: { ctrl:false, shift:false, alt:false, keys:[] },
    left: { ctrl:false, shift:false, alt:false, keys:[] },
    right: { ctrl:false, shift:false, alt:false, keys:[] },
  };

  const [movementConfig, setMovementConfig] = useState(emptyMovement);

  // ========================
  // HELPERS
  // ========================

  const normalizeKey = (v) => v.toLowerCase().trim();

  const toggleClass = (val) =>
    val ? "border-yellow-400 bg-yellow-400/10" : "border-gray-600";

  const buildDisplay = (ctrl, shift, alt, key) => {
    let parts = [];
    if (ctrl) parts.push("CTRL");
    if (shift) parts.push("SHIFT");
    if (alt) parts.push("ALT");
    if (key) parts.push(key.toUpperCase());
    return parts.join("+");
  };

  const getDirDisplay = (dir) => {
    const cfg = movementConfig[dir];
    let parts = [];
    if (cfg.ctrl) parts.push("CTRL");
    if (cfg.shift) parts.push("SHIFT");
    if (cfg.alt) parts.push("ALT");
    if (cfg.keys.length) parts.push(...cfg.keys.map(k=>k.toUpperCase()));
    return parts.join("+");
  };

  const updateDir = (dir, changes) => {
    setMovementConfig(prev => ({
      ...prev,
      [dir]: { ...prev[dir], ...changes }
    }));
  };

  // ========================
  // KEYBOARD CUSTOM
  // ========================

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

  // ========================
  // RENDER KEY (flechas/numpad)
  // ========================

  const renderKey = (dir) => {
    if (movementMode === "numpad") {
      return { up:"8", down:"2", left:"4", right:"6" }[dir];
    }
    return { up:"↑", down:"↓", left:"←", right:"→" }[dir];
  };

  // ========================
  // UI BUTTON
  // ========================

  const Btn = ({label, val, set}) => (
    <button
      onClick={()=>set(!val)}
      className={`px-4 py-2 rounded-lg border ${toggleClass(val)}`}
    >
      {label}
    </button>
  );

  // ========================
  // RENDER
  // ========================

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white">

      <Header />

      <div className="max-w-5xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-8">
          🎮 Controls Generator (Camera Zero)
        </h1>

        {/* CAMERA ZERO */}
        <div className="bg-[#111] border border-gray-700 p-6 rounded-xl mb-6">
          <h2 className="mb-4 text-lg">Activar Cámara Cero</h2>

          <div className="flex gap-4 items-center flex-wrap">
            <Btn label="CTRL" val={camCtrl} set={setCamCtrl}/>
            <Btn label="SHIFT" val={camShift} set={setCamShift}/>
            <Btn label="ALT" val={camAlt} set={setCamAlt}/>

            <input
              value={camKey}
              onChange={(e)=>setCamKey(e.target.value)}
              className="w-20 h-14 text-center bg-black border border-gray-600 rounded-lg"
            />

            <div className="text-yellow-400">
              {buildDisplay(camCtrl,camShift,camAlt,camKey)}
            </div>
          </div>
        </div>

        {/* TELEPORT */}
        <div className="bg-[#111] border border-gray-700 p-6 rounded-xl mb-6">
          <h2 className="mb-4 text-lg">Teleport</h2>

          <div className="flex gap-4 items-center flex-wrap">
            <Btn label="CTRL" val={tpCtrl} set={setTpCtrl}/>
            <Btn label="SHIFT" val={tpShift} set={setTpShift}/>
            <Btn label="ALT" val={tpAlt} set={setTpAlt}/>

            <button
              onClick={()=>setTpKey("f9")}
              className={`px-4 py-2 rounded-lg border ${toggleClass(tpKey==="f9")}`}
            >
              F9
            </button>

            <input
              value={tpKey}
              onChange={(e)=>setTpKey(e.target.value)}
              className="w-20 h-14 text-center bg-black border border-gray-600 rounded-lg"
            />

            <div className="text-yellow-400">
              {buildDisplay(tpCtrl,tpShift,tpAlt,tpKey)}
            </div>
          </div>
        </div>

        {/* MOVIMIENTO */}
        <div className="bg-[#111] border border-gray-700 p-6 rounded-xl mb-6">

          <h2 className="mb-4 text-lg">Movimiento Cámara</h2>

          <div className="flex gap-4 mb-6">
            {["flechas","numpad","custom"].map(mode=>(
              <button
                key={mode}
                onClick={()=>setMovementMode(mode)}
                className={`px-4 py-2 rounded-lg border ${
                  movementMode===mode ? "border-yellow-400 bg-yellow-400/10":"border-gray-600"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="flex justify-center">

            <div className="grid grid-cols-3 gap-4">

              <div></div>

              <button onClick={()=>setActiveDir("up")} className="w-20 h-20 border rounded-lg">
                <div className="flex flex-col items-center">
                  {renderKey("up")}
                  <span className="text-xs">{getDirDisplay("up")}</span>
                </div>
              </button>

              <div></div>

              <button onClick={()=>setActiveDir("left")} className="w-20 h-20 border rounded-lg">
                <div className="flex flex-col items-center">
                  {renderKey("left")}
                  <span className="text-xs">{getDirDisplay("left")}</span>
                </div>
              </button>

              <div></div>

              <button onClick={()=>setActiveDir("right")} className="w-20 h-20 border rounded-lg">
                <div className="flex flex-col items-center">
                  {renderKey("right")}
                  <span className="text-xs">{getDirDisplay("right")}</span>
                </div>
              </button>

              <div></div>

              <button onClick={()=>setActiveDir("down")} className="w-20 h-20 border rounded-lg">
                <div className="flex flex-col items-center">
                  {renderKey("down")}
                  <span className="text-xs">{getDirDisplay("down")}</span>
                </div>
              </button>

              <div></div>

            </div>

          </div>

        </div>

      </div>

      <Footer />

    </div>
  );
};

export default CameraToolPage;