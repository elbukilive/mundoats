export function generateControls(content) {

  const lines = content.split('\n');

  let configIndex = -1;
  let maxIndex = -1;
  let found = false;

  // Buscar total de líneas
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('config_lines:')) {
      configIndex = i;
    }

    const match = lines[i].match(/config_lines\[(\d+)\]/);
    if (match) {
      const num = parseInt(match[1]);
      if (num > maxIndex) maxIndex = num;

      if (lines[i].includes('camera_zero')) {
        // Reemplazar si existe
        lines[i] = ` config_lines[${num}]: "mix camera_zero \`(keyboard.lctrl?0 | keyboard.rctrl?0) & (keyboard.lshift?0 | keyboard.rshift?0) & keyboard.z?0\`"`;
        found = true;
      }
    }
  }

  // Si NO existe → agregar
  if (!found) {
    const newIndex = maxIndex + 1;

    lines.splice(configIndex + 1, 0,
      ` config_lines[${newIndex}]: "mix camera_zero \`(keyboard.lctrl?0 | keyboard.rctrl?0) & (keyboard.lshift?0 | keyboard.rshift?0) & keyboard.z?0\`"`
    );

    // actualizar contador
    lines[configIndex] = lines[configIndex].replace(
      /config_lines:\s*\d+/,
      `config_lines: ${newIndex + 1}`
    );
  }

  return lines.join('\n');
}