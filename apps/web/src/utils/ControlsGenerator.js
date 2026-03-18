export const generateControls = (input, combo = "keyboard.z?0") => {
  try {
    // 🔍 Buscar total de líneas
    const totalMatch = input.match(/config_lines:\s*(\d+)/);
    if (!totalMatch) {
      throw new Error("No se encontró config_lines");
    }

    let totalLines = parseInt(totalMatch[1]);

    // 🔍 Encontrar última línea config_lines[x]
    const lines = [...input.matchAll(/config_lines\[(\d+)\]:/g)];
    if (lines.length === 0) {
      throw new Error("No se encontraron config_lines[]");
    }

    const lastIndex = Math.max(...lines.map(m => parseInt(m[1])));
    const newIndex = lastIndex + 1;

    // 🎮 Combinación final (puedes cambiarla dinámicamente después)
    const finalCombo = `(keyboard.lctrl?0 | keyboard.rctrl?0) & (keyboard.lshift?0 | keyboard.rshift?0) & ${combo}`;

    const newLine = ` config_lines[${newIndex}]: "mix camera_zero \`${finalCombo}\`"`;

    // 🔥 Insertar ANTES del cierre del bloque
    const insertPosition = input.lastIndexOf("}");

    if (insertPosition === -1) {
      throw new Error("No se encontró cierre de bloque");
    }

    let output =
      input.slice(0, insertPosition).trimEnd() +
      "\n" +
      newLine +
      "\n" +
      input.slice(insertPosition);

    // 🔄 Actualizar contador
    output = output.replace(
      /config_lines:\s*\d+/,
      `config_lines: ${totalLines + 1}`
    );

    return output;

  } catch (error) {
    console.error(error);
    return input;
  }
};