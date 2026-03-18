import React, { useState, useEffect } from 'react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const CameraToolPage = () => {

  // =========================
  // CONTROL DE FOCO REAL
  // =========================
  const [activeSection, setActiveSection] = useState(null); 
  // camera | teleport | movement

  // =========================
  // CAMERA
  // =========================
  const [cam, setCam] = useState({
    ctrl:false, shift:false, alt:false, key:""
  });

  // =========================
  // TELEPORT
  // =========================
  const [tp, setTp] = useState({
    ctrl:false, shift:false, alt:false, key:"f9"
  });

  // =========================
  // MOVEMENT
  // =========================
  const [movementMode, setMovementMode] = useState("flechas");
  const [activeDir, setActiveDir] = useState("up");

  const empty = {
    up:{ctrl:false,shift:false,alt:false,keys:[]},
    down:{ctrl:false,shift:false,alt:false,keys:[]},
    left:{ctrl:false,shift:false,alt:false,keys:[]},
    right:{ctrl:false,shift:false,alt:false,keys:[]},
  };

  const [movement, setMovement] = useState(empty);

  // =========================
  // KEYBOARD CAPTURE REAL
  // =========================
  useEffect(()=>{

    const handle = (e) => {

      if(!activeSection) return;

      const key = e.key.toLowerCase();

      // ===== CAMERA =====
      if(activeSection === "camera"){
        if(key === "control") setCam(p=>({...p,ctrl:!p.ctrl}));
        else if(key === "shift") setCam(p=>({...p,shift:!p.shift}));
        else if(key === "alt") setCam(p=>({...p,alt:!p.alt}));
        else setCam(p=>({...p,key}));
      }

      // ===== TELEPORT =====
      if(activeSection === "teleport"){
        if(key === "control") setTp(p=>({...p,ctrl:!p.ctrl}));
        else if(key === "shift") setTp(p=>({...p,shift:!p.shift}));
        else if(key === "alt") setTp(p=>({...p,alt:!p.alt}));
        else if(key === "f9") setTp(p=>({...p,key:p.key==="f9"?"":"f9"}));
        else setTp(p=>({...p,key}));
      }

      // ===== MOVEMENT =====
      if(activeSection === "movement"){

        const current = movement[activeDir];

        if(key === "control"){
          setMovement(p=>({...p,[activeDir]:{...current,ctrl:!current.ctrl}}));
          return;
        }

        if(key === "shift"){
          setMovement(p=>({...p,[activeDir]:{...current,shift:!current.shift}}));
          return;
        }

        if(key === "alt"){
          setMovement(p=>({...p,[activeDir]:{...current,alt:!current.alt}}));
          return;
        }

        if(key === "backspace"){
          setMovement(p=>({
            ...p,
            [activeDir]:{
              ...current,
              keys: current.keys.slice(0,-1)
            }
          }));
          return;
        }

        if(!current.keys.includes(key)){
          setMovement(p=>({
            ...p,
            [activeDir]:{
              ...current,
              keys:[...current.keys,key]
            }
          }));
        }
      }

    };

    window.addEventListener("keydown", handle);
    return ()=>window.removeEventListener("keydown", handle);

  },[activeSection, movement, activeDir]);

  // =========================
  // HELPERS
  // =========================

  const glow = (v) =>
    v ? "border-yellow-400 bg-yellow-400/10" : "border-gray-600";

  const display = (cfg) => {
    let p=[];
    if(cfg.ctrl) p.push("CTRL");
    if(cfg.shift) p.push("SHIFT");
    if(cfg.alt) p.push("ALT");
    if(cfg.key) p.push(cfg.key.toUpperCase());
    return p.join("+");
  };

  const displayMove = (cfg) => {
    let p=[];
    if(cfg.ctrl) p.push("CTRL");
    if(cfg.shift) p.push("SHIFT");
    if(cfg.alt) p.push("ALT");
    if(cfg.keys.length) p.push(...cfg.keys.map(k=>k.toUpperCase()));
    return p.join("+");
  };

  const arrow = (d) => {
    if(movementMode==="numpad"){
      return {up:"8",down:"2",left:"4",right:"6"}[d];
    }
    return {up:"↑",down:"↓",left:"←",right:"→"}[d];
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white">

      <Header />

      <div className="max-w-5xl mx-auto p-6">

        <h1 className="text-3xl mb-8 font-bold">
          🎮 Controls Generator (Camera Zero)
        </h1>

        {/* CAMERA */}
        <div className="bg-[#111] p-6 rounded-xl mb-6">
          <h2 className="mb-4">Activar Cámara Cero</h2>

          <div className="flex gap-4 items-center">

            <button onClick={()=>{setCam(p=>({...p,ctrl:!p.ctrl}));setActiveSection("camera")}}
              className={`px-4 py-2 border rounded ${glow(cam.ctrl)}`}>CTRL</button>

            <button onClick={()=>{setCam(p=>({...p,shift:!p.shift}));setActiveSection("camera")}}
              className={`px-4 py-2 border rounded ${glow(cam.shift)}`}>SHIFT</button>

            <button onClick={()=>{setCam(p=>({...p,alt:!p.alt}));setActiveSection("camera")}}
              className={`px-4 py-2 border rounded ${glow(cam.alt)}`}>ALT</button>

            <button onClick={()=>setActiveSection("camera")}
              className="w-20 h-14 border border-yellow-400 rounded">
              {cam.key || "?"}
            </button>

            <span className="text-yellow-400">{display(cam)}</span>

          </div>
        </div>

        {/* TELEPORT */}
        <div className="bg-[#111] p-6 rounded-xl mb-6">
          <h2 className="mb-4">Teleport</h2>

          <div className="flex gap-4 items-center">

            <button onClick={()=>{setTp(p=>({...p,ctrl:!p.ctrl}));setActiveSection("teleport")}}
              className={`px-4 py-2 border rounded ${glow(tp.ctrl)}`}>CTRL</button>

            <button onClick={()=>{setTp(p=>({...p,shift:!p.shift}));setActiveSection("teleport")}}
              className={`px-4 py-2 border rounded ${glow(tp.shift)}`}>SHIFT</button>

            <button onClick={()=>{setTp(p=>({...p,alt:!p.alt}));setActiveSection("teleport")}}
              className={`px-4 py-2 border rounded ${glow(tp.alt)}`}>ALT</button>

            <button onClick={()=>setTp(p=>({...p,key:p.key==="f9"?"":"f9"}))}
              className={`px-4 py-2 border rounded ${glow(tp.key==="f9")}`}>F9</button>

            <button onClick={()=>setActiveSection("teleport")}
              className="w-20 h-14 border border-yellow-400 rounded">
              {tp.key || "?"}
            </button>

            <span className="text-yellow-400">{display(tp)}</span>

          </div>
        </div>

        {/* MOVEMENT */}
        <div className="bg-[#111] p-6 rounded-xl mb-6">

          <h2 className="mb-4">Movimiento Cámara</h2>

          <div className="flex gap-4 mb-6">
            {["flechas","numpad","custom"].map(m=>(
              <button key={m}
                onClick={()=>setMovementMode(m)}
                className={`px-4 py-2 border rounded ${
                  movementMode===m?"border-yellow-400 bg-yellow-400/10":"border-gray-600"
                }`}>
                {m}
              </button>
            ))}
          </div>

          <div className="flex gap-4 mb-6">

            {["ctrl","shift","alt"].map(mod=>(
              <button key={mod}
                onClick={()=>{
                  const c = movement[activeDir];
                  setMovement(p=>({
                    ...p,
                    [activeDir]:{...c,[mod]:!c[mod]}
                  }));
                  setActiveSection("movement");
                }}
                className={`px-4 py-2 border rounded ${
                  movement[activeDir][mod]?"border-yellow-400 bg-yellow-400/10":"border-gray-600"
                }`}>
                {mod.toUpperCase()}
              </button>
            ))}

          </div>

          <div className="flex justify-center">

            <div className="grid grid-cols-3 gap-4">

              <div></div>

              <button onClick={()=>{setActiveDir("up");setActiveSection("movement")}}
                className="w-20 h-20 border rounded">
                {arrow("up")}
                <div className="text-xs">{displayMove(movement.up)}</div>
              </button>

              <div></div>

              <button onClick={()=>{setActiveDir("left");setActiveSection("movement")}}
                className="w-20 h-20 border rounded">
                {arrow("left")}
                <div className="text-xs">{displayMove(movement.left)}</div>
              </button>

              <div></div>

              <button onClick={()=>{setActiveDir("right");setActiveSection("movement")}}
                className="w-20 h-20 border rounded">
                {arrow("right")}
                <div className="text-xs">{displayMove(movement.right)}</div>
              </button>

              <div></div>

              <button onClick={()=>{setActiveDir("down");setActiveSection("movement")}}
                className="w-20 h-20 border rounded">
                {arrow("down")}
                <div className="text-xs">{displayMove(movement.down)}</div>
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