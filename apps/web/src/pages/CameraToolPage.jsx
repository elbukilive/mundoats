import React, { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { generateControls } from '@/utils/ControlsGenerator.js';

const CameraToolPage = () => {

  const inputRef = useRef(null);

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

  const normalizeKey = (v) => v.toLowerCase().trim();

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
      requestAnimationFrame(()=> inputRef.current?.focus());
    }
  };

  useEffect(()=>{
    if(movementMode === "custom"){
      requestAnimationFrame(()=> inputRef.current?.focus());
    }
  },[movementMode, activeDir]);

  useEffect(()=>{
    if(movementMode !== "custom") return;

    const handleKeyDown = (e) => {

      if(!activeDir) return;

      // BACKSPACE = borrar última tecla
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
      camera:buildCombo({
        ctrl:camCtrl,
        shift:camShift,
        alt:camAlt,
        keys:[normalizeKey(camKey)]
      }),
      teleport:buildCombo({
        ctrl:tpCtrl,
        shift:tpShift,
        alt:tpAlt,
        keys:[normalizeKey(tpKey)]
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

  const renderToggle = (label,val,setter)=>(
    <button
      onClick={()=>setter(!val)}
      className={`px-4 py-2 rounded-lg border ${
        val?"border-yellow-400 bg-yellow-400/10":"border-gray-600"
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
            {renderToggle("CTRL",camCtrl,setCamCtrl)}
            {renderToggle("SHIFT",camShift,setCamShift)}
            {renderToggle("ALT",camAlt,setCamAlt)}

            <input
              value={buildDisplay(camCtrl,camShift,camAlt,camKey)}
              onChange={(e)=>setCamKey(e.target.value.split('+').pop().toLowerCase())}
              className="w-32 h-14 text-center bg-black border border-yellow-400 rounded-lg"
            />
          </div>
        </div>

        {/* TELEPORT */}
        <div className="bg-[#111] border border-gray-700 p-6 rounded-xl mb-6">
          <h2 className="mb-4 font-semibold text-lg">Teleport</h2>

          <div className="flex gap-4 items-center flex-wrap">
            {renderToggle("CTRL",tpCtrl,setTpCtrl)}
            {renderToggle("SHIFT",tpShift,setTpShift)}
            {renderToggle("ALT",tpAlt,setTpAlt)}

            <button
              onClick={()=>setTpKey("f9")}
              className={`px-4 py-2 rounded-lg border ${
                tpKey==="f9"?"border-yellow-400 bg-yellow-400/10":"border-gray-600"
              }`}
            >
              F9
            </button>

            <input
              value={buildDisplay(tpCtrl,tpShift,tpAlt,tpKey)}
              onChange={(e)=>setTpKey(e.target.value.split('+').pop().toLowerCase())}
              className="w-32 h-14 text-center bg-black border border-yellow-400 rounded-lg"
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
                {["flechas","numpad","custom"].map(mode => (
                  <button
                    key={mode}
                    onClick={()=>handleModeChange(mode)}
                    className={`px-4 py-2 rounded-lg border ${
                      movementMode===mode?"border-yellow-400 bg-yellow-400/10":"border-gray-600"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {movementMode === "custom" && (
                <div className="flex gap-4">
                  {["ctrl","shift","alt"].map(mod=>(
                    <button
                      key={mod}
                      onClick={()=>updateDir(activeDir,{[mod]:!movementConfig[activeDir][mod]})}
                      className={`px-4 py-2 rounded-lg border ${
                        movementConfig[activeDir][mod]?"border-yellow-400 bg-yellow-400/10":"border-gray-600"
                      }`}
                    >
                      {mod.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}

            </div>

            {/* DERECHA */}
            <div className="flex justify-end pr-20">

              <div className="grid grid-cols-3 gap-4">

                <div></div>

                <button onClick={()=>setActiveDir("up")} className="w-20 h-20 border rounded-lg">
                  <div className="flex flex-col items-center">
                    ↑
                    <span className="text-[10px]">{getDirDisplay("up")}</span>
                  </div>
                </button>

                <div></div>

                <button onClick={()=>setActiveDir("left")} className="w-20 h-20 border rounded-lg">
                  <div className="flex flex-col items-center">
                    ←
                    <span className="text-[10px]">{getDirDisplay("left")}</span>
                  </div>
                </button>

                <div></div>

                <button onClick={()=>setActiveDir("right")} className="w-20 h-20 border rounded-lg">
                  <div className="flex flex-col items-center">
                    →
                    <span className="text-[10px]">{getDirDisplay("right")}</span>
                  </div>
                </button>

                <div></div>

                <button onClick={()=>setActiveDir("down")} className="w-20 h-20 border rounded-lg">
                  <div className="flex flex-col items-center">
                    ↓
                    <span className="text-[10px]">{getDirDisplay("down")}</span>
                  </div>
                </button>

                <div></div>

              </div>

            </div>

          </div>

          {movementMode === "custom" && (
            <div className="flex justify-center mt-6">
              <input
                ref={inputRef}
                value={buildInputValue()}
                onChange={(e)=>handleInputChange(e.target.value)}
                className="w-60 h-12 text-center bg-black border border-yellow-400 rounded-lg"
              />
            </div>
          )}

        </div>

        <button onClick={handleGenerate} className="bg-blue-600 px-6 py-3 rounded-lg">
          Generar Controls
        </button>

        <pre className="mt-6 text-xs">{output}</pre>

      </div>

      <Footer />

    </div>
  );
};

export default CameraToolPage;