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

  const [camKey] = useState("0");

  const [tpCtrl, setTpCtrl] = useState(true);
  const [tpShift, setTpShift] = useState(false);
  const [tpAlt, setTpAlt] = useState(false);
  const [tpKey] = useState("f9");

  const [movementMode, setMovementMode] = useState("flechas");
  const [activeDir, setActiveDir] = useState("up");

  const emptyMovement = {
    up: { ctrl:false, shift:false, alt:false, keys:[] },
    down: { ctrl:false, shift:false, alt:false, keys:[] },
    left: { ctrl:false, shift:false, alt:false, keys:[] },
    right: { ctrl:false, shift:false, alt:false, keys:[] },
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
    setMovementConfig(emptyMovement);
    setActiveDir("up");

    if(mode === "custom"){
      requestAnimationFrame(()=>{
        inputRef.current?.focus();
      });
    }
  };

  useEffect(()=>{
    if(movementMode === "custom"){
      requestAnimationFrame(()=>{
        inputRef.current?.focus();
      });
    }
  },[movementMode, activeDir]);

  useEffect(()=>{
    if(movementMode !== "custom") return;

    const handleKeyDown = (e) => {

      if(!activeDir) return;

      if (e.key === "Backspace") {
        setMovementConfig(prev => {
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

      const key = e.key.toLowerCase();

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

  const renderKey = (dir) => {
    if (movementMode === "numpad") {
      return { up:"8", down:"2", left:"4", right:"6" }[dir];
    }
    return { up:"↑", down:"↓", left:"←", right:"→" }[dir];
  };

  const renderCombo = (cfg) => {
    let parts = [];
    if (cfg.ctrl) parts.push("C");
    if (cfg.shift) parts.push("S");
    if (cfg.alt) parts.push("A");
    if (cfg.keys.length) parts.push(...cfg.keys.map(k=>k.toUpperCase()));
    return parts.join("+");
  };

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

          <div className="flex gap-4 items-center">
            <button className="px-4 py-2 border border-gray-600 rounded-lg">CTRL</button>
            <button className="px-4 py-2 border border-gray-600 rounded-lg">SHIFT</button>
            <button className="px-4 py-2 border border-gray-600 rounded-lg">ALT</button>

            <div className="w-20 h-14 flex items-center justify-center bg-black border border-yellow-400 rounded-lg shadow-[0_0_10px_rgba(255,204,0,0.5)]">
              {camKey}
            </div>
          </div>
        </div>

        {/* TELEPORT */}
        <div className="bg-[#111] border border-gray-700 p-6 rounded-xl mb-6">
          <h2 className="mb-4 font-semibold text-lg">Teleport</h2>

          <div className="flex gap-4 items-center">
            {[["CTRL",tpCtrl,setTpCtrl],["SHIFT",tpShift,setTpShift],["ALT",tpAlt,setTpAlt]].map(([label,val,set])=>(
              <button
                key={label}
                onClick={()=>set(!val)}
                className={`px-4 py-2 rounded-lg border ${val?"border-yellow-400 bg-yellow-400/10":"border-gray-600"}`}
              >
                {label}
              </button>
            ))}

            <div className="w-20 h-14 flex items-center justify-center bg-black border border-yellow-400 rounded-lg shadow-[0_0_10px_rgba(255,204,0,0.5)]">
              F9
            </div>
          </div>
        </div>

        {/* MOVIMIENTO */}
        <div className="bg-[#111] border border-gray-700 p-6 rounded-xl mb-6">

          <h2 className="mb-6 font-semibold text-lg">Movimiento Cámara</h2>

          {/* 🔥 GRID REAL COMPARTIDO */}
          <div className="grid grid-cols-6 gap-4 items-center">

            {/* FILA 1 */}
            <div className="col-span-3 flex gap-4">
              {["flechas","numpad","custom"].map(mode => (
                <button
                  key={mode}
                  onClick={()=>handleModeChange(mode)}
                  className={`px-4 py-2 rounded-lg border ${movementMode===mode?"border-yellow-400 bg-yellow-400/10":"border-gray-600"}`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <div></div>

            <button className="w-20 h-20 border rounded-lg border-yellow-400 bg-yellow-400/10">
              {renderKey("up")}
            </button>

            <div></div>

            {/* FILA 2 */}
            <div className="col-span-3"></div>

            <button className="w-20 h-20 border rounded-lg border-gray-600 bg-black">
              {renderKey("left")}
            </button>

            <div></div>

            <button className="w-20 h-20 border rounded-lg border-gray-600 bg-black">
              {renderKey("right")}
            </button>

            <div></div>

            {/* FILA 3 */}
            {movementMode === "custom" ? (
              <div className="col-span-3 flex gap-4">
                {["ctrl","shift","alt"].map(mod=>(
                  <button
                    key={mod}
                    onClick={()=>updateDir(activeDir,{[mod]:!movementConfig[activeDir][mod]})}
                    className="px-4 py-2 rounded-lg border border-gray-600"
                  >
                    {mod.toUpperCase()}
                  </button>
                ))}
              </div>
            ) : (
              <div className="col-span-3"></div>
            )}

            <div></div>

            <button className="w-20 h-20 border rounded-lg border-gray-600 bg-black">
              {renderKey("down")}
            </button>

            <div></div>

          </div>

        </div>

      </div>

      <Footer />

    </div>
  );
};

export default CameraToolPage;