
import React from 'react';

const PresetSelector = ({ selected, onSelect }) => {
  const presets = ['Realista', 'Cinemático', 'Gameplay'];

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        Preset de Cámara
      </label>
      <div className="flex flex-wrap gap-3">
        {presets.map((preset) => (
          <button
            key={preset}
            onClick={() => onSelect(preset)}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 active:scale-[0.98] ${
              selected === preset
                ? 'bg-primary text-primary-foreground glow-primary'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {preset}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PresetSelector;
