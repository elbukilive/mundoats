
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">MundoATS</span>
            <span className="text-sm text-muted-foreground">
              © 2026 Herramientas para American Truck Simulator
            </span>
          </div>
          
          <div className="flex items-center space-x-6 text-sm">
            <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacidad
            </Link>
            <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
