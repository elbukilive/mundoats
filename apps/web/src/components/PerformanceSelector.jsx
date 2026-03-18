import React from 'react';

const PerformanceSelector = ({ selected, onSelect }) => {
  const levels = ['Bajo', 'Medio', 'Alto', 'Ultra', 'Pro'];

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        Nivel de Rendimiento
      </label>
      <div className="flex flex-wrap gap-3">
        {levels.map((level) => (
          <button
            key={level}
            onClick={() => onSelect(level)}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 active:scale-[0.98] ${
              selected === level
                ? 'bg-primary text-primary-foreground glow-primary'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PerformanceSelector;