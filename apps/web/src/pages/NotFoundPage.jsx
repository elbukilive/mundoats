
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Página no encontrada - MundoATS</title>
        <meta name="description" content="La página que buscas no existe." />
      </Helmet>

      <Header />

      <main className="flex-1 flex items-center justify-center py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-6">
            Página no encontrada
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            La página que buscas no existe o ha sido movida.
          </p>
          <Link to="/">
            <Button
              size="lg"
              className="px-8 py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] hover:glow-primary"
            >
              <Home className="w-5 h-5 mr-2" />
              Volver al inicio
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFoundPage;
