import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Upload, X, FileText } from 'lucide-react';

import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import PerformanceSelector from '@/components/PerformanceSelector.jsx';
import CodeBlock from '@/components/CodeBlock.jsx';
import CopyButton from '@/components/CopyButton.jsx';
import DownloadButton from '@/components/DownloadButton.jsx';

import { generateConfig } from '@/utils/ConfigGenerator.js';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import { useToast } from '@/hooks/use-toast.js';

const ConfigToolPage = () => {

  const { toast } = useToast();
  const fileInputRef = useRef(null);

  const [performanceLevel, setPerformanceLevel] = useState('Alto');
  const [includePerformance, setIncludePerformance] = useState(true);
  const [includeCamera, setIncludeCamera] = useState(true);

  const [recommendedText, setRecommendedText] = useState("");
  const [cameraBuffer, setCameraBuffer] = useState(70);

  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [generatedConfig, setGeneratedConfig] = useState('');

  // RESET
  const resetGenerated = () => {
    setGeneratedConfig('');
  };

  // PRESETS
  const handlePerformanceChange = (level) => {

    setPerformanceLevel(level);

    const presets = {
      "Ultra Bajo": { text: "PCs muy bajos / integradas", buffer: 30 },
      Bajo: { text: "GTX 750 / 4GB RAM", buffer: 50 },
      Medio: { text: "GTX 1050 / 8GB RAM", buffer: 60 },
      Alto: { text: "GTX 1660 / RTX 2060 / 16GB RAM", buffer: 70 },
      Ultra: { text: "RTX 3070+ / 16GB RAM", buffer: 80 },
      Pro: { text: "RTX 4090 / 32GB RAM", buffer: 90 }
    };

    setRecommendedText(presets[level].text);
    setCameraBuffer(presets[level].buffer);
    resetGenerated();
  };

  // SUBIR ARCHIVO
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setFileContent(event.target.result);
      setUploadedFile(file);
      resetGenerated();
    };
    reader.readAsText(file);
  };

  const clearFile = () => {
    setUploadedFile(null);
    setFileContent(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    resetGenerated();
  };

  // GENERAR
  const handleGenerate = () => {

    if (!fileContent) return; // 🔥 PROTECCIÓN

    const newConfig = generateConfig(
      performanceLevel,
      { includePerformance, includeCamera },
      cameraBuffer
    );

    const originalLines = fileContent.split('\n');
    const newLines = newConfig.split('\n');

    const configMap = {};

    newLines.forEach(line => {
      if (!line.startsWith('uset')) return;
      const key = line.split(' ')[1];
      configMap[key] = line;
    });

    const updatedLines = originalLines.map(line => {

      if (!line.startsWith('uset')) return line;

      const key = line.split(' ')[1];

      if (configMap[key]) {
        const newLine = configMap[key];
        delete configMap[key];
        return newLine;
      }

      return line;
    });

    const missingLines = Object.values(configMap);

    const finalConfig = [
      ...updatedLines,
      '',
      '// ====== MundoATS AUTO SETTINGS ======',
      ...missingLines
    ];

    setGeneratedConfig(finalConfig.join('\n'));

    toast({
      title: "Configuración generada",
      description: "Optimización aplicada correctamente 🚀"
    });
  };

  return (
    <div className="min-h-screen flex flex-col">

      <Helmet>
        <title>MundoATS Config Tool</title>
      </Helmet>

      <Header />

      <main className="flex-1 py-20">
        <div className="max-w-5xl mx-auto px-4">

          <h1 className="text-4xl font-bold mb-4">
            Configuración ATS PRO
          </h1>

          <div className="space-y-8">

            {/* PERFORMANCE */}
            <div className="bg-card p-6 rounded-xl">
              <PerformanceSelector
                selected={performanceLevel}
                onSelect={handlePerformanceChange}
              />

              <p className="text-yellow-400 mt-3">
                {recommendedText}
              </p>
            </div>

            {/* OPCIONES */}
            <div className="bg-card p-6 rounded-xl space-y-4">

              <div className="flex gap-3">
                <Checkbox
                  checked={includePerformance}
                  onCheckedChange={(value) => {
                    setIncludePerformance(value);
                    resetGenerated();
                  }}
                />
                <Label>Optimización de rendimiento</Label>
              </div>

              <div className="flex gap-3">
                <Checkbox
                  checked={includeCamera}
                  onCheckedChange={(value) => {
                    setIncludeCamera(value);
                    resetGenerated();
                  }}
                />
                <Label>Activar cámara cero</Label>
              </div>

              <div>
                <Label>Buffer de cámara: {cameraBuffer}</Label>
                <input
                  type="range"
                  min="30"
                  max="90"
                  step="10"
                  value={cameraBuffer}
                  onChange={(e) => {
                    setCameraBuffer(e.target.value);
                    resetGenerated();
                  }}
                  className="w-full mt-2"
                />
              </div>

              {/* BOTONES ALINEADOS */}
              <div className="flex items-center gap-3 flex-wrap">

                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-2" />
                  Subir config.cfg
                </Button>

                {/* 🔥 SOLO APARECE SI HAY ARCHIVO */}
                {uploadedFile && (
                  <Button onClick={handleGenerate}>
                    Generar Configuración
                  </Button>
                )}

              </div>

              <Input
                ref={fileInputRef}
                type="file"
                accept=".cfg"
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

            {/* OUTPUT */}
            {generatedConfig && (
              <div className="mt-10">
                <CodeBlock content={generatedConfig} />

                <div className="flex gap-2 mt-2">
                  <CopyButton text={generatedConfig} />
                  <DownloadButton text={generatedConfig} filename="config.cfg" />
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ConfigToolPage;