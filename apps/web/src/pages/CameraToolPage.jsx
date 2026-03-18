import React, { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { generateControls } from '@/utils/ControlsGenerator.js';

const CameraToolPage = () => {

  const inputRef = useRef(null);

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
  };

  const renderKey = (dir) => {
    if (movementMode === "numpad") {
      return { up:"8", down:"2", left:"4", right:"6" }[dir];
    }
    return { up:"↑", down:"↓", left:"←", right:"→" }[dir];
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
              0
            </div>
          </div>
        </div>

        {/* TELEPORT */}
        <div className="bg-[#111] border border-gray-700 p-6 rounded-xl mb-6">
          <h2 className="mb-4 font-semibold text-lg">Teleport</h2>

          <div className="flex gap-4 items-center">
            <button className="px-4 py-2 border border-yellow-400 bg-yellow-400/10 rounded-lg">CTRL</button>
            <button className="px-4 py-2 border border-gray-600 rounded-lg">SHIFT</button>
            <button className="px-4 py-2 border border-gray-600 rounded-lg">ALT</button>

            <div className="w-20 h-14 flex items-center justify-center bg-black border border-yellow-400 rounded-lg shadow-[0_0_10px_rgba(255,204,0,0.5)]">
              F9
            </div>
          </div>
        </div>

        {/* MOVIMIENTO */}
        <div className="bg-[#111] border border-gray-700 p-6 rounded-xl">

          <h2 className="mb-6 font-semibold text-lg">Movimiento Cámara</h2>

          {/* 🔥 CONTENEDOR COMPARTIDO */}
          <div className="grid grid-cols-2 h-[260px]">

            {/* IZQUIERDA */}
            <div className="grid grid-rows-3">

              {/* FILA 1 */}
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

              {/* FILA 2 */}
              <div></div>

              {/* FILA 3 */}
              <div className="flex items-end gap-4">
                {movementMode === "custom" && ["ctrl","shift","alt"].map(mod=>(
                  <button
                    key={mod}
                    onClick={()=>updateDir(activeDir,{[mod]:!movementConfig[activeDir][mod]})}
                    className="px-4 py-2 border border-gray-600 rounded-lg"
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

                <button className="w-20 h-20 border border-yellow-400 bg-yellow-400/10 rounded-lg flex items-center justify-center">
                  {renderKey("up")}
                </button>

                <div></div>

                <button className="w-20 h-20 border border-gray-600 rounded-lg flex items-center justify-center">
                  {renderKey("left")}
                </button>

                <div></div>

                <button className="w-20 h-20 border border-gray-600 rounded-lg flex items-center justify-center">
                  {renderKey("right")}
                </button>

                <div></div>

                <button className="w-20 h-20 border border-gray-600 rounded-lg flex items-center justify-center">
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