/**
 * ControlesGenerador.js - VERSIÓN FINAL 100% AUTOMÁTICA
 * Siempre genera cam_zero + teleport + movimiento correctamente
 */
export const generateControls = (input, config) => {
  try {
    let output = input;

    // 1. Eliminar cualquier línea vieja de cam_zero o camera_zero
    output = output.replace(/config_lines\[\d+\]:\s*"mix (camera_zero|cam_zero) `.*?`"\s*/g, '');

    // 2. Encontrar el último índice
    let lastIndex = 0;
    const matches = [...output.matchAll(/config_lines\[(\d+)\]:/g)];
    if (matches.length > 0) {
      lastIndex = Math.max(...matches.map(m => parseInt(m[1], 10)));
    }
    let nextIndex = lastIndex + 1;

    // 3. Crear las líneas nuevas
    let newLines = [];

    if (config.camera) {
      newLines.push(` config_lines[${nextIndex}]: "mix cam_zero \`${config.camera}\`"`);
      nextIndex++;
    }
    if (config.teleport) {
      newLines.push(` config_lines[${nextIndex}]: "mix teleport \`${config.teleport}\`"`);
      nextIndex++;
    }
    if (config.movement) {
      const m = config.movement;
      if (m.up)    { newLines.push(` config_lines[${nextIndex}]: "mix cam_move_up \`${m.up}\`"`); nextIndex++; }
      if (m.down)  { newLines.push(` config_lines[${nextIndex}]: "mix cam_move_down \`${m.down}\`"`); nextIndex++; }
      if (m.left)  { newLines.push(` config_lines[${nextIndex}]: "mix cam_move_left \`${m.left}\`"`); nextIndex++; }
      if (m.right) { newLines.push(` config_lines[${nextIndex}]: "mix cam_move_right \`${m.right}\`"`); nextIndex++; }
    }

    // 4. Insertar las nuevas líneas antes del }
    const closingPos = output.lastIndexOf('}');
    if (closingPos > -1 && newLines.length > 0) {
      const before = output.slice(0, closingPos).trimEnd();
      output = before + '\n' + newLines.join('\n') + '\n' + output.slice(closingPos);
    }

    // 5. Actualizar contador
    output = output.replace(/config_lines:\s*\d+/, `config_lines: ${nextIndex - 1}`);

    return output.trim();

  } catch (e) {
    console.error("Error:", e);
    return input;
  }
};