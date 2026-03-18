
export function generateModOrder(modList) {
  const mods = modList
    .split('\n')
    .map(m => m.trim())
    .filter(m => m.length > 0);

  if (mods.length === 0) {
    return '# No se proporcionaron mods';
  }

  // Sort alphabetically for basic load order
  const sortedMods = [...mods].sort((a, b) => a.localeCompare(b));

  let output = '# Orden de Carga Recomendado\n';
  output += `# Total de mods: ${sortedMods.length}\n\n`;
  
  sortedMods.forEach((mod, index) => {
    output += `${index + 1}. ${mod}\n`;
  });

  return output;
}

export function detectConflicts(modList) {
  const mods = modList
    .split('\n')
    .map(m => m.trim())
    .filter(m => m.length > 0);

  if (mods.length < 2) {
    return [];
  }

  const conflicts = [];
  const keywords = [
    { word: 'graphic', label: 'gráficos' },
    { word: 'sound', label: 'sonido' },
    { word: 'traffic', label: 'tráfico' },
    { word: 'weather', label: 'clima' },
    { word: 'physics', label: 'física' },
    { word: 'realistic', label: 'realismo' },
    { word: 'hd', label: 'HD' },
    { word: 'map', label: 'mapas' },
    { word: 'truck', label: 'camiones' }
  ];

  keywords.forEach(({ word, label }) => {
    const matching = mods.filter(m => m.toLowerCase().includes(word));
    if (matching.length > 1) {
      conflicts.push({
        type: label,
        mods: matching
      });
    }
  });

  return conflicts;
}
