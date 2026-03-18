import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Upload, X, FileText } from 'lucide-react';

import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import CodeBlock from '@/components/CodeBlock.jsx';
import CopyButton from '@/components/CopyButton.jsx';
import DownloadButton from '@/components/DownloadButton.jsx';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

const CameraToolPage = () => {
  const fileInputRef = useRef(null);

  const [useArrows, setUseArrows] = useState(false);

  const [controls, setControls] = useState({
    camera: { key: '7', ctrl: false, shift: false, alt: false },
    teleport: { key: 'x', ctrl: false, shift: false, alt: false },
    forward: { key: 'w', ctrl: false, shift: false, alt: false },
    backward: { key: 's', ctrl: false, shift: false, alt: false },
    left: { key: 'a', ctrl: false, shift: false, alt: false },
    right: { key: 'd', ctrl: false, shift: false, alt: false },
  });

  const [fileContent, setFileContent] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [result, setResult] = useState('');
  const [success, setSuccess] = useState(false);

  const reset = () => {
    setResult('');
    setSuccess(false);
  };

  const handleToggleArrows = (value) => {
    const enabled = !!value;
    setUseArrows(enabled);

    if (enabled) {
      setControls(prev => ({
        ...prev,
        forward: { ...prev.forward, ctrl: false, shift: false, alt: false },
        backward: { ...prev.backward, ctrl: false, shift: false, alt: false },
        left: { ...prev.left, ctrl: false, shift: false, alt: false },
        right: { ...prev.right, ctrl: false, shift: false, alt: false },
      }));
    }

    reset();
  };

  const updateControl = (name, field, value) => {
    setControls(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        [field]: value,
      },
    }));
    reset();
  };

  const normalizeKey = (rawKey, action) => {
    if (useArrows) {
      if (action === 'forward') return 'uarrow';
      if (action === 'backward') return 'darrow';
      if (action === 'left') return 'larrow';
      if (action === 'right') return 'rarrow';
    }

    const key = String(rawKey || '').trim().toLowerCase();

    const aliases = {
      arrowup: 'uarrow',
      up: 'uarrow',
      arrowdown: 'darrow',
      down: 'darrow',
      arrowleft: 'larrow',
      left: 'larrow',
      arrowright: 'rarrow',
      right: 'rarrow',
      '+': 'plus',
      '-': 'minus',
      ' ': 'space',
      escape: 'esc',
      control: 'lctrl',
      ctrl: 'lctrl',
      shift: 'lshift',
      alt: 'lalt',
    };

    return aliases[key] || key;
  };

  const buildExpression = (data, action) => {
    const keyName = normalizeKey(data.key, action);
    if (!keyName) return 'unbound';

    const parts = [];

    if (data.ctrl) parts.push('(keyboard.lctrl?0 | keyboard.rctrl?0)');
    if (data.shift) parts.push('(keyboard.lshift?0 | keyboard.rshift?0)');
    if (data.alt) parts.push('(keyboard.lalt?0 | keyboard.ralt?0)');

    parts.push(`keyboard.${keyName}?0`);

    return parts.join(' & ');
  };

  const replaceQuotedMixLine = (line, actionName, newExpr) => {
    if (!line.includes(`mix ${actionName} `)) return null;

    const firstQuote = line.indexOf('"');
    const lastQuote = line.lastIndexOf('"');

    if (firstQuote === -1 || lastQuote === -1) {
      return `mix ${actionName} \`${newExpr}\``;
    }

    const prefix = line.slice(0, firstQuote + 1);
    const suffix = line.slice(lastQuote);
    return `${prefix}mix ${actionName} \`${newExpr}\`${suffix}`;
  };

  const replaceOrInsertMix = (lines, actionName, expr) => {
    let found = false;

    let updated = lines.map(line => {
      const replaced = replaceQuotedMixLine(line, actionName, expr);
      if (replaced !== null) {
        found = true;
        return replaced;
      }
      return line;
    });

    if (!found) {
      updated.push(`config_line: "mix ${actionName} \`${expr}\`"`);
    }

    return updated;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setFileContent(String(event.target?.result || ''));
      setUploadedFile(file);
      reset();
    };
    reader.readAsText(file);
  };

  const clearFile = () => {
    setUploadedFile(null);
    setFileContent(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    reset();
  };

  const handleGenerate = () => {
    if (!fileContent) return;

    let lines = fileContent.split('\n');

    const mappings = [
      { action: 'camera_zero', expr: buildExpression(controls.camera, 'camera') },
      { action: 'teleport', expr: buildExpression(controls.teleport, 'teleport') },
      { action: 'dbgfwd', expr: buildExpression(controls.forward, 'forward') },
      { action: 'dbgback', expr: buildExpression(controls.backward, 'backward') },
      { action: 'dbgleft', expr: buildExpression(controls.left, 'left') },
      { action: 'dbgright', expr: buildExpression(controls.right, 'right') },
    ];

    mappings.forEach(({ action, expr }) => {
      lines = replaceOrInsertMix(lines, action, expr);
    });

    setResult(lines.join('\n'));
    setSuccess(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Herramienta de Cámara - MundoATS</title>
      </Helmet>

      <Header />

      <main className="flex-1 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6">
            Herramienta de Cámara
          </h1>

          <div className="bg-card p-6 rounded-xl space-y-6">

            {Object.entries(controls).map(([name, data]) => {
              const isMovement = ['forward', 'backward', 'left', 'right'].includes(name);

              return (
                <div key={name} className="border border-border rounded-lg p-4 space-y-3">
                  <Label className="capitalize">
                    {name === 'camera' && 'Cámara cero'}
                    {name === 'teleport' && 'Teleport'}
                    {name === 'forward' && 'Adelante'}
                    {name === 'backward' && 'Atrás'}
                    {name === 'left' && 'Izquierda'}
                    {name === 'right' && 'Derecha'}
                  </Label>

                  <div className="flex gap-4 flex-wrap items-center">
                    <div className="flex gap-3 items-center">
                      <Checkbox
                        disabled={useArrows && isMovement}
                        checked={!!data.ctrl}
                        onCheckedChange={(v) => updateControl(name, 'ctrl', !!v)}
                      />
                      <Label>CTRL</Label>

                      <Checkbox
                        disabled={useArrows && isMovement}
                        checked={!!data.shift}
                        onCheckedChange={(v) => updateControl(name, 'shift', !!v)}
                      />
                      <Label>SHIFT</Label>

                      <Checkbox
                        disabled={useArrows && isMovement}
                        checked={!!data.alt}
                        onCheckedChange={(v) => updateControl(name, 'alt', !!v)}
                      />
                      <Label>ALT</Label>
                    </div>

                    <Input
                      value={
                        useArrows && isMovement
                          ? (
                              name === 'forward' ? '↑' :
                              name === 'backward' ? '↓' :
                              name === 'left' ? '←' : '→'
                            )
                          : data.key
                      }
                      disabled={useArrows && isMovement}
                      onChange={(e) => updateControl(name, 'key', e.target.value)}
                      className="w-24 text-center"
                    />
                  </div>
                </div>
              );
            })}

            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <Checkbox checked={useArrows} onCheckedChange={handleToggleArrows} />
              <Label>Usar flechas para movimiento</Label>
            </div>

            <div className="flex gap-3 flex-wrap">
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Subir controls.sii
              </Button>

              <Button
                onClick={handleGenerate}
                disabled={!uploadedFile}
                className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold"
              >
                🚀 Generar Configuración
              </Button>
            </div>

            <Input
              ref={fileInputRef}
              type="file"
              accept=".sii"
              onChange={handleFileUpload}
              className="hidden"
            />

            {uploadedFile && (
              <div className="flex gap-2 items-center">
                <FileText className="w-4 h-4" />
                <span>{uploadedFile.name}</span>
                <Button size="icon" onClick={clearFile}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

          </div>

          {success && (
            <div className="mt-6 p-4 bg-green-500/10 border border-green-500 rounded-lg text-green-400">
              ✅ Configuración generada correctamente
            </div>
          )}

          {result && (
            <div className="mt-10">
              <CodeBlock content={result} />
              <div className="flex gap-3 mt-4 flex-wrap">
                <CopyButton text={result} />
                <DownloadButton text={result} filename="controls.sii" />
                <Button onClick={() => setResult('')}>
                  Limpiar
                </Button>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CameraToolPage;