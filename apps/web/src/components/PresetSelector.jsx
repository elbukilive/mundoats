import React from 'react';
import { motion } from 'framer-motion';

const PresetSelector = ({ selected, onSelect }) => {
  const presets = ['Realista', 'Cinemático', 'Gameplay'];

  return (
    <div className="space-y-4">
      <label className="text-base font-medium text-gray-300">
        Preset de Cámara
      </label>

      <div className="flex flex-wrap gap-3">
        {presets.map((preset) => (
          <motion.button
            key={preset}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(preset)}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 border ${
              selected === preset
                ? 'bg-yellow-500/20 border-yellow-400 text-yellow-400 shadow-[0_0_15px_rgba(255,215,0,0.5)]'
                : 'bg-[#111] border-gray-700 text-gray-300 hover:border-yellow-500/50 hover:text-yellow-300 hover:shadow-[0_0_10px_rgba(255,215,0,0.2)]'
            }`}
          >
            {preset}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default PresetSelector;