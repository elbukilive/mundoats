import React, { useState, useRef } from 'react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { generateControls } from '@/utils/ControlsGenerator.js';

const CameraToolPage = () => {

  const fileInputRef = useRef(null);

  const [fileContent, setFileContent] = useState('');
  const [output, setOutput] = useState('');
  const [fileName, setFileName] = useState('');

  // ===== ACTIVAR CÁMARA =====
  const [camKey, setCamKey] = useState("0");

  // ===== TELEPORT =====
  const [tpCtrl, setTpCtrl] = useState(true);
  const [tpShift, setTpShift] = useState(false);
  const [tpAlt, setTpAlt] = useState(false);
  const [tpUseF9, setTpUseF9] = useState(true);
  const [tpKey, setTpKey] = useState("f9");

  // ===== MOVIMIENTO =====
  const [moveMode, setMoveMode] = useState("arrows"); // arrows | numpad

  const [mvCtrl, setMvCtrl] = useState(false);
  const [mvShift, setMvShift] = useState(false);
  const [mvAlt, setMvAlt] = useState(false);

  const [mvCustom, setMvCustom] = useState(false);

  const [mvUp, setMvUp] = useState("");
  const [mvDown, setMvDown] = useState("");
  const [mvLeft, setMvLeft] = useState("");
  const [mvRight, setMvRight] = useState("");

  // ================= FILE =================
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      setFileContent(event.target.result);
    };
    reader.readAsText(file);
  };

  // ================= BUILD =================
  const buildCombo = (ctrl, shift, alt, key) => {
    let parts = [];

    if (ctrl) parts.push("(keyboard.lctrl?0 | keyboard.rctrl?0)");
    if (shift) parts.push("(keyboard.lshift?0 | keyboard.rshift?0)");
    if (alt) parts.push("(keyboard.lalt?0 | keyboard.ralt?0)");

    if (key) parts.push(`keyboard.${key}?0`);

    return parts.join(" & ");
  };

  // ===== MOVEMENT KEYS =====
  const getMovementKeys = () => {
    if (mvCustom) {
      return {
        up: mvUp,
        down: mvDown,
        left: mvLeft,
        right: mvRight
      };
    }

    if (moveMode === "arrows") {
      return {
        up: "up",
        down: "down",
        left: "left",
        right: "right"
      };
    }

    return {
      up: "kp_2",
      down: "kp_5",
      left: "kp_4",
      right: "kp_6"
    };
  };

  // ================= GENERATE =================
  const handleGenerate = () => {
    if (!fileContent) {
      alert("Sube un archivo primero");
      return;
    }

    const cameraCombo = buildCombo(false, false, false, camKey);
    const teleportCombo = buildCombo(tpCtrl, tpShift, tpAlt, tpKey);

    const mvKeys = getMovementKeys();

    const movement = {
      up: buildCombo(mvCtrl, mvShift, mvAlt, mvKeys.up),
      down: buildCombo(mvCtrl, mvShift, mvAlt, mvKeys.down),
      left: buildCombo(mvCtrl, mvShift, mvAlt, mvKeys.left),
      right: buildCombo(mvCtrl, mvShift, mvAlt, mvKeys.right),
    };

    const result = generateControls(fileContent, {
      camera: cameraCombo,
      teleport: teleportCombo,
      movement
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

        {/* UPLOAD */}
        <div
          onClick={() => fileInputRef.current.click()}
          className="cursor-pointer border border-gray-700 bg-[#111] p-6 rounded-xl mb-6 text-center"
        >
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden"/>
          <p className="text-gray-400">
            {fileName ? fileName : "Click para subir controls.sii"}
          </p>
        </div>

        {/* ===== MOVIMIENTO ===== */}
        <div className="bg-[#111] border border-gray-700 p-6 rounded-xl mb-6">

          <h2 className="mb-6 font-semibold text-lg">Movimiento Cámara</h2>

          {/* MODE */}
          <div className="flex gap-4 mb-4">

            <button
              onClick={() => { setMoveMode("arrows"); setMvCustom(false); }}
              className={`px-4 py-2 rounded-lg border ${moveMode === "arrows" ? "border-yellow-400" : "border-gray-600"}`}
            >
              Flechas
            </button>

            <button
              onClick={() => { setMoveMode("numpad"); setMvCustom(false); }}
              className={`px-4 py-2 rounded-lg border ${moveMode === "numpad" ? "border-yellow-400" : "border-gray-600"}`}
            >
              Numpad
            </button>

            <button
              onClick={() => setMvCustom(!mvCustom)}
              className={`px-4 py-2 rounded-lg border ${mvCustom ? "border-yellow-400" : "border-gray-600"}`}
            >
              Custom
            </button>

          </div>

          {/* MODIFIERS */}
          <div className="flex gap-4 mb-4">

            <label><input type="checkbox" checked={mvCtrl} onChange={() => setMvCtrl(!mvCtrl)}/> CTRL</label>
            <label><input type="checkbox" checked={mvShift} onChange={() => setMvShift(!mvShift)}/> SHIFT</label>
            <label><input type="checkbox" checked={mvAlt} onChange={() => setMvAlt(!mvAlt)}/> ALT</label>

          </div>

          {/* INPUTS */}
          {mvCustom && (
            <div className="grid grid-cols-4 gap-4">
              <input placeholder="UP" value={mvUp} onChange={(e)=>setMvUp(e.target.value)} />
              <input placeholder="DOWN" value={mvDown} onChange={(e)=>setMvDown(e.target.value)} />
              <input placeholder="LEFT" value={mvLeft} onChange={(e)=>setMvLeft(e.target.value)} />
              <input placeholder="RIGHT" value={mvRight} onChange={(e)=>setMvRight(e.target.value)} />
            </div>
          )}

        </div>

        <button onClick={handleGenerate} className="bg-blue-600 px-6 py-3 rounded-lg">
          Generar Controls
        </button>

        {output && (
          <textarea value={output} readOnly className="w-full h-64 mt-6 bg-black p-4"/>
        )}

      </div>

      <Footer />

    </div>
  );
};

export default CameraToolPage;