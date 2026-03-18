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
  const [camKey] = useState("0");

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

  const updateDir = (dir, changes) => {
    setMovementConfig(prev => ({
      ...prev,
      [dir]: { ...prev[dir], ...changes }
    }));
  };

  const handleModeChange = (mode) => {
    setMovementMode(mode);
    setActiveDir("up");

    if(mode === "custom"){
      setTimeout(()=>inputRef.current?.focus(), 50);
    }
  };

  // 🔥 INPUT FUNCIONAL (YA NO BUG)
  useEffect(()=>{
    if(movementMode !== "custom") return;

    const handleKeyDown = (e) => {
      if(!activeDir) return;

      if(e.key === "Control"){
        updateDir(activeDir,{ctrl:!movementConfig[activeDir].ctrl});
        return;
      }

      if(e.key === "Shift"){
        updateDir(activeDir,{shift:!movementConfig[activeDir].shift});
        return;
      }

      if(e.key === "Alt"){
        updateDir(activeDir,{alt:!movementConfig[activeDir].alt});
        return;
      }

      e.preventDefault();

      const key = e.key.toLowerCase();

      setMovementConfig(prev=>{
        const current = prev[activeDir];

        if(current.keys.includes(key)){
          return {
            ...prev,
            [activeDir]: {
              ...current,
              keys: current.keys.filter(k=>k!==key)
            }
          };
        }

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

  },[movementMode, activeDir, movementConfig]);

  // 🔥 VISUAL KEYS
  const renderKey = (dir) => {
    if (movementMode === "numpad") {
      return { up:"8", down:"2", left:"4", right:"6" }[dir];
    }
    return { up:"↑", down:"↓", left:"←", right:"→" }[dir];
  };

  const renderHint = (dir) => {
    const cfg = movementConfig[dir];

    let parts = [];
    if(cfg.ctrl) parts.push("CTRL");
    if(cfg.shift) parts.push("SHIFT");
    if(cfg.alt) parts.push("ALT");
    if(cfg.keys.length) parts.push(...cfg.keys.map(k=>k.toUpperCase()));

    return parts.join("+");
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

  const handleGenerate = () => {
    const result = generateControls(fileContent,{
      camera: buildCombo({ctrl:camCtrl,shift:camShift,alt:camAlt,keys:[camKey]}),
      teleport: tpKey ? buildCombo({ctrl:tpCtrl,shift:tpShift,alt:tpAlt,keys:[tpKey]}) : "",
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

        {/* CAMERA */}
        <div className="bg-[#111] p-6 rounded-xl mb-6">
          <h2 className="mb-4 font-semibold">Activar Cámara Cero</h2>

          <div className="flex gap-4 items-center">
            {[["CTRL",camCtrl,setCamCtrl],["SHIFT",camShift,setCamShift],["ALT",camAlt,setCamAlt]].map(([l,v,s])=>(
              <button onClick={()=>s(!v)} className={`px-4 py-2 border rounded-lg ${v?"border-yellow-400 bg-yellow-400/10":"border-gray-600"}`}>
                {l}
              </button>
            ))}

            <div className="w-20 h-14 flex items-center justify-center bg-black border border-yellow-400 rounded-lg shadow-[0_0_10px_rgba(255,204,0,0.5)]">
              {camKey}
            </div>
          </div>
        </div>

        {/* TELEPORT */}
        <div className="bg-[#111] p-6 rounded-xl mb-6">
          <h2 className="mb-4 font-semibold">Teleport</h2>

          <div className="flex gap-4 items-center">
            {[["CTRL",tpCtrl,setTpCtrl],["SHIFT",tpShift,setTpShift],["ALT",tpAlt,setTpAlt]].map(([l,v,s])=>(
              <button onClick={()=>s(!v)} className={`px-4 py-2 border rounded-lg ${v?"border-yellow-400 bg-yellow-400/10":"border-gray-600"}`}>
                {l}
              </button>
            ))}

            <button
              onClick={()=>setTpKey(tpKey ? "" : "f9")}
              className={`w-20 h-14 flex items-center justify-center border rounded-lg ${tpKey?"border-yellow-400 shadow-[0_0_10px_rgba(255,204,0,0.5)]":"border-gray-600"}`}
            >
              {tpKey || "OFF"}
            </button>
          </div>
        </div>

        {/* MOVIMIENTO */}
        <div className="bg-[#111] p-6 rounded-xl mb-6">

          <h2 className="mb-6 font-semibold">Movimiento Cámara</h2>

          <div className="flex gap-4 mb-8">
            {["flechas","numpad","custom"].map(mode => (
              <button
                onClick={()=>handleModeChange(mode)}
                className={`px-4 py-2 border rounded-lg ${movementMode===mode?"border-yellow-400 bg-yellow-400/10":"border-gray-600"}`}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-4">

              <div></div>

              {["up","left","right","down"].map((dir,i)=>(
                <>
                  {dir==="up" && (
                    <button onClick={()=>setActiveDir("up")} className={`w-24 h-24 border rounded-lg ${activeDir==="up"?"border-yellow-400 bg-yellow-400/10":"border-gray-600 bg-black"}`}>
                      {renderKey("up")}
                      <div className="text-xs mt-1">{renderHint("up")}</div>
                    </button>
                  )}

                  {dir==="left" && (
                    <button onClick={()=>setActiveDir("left")} className={`w-24 h-24 border rounded-lg ${activeDir==="left"?"border-yellow-400 bg-yellow-400/10":"border-gray-600 bg-black"}`}>
                      {renderKey("left")}
                      <div className="text-xs mt-1">{renderHint("left")}</div>
                    </button>
                  )}

                  {dir==="right" && (
                    <button onClick={()=>setActiveDir("right")} className={`w-24 h-24 border rounded-lg ${activeDir==="right"?"border-yellow-400 bg-yellow-400/10":"border-gray-600 bg-black"}`}>
                      {renderKey("right")}
                      <div className="text-xs mt-1">{renderHint("right")}</div>
                    </button>
                  )}

                  {dir==="down" && (
                    <button onClick={()=>setActiveDir("down")} className={`w-24 h-24 border rounded-lg ${activeDir==="down"?"border-yellow-400 bg-yellow-400/10":"border-gray-600 bg-black"}`}>
                      {renderKey("down")}
                      <div className="text-xs mt-1">{renderHint("down")}</div>
                    </button>
                  )}
                </>
              ))}

            </div>
          </div>

          {movementMode === "custom" && (
            <div className="flex justify-center mt-6">
              <input
                ref={inputRef}
                value={renderHint(activeDir)}
                readOnly
                className="w-72 h-12 text-center bg-black border border-yellow-400 rounded-lg"
              />
            </div>
          )}

        </div>

        <button onClick={handleGenerate} className="bg-blue-600 px-6 py-3 rounded-lg">
          Generar Controls
        </button>

      </div>

      <Footer />
    </div>
  );
};

export default CameraToolPage;