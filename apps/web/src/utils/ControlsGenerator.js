export const generateControls = (input, config) => {
  try {
    // config = { camera: "...", teleport: "...", movement: { up: "...", down: "...", left: "...", right: "..." } }

    // 1. Buscar total de líneas
    const totalMatch = input.match(/config_lines:\s*(\d+)/);
    if (!totalMatch) throw new Error("No se encontró config_lines");

    let totalLines = parseInt(totalMatch[1], 10);

    // 2. Encontrar la última línea config_lines[N]
    const lineMatches = [...input.matchAll(/config_lines\[(\d+)\]:/g)];
    if (lineMatches.length === 0) throw new Error("No hay líneas config_lines[]");

    const lastIndex = Math.max(...lineMatches.map(m => parseInt(m[1], 10)));
    let nextIndex = lastIndex + 1;

    let output = input;

    // 3. Función para agregar o reemplazar mix
    const addOrReplaceMix = (mixName, combo) => {
      if (!combo || combo.trim() === '') return;

      const regex = new RegExp(`^\\s*config_lines\\[\\d+\\]:\\s*"mix ${mixName} \`.*?\`"$`, 'gm');
      const existing = output.match(regex);

      if (existing) {
        // Reemplazar la existente
        output = output.replace(
          regex,
          ` config_lines[${existing[0].match(/\[\d+\]/)[0].slice(1,-1)}]: "mix ${mixName} \`${combo}\`"`
        );
      } else {
        // Agregar nueva
        const insertPos = output.lastIndexOf('}');
        if (insertPos === -1) throw new Error("No se encontró cierre del bloque");

        const newLine = ` config_lines[${nextIndex}]: "mix ${mixName} \`${combo}\`"`;
        output = 
          output.slice(0, insertPos).trimEnd() + 
          "\n" + 
          newLine + 
          "\n" + 
          output.slice(insertPos);

        nextIndex++;
      }
    };

    // 4. Aplicar todos los combos
    if (config.camera)    addOrReplaceMix("camera_zero", config.camera);
    if (config.teleport)  addOrReplaceMix("teleport", config.teleport);

    if (config.movement) {
      const m = config.movement;
      if (m.up)    addOrReplaceMix("cam_move_up",    m.up);
      if (m.down)  addOrReplaceMix("cam_move_down",  m.down);
      if (m.left)  addOrReplaceMix("cam_move_left",  m.left);
      if (m.right) addOrReplaceMix("cam_move_right", m.right);
    }

    // 5. Actualizar contador de líneas
    const newTotal = nextIndex - 1;
    output = output.replace(
      /config_lines:\s*\d+/,
      `config_lines: ${newTotal}`
    );

    return output.trim();

  } catch (error) {
    console.error("Error generando controls.sii:", error);
    return input;
  }
};