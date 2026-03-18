// src/pages/CameraToolPage.jsx

import { useState } from "react";
import { generateCameraControls } from "../utils/CameraPresetGenerator";

export default function CameraToolPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("arrows");

  const handleGenerate = () => {
    const result = generateCameraControls(input, mode);
    setOutput(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    alert("Copiado 🔥");
  };

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1>🚛 Camera Zero Tool</h1>

      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => setMode("arrows")}>
          Flechas
        </button>
        <button onClick={() => setMode("wasd")}>
          WASD
        </button>
      </div>

      <textarea
        placeholder="Pega aquí tu controls.sii..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{
          width: "100%",
          height: "200px",
          marginBottom: "10px",
        }}
      />

      <br />

      <button onClick={handleGenerate}>
        Generar 🔥
      </button>

      <button onClick={handleCopy} style={{ marginLeft: "10px" }}>
        Copiar 📋
      </button>

      <textarea
        value={output}
        readOnly
        style={{
          width: "100%",
          height: "200px",
          marginTop: "10px",
        }}
      />
    </div>
  );
}