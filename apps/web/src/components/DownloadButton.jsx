
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const DownloadButton = ({ text, filename = 'config.cfg', label = 'Descargar' }) => {
  const handleDownload = () => {
    try {
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Configuración descargada como ${filename}`);
    } catch (error) {
      toast.error('Error al descargar la configuración');
    }
  };

  return (
    <Button
      onClick={handleDownload}
      variant="secondary"
      className="transition-all duration-200 active:scale-[0.98] hover:glow-secondary"
    >
      <Download className="w-4 h-4 mr-2" />
      {label}
    </Button>
  );
};

export default DownloadButton;
