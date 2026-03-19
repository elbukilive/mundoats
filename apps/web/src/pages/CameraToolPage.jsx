import React, { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { generateControls } from '@/utils/ControlsGenerator.js';

const CameraToolPage = () => {
  const fileInputRef = useRef(null);
  const customInputRef = useRef(null);
  const camKeyInputRef = useRef(null);
  const tpKeyInputRef = useRef(null);

  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false); // Para mostrar feedback de copia

  // ==================== CAMERA ZERO ====================
  const [camCtrl, setCamCtrl] = useState(false);
  const [camShift, setCamShift] = useState(false);
  const [camAlt, setCamAlt] = useState(false);
  const [camMainKey, setCamMainKey] = useState('0');
  const [camKeyError, setCamKeyError] = useState(false);

  // ==================== TELEPORT ====================
  const [tpCtrl, setTpCtrl] = useState(true);
  const [tpShift, setTpShift] = useState(false);
  const [tpAlt, setTpAlt] = useState(false);
  const [tpMainKey, setTpMainKey] = useState('f9');
  const [tpKeyError, setTpKeyError] = useState(false);

  // ==================== MOVIMIENTO ====================
  const [movementMode, setMovementMode] = useState("flechas");
  const [activeDir, setActiveDir] = useState("up");

  const emptyMovement = {
    up:    { ctrl: false, shift: false, alt: false, keys: [] },
    down:  { ctrl: false, shift: false, alt: false, keys: [] },
    left:  { ctrl: false, shift: false, alt: false, keys: [] },
    right: { ctrl: false, shift: false, alt: false, keys: [] },
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
    if (mode === "custom") {
      setTimeout(() => customInputRef.current?.focus(), 80);
    }
  };

  useEffect(() => {
    if (movementMode !== "custom") return;

    const handleKeyDown = (e) => {
      if (!activeDir) return;

      if (e.key === "Control") { updateDir(activeDir, { ctrl: !movementConfig[activeDir].ctrl }); return; }
      if (e.key === "Shift")   { updateDir(activeDir, { shift: !movementConfig[activeDir].shift }); return; }
      if (e.key === "Alt")     { updateDir(activeDir, { alt: !movementConfig[activeDir].alt }); return; }

      e.preventDefault();
      const key = e.key.toLowerCase().trim();

      setMovementConfig(prev => {
        const current = prev[activeDir];
        const hasKey = current.keys.includes(key);
        return {
          ...prev,
          [activeDir]: {
            ...current,
            keys: hasKey ? current.keys.filter(k => k !== key) : [...current.keys, key]
          }
        };
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [movementMode, activeDir, movementConfig]);

  const getComboText = (dir) => {
    const cfg = movementConfig[dir];
    const parts = [];
    if (cfg.ctrl) parts.push("CTRL");
    if (cfg.shift) parts.push("SHIFT");
    if (cfg.alt) parts.push("ALT");
    parts.push(...cfg.keys.map(k => k.toUpperCase()));
    return parts.join(" + ") || "—";
  };

  const getVisualKey = (dir) => {
    if (movementMode === "numpad") {
      return { up: "8", down: "2", left: "4", right: "6" }[dir];
    }
    return { up: "↑", down: "↓", left: "←", right: "→" }[dir];
  };

  const buildCombo = (cfg) => {
    const parts = [];
    if (cfg.ctrl) parts.push("(keyboard.lctrl?0 | keyboard.rctrl?0)");
    if (cfg.shift) parts.push("(keyboard.lshift?0 | keyboard.rshift?0)");
    if (cfg.alt) parts.push("(keyboard.lalt?0 | keyboard.ralt?0)");
    cfg.keys.forEach(k => parts.push(`keyboard.${k}?0`));
    return parts.length ? parts.join(" & ") : "";
  };

  const getCameraComboText = () => {
    const parts = [];
    if (camCtrl) parts.push("CTRL");
    if (camShift)