
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import CodeBlock from '@/components/CodeBlock.jsx';
import CopyButton from '@/components/CopyButton.jsx';
import { generateModOrder, detectConflicts } from '@/utils/ModOrderGenerator.js';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ModToolPage = () => {
  const [modList, setModList] = useState('');
  const [generatedOrder, setGeneratedOrder] = useState('');
  const [conflicts, setConflicts] = useState([]);

  const handleGenerate = () => {
    const order = generateModOrder(modList);
    const detectedConflicts = detectConflicts(modList);
    setGeneratedOrder(order);
    setConflicts(detectedConflicts);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Herramienta de Mods - MundoATS</title>
        <meta name="description" content="Organiza tu orden de carga de mods y detecta conflictos potenciales en American Truck Simulator." />
      </Helmet>

      <Header />

      <main className="flex-1 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight" style={{ letterSpacing: '-0.02em' }}>
              Herramienta de Mods
            </h1>
            <p className="text-lg text-muted-foreground mb-12 leading-relaxed max-w-prose">
              Organiza tu orden de carga de mods y detecta conflictos potenciales automáticamente
            </p>

            <div className="space-y-8">
              {/* Mod List Input */}
              <div className="bg-card border border-border rounded-2xl p-8">
                <div className="space-y-3">
                  <Label htmlFor="modList" className="text-sm font-medium">
                    Lista de Mods (uno por línea)
                  </Label>
                  <Textarea
                    id="modList"
                    placeholder="Realistic Graphics Mod&#10;Sound Fixes Pack&#10;Traffic Density Mod&#10;..."
                    value={modList}
                    onChange={(e) => setModList(e.target.value)}
                    rows={10}
                    className="bg-muted border-border text-foreground font-mono text-sm resize-none"
                  />
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                size="lg"
                className="w-full md:w-auto px-8 py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] hover:glow-primary"
              >
                Generar Orden de Carga
              </Button>

              {/* Conflicts */}
              {conflicts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-semibold text-foreground">
                    Conflictos Potenciales Detectados
                  </h3>
                  {conflicts.map((conflict, index) => (
                    <Alert key={index} variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Conflicto de {conflict.type}</AlertTitle>
                      <AlertDescription>
                        Los siguientes mods pueden entrar en conflicto:
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          {conflict.mods.map((mod, i) => (
                            <li key={i} className="text-sm">{mod}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  ))}
                </motion.div>
              )}

              {/* Generated Order */}
              {generatedOrder && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-semibold text-foreground">
                    Orden de Carga Recomendado
                  </h3>
                  <CodeBlock content={generatedOrder} />
                  <div className="flex flex-wrap gap-3">
                    <CopyButton text={generatedOrder} />
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ModToolPage;
