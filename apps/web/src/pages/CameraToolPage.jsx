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
  const [camKey] = useState("0");

  // TELEPORT
  const [tpCtrl, setTpCtrl] = useState(true);
  const [tpShift, setTpShift] = useState(false);
  const [tpAlt, setTpAlt] = useState(false);
  const [tpKey] = useState("f9");

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

  const updateDir = (dir, changes) => {
    setMovementConfig(prev => ({
      ...prev,
      [dir]: { ...prev[dir], ...changes }
    }));
  };

  // ✅ FIX: reset SIEMPRE al cambiar modo
  const handleModeChange = (mode) => {
    setMovementMode(mode);
    setMovementConfig(emptyMovement);
    setActiveDir("up");

    if(mode === "custom"){
      requestAnimationFrame(()=>inputRef.current?.focus());
    }
  };

  useEffect(()=>{
    if(movementMode === "custom"){
      requestAnimationFrame(()=>inputRef.current?.focus());
    }
  },[movementMode, activeDir]);

  // ✅ FIX: backspace funcional
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

  // ✅ FIX: numpad correcto
  const renderKey = (dir) => {
    if (movementMode === "numpad") {
      return { up:"8", down:"2", left:"4", right:"6" }[dir];
    }
    return { up:"↑", down:"↓", left:"←", right:"→" }[dir];
  };

  const buildCombo = (cfg) => {
    let parts = [];

    if (cfg.ctrl) parts.push("(keyboard.lctrl?0 | keyboard.rctrl?0)");
    if (cfg.shift) parts.push("(keyboard.lshift?0 | keyboard.rshift?0)");
    if (cfg.alt) parts.push("(keyboard.lalt?0 | keyboard.ralt?0)");

    cfg.keys.forEach(k=>{
      parts.push(`keyboard.${k}?0`);
    });

    return parts.join(" & ");
  };

  const buildInputValue = () => {
    const cfg = movementConfig[activeDir];

    let parts = [];
    if (cfg.ctrl) parts.push("CTRL");
    if (cfg.shift) parts.push("SHIFT");
    if (cfg.alt) parts.push("ALT");
    if (cfg.keys.length) parts.push(...cfg.keys.map(k=>k.toUpperCase()));

    return parts.join("+");
  };

  const handleInputChange = (value) => {
    const keys = value
      .toLowerCase()
      .replace(/ctrl|shift|alt/gi,'')
      .split('+')
      .map(k=>k.trim())
      .filter(k=>k);

    updateDir(activeDir,{keys});
  };

  const handleGenerate = () => {
    if (!fileContent) {
      alert("Sube archivo primero");
      return;
    }

    const result = generateControls(fileContent,{
      camera:`keyboard.${camKey}?0`,
      teleport:buildCombo({
        ctrl:tpCtrl,
        shift:tpShift,
        alt:tpAlt,
        keys:[tpKey]
      }),
      movement:{
        up:buildCombo(movementConfig.up),
        down:buildCombo(movementConfig.down),
        left:buildCombo(movementConfig.left),
        right:buildCombo(movementConfig.right),
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

        {/* MOVIMIENTO */}
        <div className="bg-[#111] border border-gray-700 p-6 rounded-xl mb-6">

          <h2 className="mb-6 font-semibold text-lg">Movimiento Cámara</h2>

          {/* 🔥 GRID REAL COMPARTIDO */}
          <div className="grid grid-cols-2 h-[260px]">

            {/* IZQUIERDA */}
            <div className="grid grid-rows-3">

              {/* TOP (alineado con ↑) */}
              <div className="flex items-start gap-4">
                {["flechas","numpad","custom"].map(mode => (
                  <button
                    key={mode}
                    onClick={()=>handleModeChange(mode)}
                    className={`px-4 py-2 rounded-lg border ${
                      movementMode===mode
                        ? "border-yellow-400 bg-yellow-400/10"
                        : "border-gray-600"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              <div></div>

              {/* BOTTOM (alineado con ↓) */}
              <div className="flex items-end gap-4">
                {movementMode === "custom" && ["ctrl","shift","alt"].map(mod=>(
                  <button
                    key={mod}
                    onClick={()=>updateDir(activeDir,{[mod]:!movementConfig[activeDir][mod]})}
                    className={`px-4 py-2 rounded-lg border ${
                      movementConfig[activeDir][mod]
                        ? "border-yellow-400 bg-yellow-400/10"
                        : "border-gray-600"
                    }`}
                  >
                    {mod.toUpperCase()}
                  </button>
                ))}
              </div>

            </div>

            {/* DERECHA */}
            <div className="flex items-center justify-center">

              <div className="grid grid-cols-3 grid-rows-3 gap-4">

                <div></div>

                <button onClick={()=>setActiveDir("up")} className="w-20 h-20 border border-yellow-400 bg-yellow-400/10 rounded-lg">
                  {renderKey("up")}
                </button>

                <div></div>

                <button onClick={()=>setActiveDir("left")} className="w-20 h-20 border border-gray-600 rounded-lg">
                  {renderKey("left")}
                </button>

                <div></div>

                <button onClick={()=>setActiveDir("right")} className="w-20 h-20 border border-gray-600 rounded-lg">
                  {renderKey("right")}
                </button>

                <div></div>

                <button onClick={()=>setActiveDir("down")} className="w-20 h-20 border border-gray-600 rounded-lg">
                  {renderKey("down")}
                </button>

                <div></div>

              </div>

            </div>

          </div>

        </div>

      </div>

      <Footer />

    </div>
  );
};

export default CameraToolPage;