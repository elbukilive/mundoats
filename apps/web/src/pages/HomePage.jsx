
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Settings, Camera, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const HomePage = () => {
  const tools = [
    {
      icon: Settings,
      title: 'Herramienta de Configuración',
      description: 'Genera configuraciones optimizadas basadas en tu hardware',
      path: '/config',
      color: 'primary'
    },
    {
      icon: Camera,
      title: 'Herramienta de Cámara',
      description: 'Crea presets de cámara personalizados para tu estilo de juego',
      path: '/camera',
      color: 'secondary'
    },
    {
      icon: Package,
      title: 'Herramienta de Mods',
      description: 'Organiza y detecta conflictos en tu orden de carga de mods',
      path: '/mods',
      color: 'accent'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>MundoATS - Herramientas para American Truck Simulator</title>
        <meta name="description" content="Herramientas profesionales para optimizar tu experiencia en American Truck Simulator. Genera configuraciones, ajusta cámaras y gestiona mods." />
      </Helmet>

      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
          {/* Background Image with Overlay */}
          <div 
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1555907188-f9fd038c95d4)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
                Herramientas para <span className="text-primary">American Truck Simulator</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                Optimiza tu experiencia de juego con herramientas profesionales para configuración, cámaras y gestión de mods
              </p>
            </motion.div>

            {/* Tool Cards */}
            <div className="flex flex-col gap-6 max-w-2xl mx-auto mt-16">
              {tools.map((tool, index) => {
                const Icon = tool.icon;
                return (
                  <motion.div
                    key={tool.path}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  >
                    <Link
                      to={tool.path}
                      className="group block bg-card border border-border rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:glow-primary"
                    >
                      <div className="flex items-start gap-6">
                        <div className={`p-4 rounded-xl bg-${tool.color}/10 text-${tool.color} group-hover:glow-${tool.color} transition-all duration-300`}>
                          <Icon className="w-8 h-8" />
                        </div>
                        <div className="flex-1 text-left">
                          <h2 className="text-2xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                            {tool.title}
                          </h2>
                          <p className="text-muted-foreground leading-relaxed">
                            {tool.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
