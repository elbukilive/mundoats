import React, { useState, useEffect } from 'react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const CameraToolPage = () => {

  // =========================
  // STATES
  // =========================

  const [activeInput, setActiveInput] = useState(null); 
  // "camera" | "teleport" | "movement"

  // CAMERA
  const [camCtrl, setCamCtrl] = useState(false);
  const [camShift, setCamShift] = useState(false);
  const [camAlt, setCamAlt] = useState(false);
  const [camKey, setCamKey] = useState("");

  // TELEPORT
  const [tpCtrl, setTpCtrl] = useState(false);
  const [tpShift, setTpShift] = useState(false);
  const [tpAlt, setTpAlt] = useState(false);
  const [tpKey, setTpKey] = useState("f9");

  // MOVEMENT
  const [movementMode, setMovementMode] = useState("flechas");
  const [activeDir, setActiveDir] = useState("up");

  const emptyMovement = {
    up: { ctrl:false, shift:false, alt:false, keys:[] },
    down: { ctrl:false, shift:false, alt:false, keys:[] },
    left: { ctrl:false, shift:false, alt:false, keys:[] },
    right: { ctrl:false, shift:false, alt:false, keys:[] },
  };

  const [movementConfig, setMovementConfig] = useState(emptyMovement);

  // =========================
  // HELPERS
  // =========================

  const normalize = (k) => k.toLowerCase();

  const toggleClass = (v) =>
    v ? "border-yellow-400 bg-yellow-400/10" : "border-gray-600";

  const buildDisplay = (ctrl,shift,alt,key) => {
    let p = [];
    if(ctrl) p.push("CTRL");
    if(shift) p.push("SHIFT");
    if(alt) p.push("ALT");
    if(key) p.push(key.toUpperCase());
    return p.join("+");
  };

  const buildMovementDisplay = (cfg) => {
    let p = [];
    if(cfg.ctrl) p.push("CTRL");
    if(cfg.shift) p.push("SHIFT");
    if(cfg.alt) p.push("ALT");
    if(cfg.keys.length) p.push(...cfg.keys.map(k=>k.toUpperCase()));
    return p.join("+");
  };

  const updateDir = (dir, changes) => {
    setMovementConfig(prev=>({
      ...prev,
      [dir]: { ...prev[dir], ...changes }
    }));
  };

  // =========================
  // KEYBOARD GLOBAL
  // =========================

  useEffect(()=>{

    const handleKey = (e) => {

      // evitar que capture si no hay foco
      if(!activeInput) return;

      const key = normalize(e.key);

      // CAMERA
      if(activeInput === "camera"){
        if(key === "control") setCamCtrl(v=>!v);
        else if(key === "shift") setCamShift(v=>!v);
        else if(key === "alt") setCamAlt(v=>!v);
        else setCamKey(key);
      }

      // TELEPORT
      if(activeInput === "teleport"){
        if(key === "control") setTpCtrl(v=>!v);
        else if(key === "shift") setTpShift(v=>!v);
        else if(key === "alt") setTpAlt(v=>!v);
        else if(key === "f9"){
          setTpKey(prev => prev==="f9" ? "" : "f9");
        }
        else setTpKey(key);
      }

      // MOVEMENT
      if(activeInput === "movement"){
        if(key === "control"){
          updateDir(activeDir,{ ctrl: !movementConfig[activeDir].ctrl });
          return;
        }
        if(key === "shift"){
          updateDir(activeDir,{ shift: !movementConfig[activeDir].shift });
          return;
        }
        if(key === "alt"){
          updateDir(activeDir,{ alt: !movementConfig[activeDir].alt });
          return;
        }

        if(key === "backspace"){
          updateDir(activeDir,{
            keys: movementConfig[activeDir].keys.slice(0,-1)
          });
          return;
        }

        const current = movementConfig[activeDir];
        if(current.keys.includes(key)) return;

        updateDir(activeDir,{
          keys:[...current.keys,key]
        });
      }

    };

    window.addEventListener("keydown", handleKey);
    return ()=>window.removeEventListener("keydown", handleKey);

  },[activeInput, movementConfig, activeDir]);

  // =========================
  // RENDER KEY
  // =========================

  const renderKey = (dir) => {
    return { up:"↑", down:"↓", left:"←", right:"→" }[dir];
  };

  // =========================
  // COMPONENT BUTTON
  // =========================

  const Btn = ({label, val, set, section}) => (
    <button
      onClick={()=>{
        set(v=>!v);
        setActiveInput(section);
      }}
      className={`px-4 py-2 rounded-lg border ${toggleClass(val)}`}
    >
      {label}
    </button>
  );

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white">

      <Header />

      <div className="max-w-5xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-8">
          🎮 Controls Generator (Camera Zero)
        </h1>

        {/* CAMERA */}
        <div className="bg-[#111] border p-6 rounded-xl mb-6">
          <h2 className="mb-4">Activar Cámara Cero</h2>

          <div className="flex gap-4 items-center">

            <Btn label="CTRL" val={camCtrl} set={setCamCtrl} section="camera"/>
            <Btn label="SHIFT" val={camShift} set={setCamShift} section="camera"/>
            <Btn label="ALT" val={camAlt} set={setCamAlt} section="camera"/>

            <button
              onClick={()=>setActiveInput("camera")}
              className="w-20 h-14 border border-yellow-400 rounded-lg"
            >
              {camKey || "?"}
            </button>

            <span className="text-yellow-400">
              {buildDisplay(camCtrl,camShift,camAlt,camKey)}
            </span>

          </div>
        </div>

        {/* TELEPORT */}
        <div className="bg-[#111] border p-6 rounded-xl mb-6">
          <h2 className="mb-4">Teleport</h2>

          <div className="flex gap-4 items-center">

            <Btn label="CTRL" val={tpCtrl} set={setTpCtrl} section="teleport"/>
            <Btn label="SHIFT" val={tpShift} set={setTpShift} section="teleport"/>
            <Btn label="ALT" val={tpAlt} set={setTpAlt} section="teleport"/>

            <button
              onClick={()=>setTpKey(prev=>prev==="f9"?"":"f9")}
              className={`px-4 py-2 border rounded-lg ${toggleClass(tpKey==="f9")}`}
            >
              F9
            </button>

            <button
              onClick={()=>setActiveInput("teleport")}
              className="w-20 h-14 border border-yellow-400 rounded-lg"
            >
              {tpKey || "?"}
            </button>

            <span className="text-yellow-400">
              {buildDisplay(tpCtrl,tpShift,tpAlt,tpKey)}
            </span>

          </div>
        </div>

        {/* MOVEMENT */}
        <div className="bg-[#111] border p-6 rounded-xl mb-6">

          <h2 className="mb-4">Movimiento Cámara</h2>

          <div className="flex gap-4 mb-6">
            {["flechas","custom"].map(m=>(
              <button
                key={m}
                onClick={()=>setMovementMode(m)}
                className={`px-4 py-2 border rounded-lg ${
                  movementMode===m?"border-yellow-400 bg-yellow-400/10":"border-gray-600"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex gap-4 mb-6">

            <Btn label="CTRL" val={movementConfig[activeDir].ctrl}
              set={()=>updateDir(activeDir,{ctrl:!movementConfig[activeDir].ctrl})}
              section="movement"
            />

            <Btn label="SHIFT" val={movementConfig[activeDir].shift}
              set={()=>updateDir(activeDir,{shift:!movementConfig[activeDir].shift})}
              section="movement"
            />

            <Btn label="ALT" val={movementConfig[activeDir].alt}
              set={()=>updateDir(activeDir,{alt:!movementConfig[activeDir].alt})}
              section="movement"
            />

          </div>

          <div className="flex justify-center">

            <div className="grid grid-cols-3 gap-4">

              <div></div>

              <button onClick={()=>{setActiveDir("up");setActiveInput("movement");}} className="w-20 h-20 border rounded-lg">
                ↑
                <div className="text-xs">{buildMovementDisplay(movementConfig.up)}</div>
              </button>

              <div></div>

              <button onClick={()=>{setActiveDir("left");setActiveInput("movement");}} className="w-20 h-20 border rounded-lg">
                ←
                <div className="text-xs">{buildMovementDisplay(movementConfig.left)}</div>
              </button>

              <div></div>

              <button onClick={()=>{setActiveDir("right");setActiveInput("movement");}} className="w-20 h-20 border rounded-lg">
                →
                <div className="text-xs">{buildMovementDisplay(movementConfig.right)}</div>
              </button>

              <div></div>

              <button onClick={()=>{setActiveDir("down");setActiveInput("movement");}} className="w-20 h-20 border rounded-lg">
                ↓
                <div className="text-xs">{buildMovementDisplay(movementConfig.down)}</div>
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