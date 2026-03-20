import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Settings, Camera, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const Inicio = () => {
  const tools = [
    {
      icon: Settings,
      title: 'Configuración General',
      description: 'Optimiza rendimiento, gráficos y controles con ajustes personalizados',
      path: '/config',
      color: 'yellow-400'
    },
    {
      icon: Camera,
      title: 'Cámara Cero',
      description: 'Crea presets avanzados con movimiento y teletransporte',
      path: '/camara-cero',
      color: 'amber-500'
    },
    {
      icon: Package,
      title: 'Gestión de Mods',
      description: 'Organiza, detecta conflictos y ordena tu lista de mods (próximamente)',
      path: '/perfiles', // ← lo dejamos pero con aviso, o cámbialo a '#' temporal
      color: 'orange-500',
      disabled: true // ← opcional: para deshabilitar clic si aún no existe
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0b0f] text-white">
      <Helmet>
        <title>MundoATS - Herramientas para American Truck Simulator</title>
        <meta name="description" content="Herramientas profesionales para optimizar tu experiencia en ATS: configuración, cámara cero y gestión de mods." />
        <meta name="keywords" content="ATS, American Truck Simulator, cámara cero, mods, configuración, herramientas" />
      </Helmet>

      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Fondo */}
          <div 
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1555907188-f9fd038c95d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#0b0b0f]/95 via-[#0b0b0f]/85 to-[#0b0b0f]" />
          </div>

          {/* Contenido */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight tracking-tight">
                Herramientas para <span className="text-yellow-400">American Truck Simulator</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
                Optimiza tu experiencia de juego con herramientas profesionales para configuración, cámara cero y gestión de mods
              </p>
            </motion.div>

            {/* Tarjetas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {tools.map((tool, index) => {
                const Icon = tool.icon;
                const isDisabled = tool.disabled;

                return (
                  <motion.div
                    key={tool.path}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    {isDisabled ? (
                      <div className="group block bg-[#111] border border-gray-700 rounded-2xl p-8 opacity-60 cursor-not-allowed">
                        <div className={`p-4 rounded-xl bg-${tool.color}/10 text-${tool.color} group-hover:bg-${tool.color}/20 transition-all duration-300 inline-block mb-6`}>
                          <Icon className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-3 text-gray-500">
                          {tool.title}
                        </h3>
                        <p className="text-gray-500 leading-relaxed">
                          {tool.description} (próximamente)
                        </p>
                      </div>
                    ) : (
                      <Link
                        to={tool.path}
                        className="group block bg-[#111] border border-gray-700 rounded-2xl p-8 hover:border-yellow-400 hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all duration-300 hover:-translate-y-2"
                      >
                        <div className={`p-4 rounded-xl bg-${tool.color}/10 text-${tool.color} group-hover:bg-${tool.color}/20 transition-all duration-300 inline-block mb-6`}>
                          <Icon className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-3 group-hover:text-yellow-400 transition-colors">
                          {tool.title}
                        </h3>
                        <p className="text-gray-400 leading-relaxed">
                          {tool.description}
                        </p>
                      </Link>
                    )}
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

export default Inicio;