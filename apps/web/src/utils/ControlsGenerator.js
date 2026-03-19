export const generateControls = (input, config) => {
  try {
    // config = {
    //   camera:    "(keyboard.lctrl?0 | keyboard.rctrl?0) & keyboard.z?0",
    //   teleport:  "(keyboard.lctrl?0 | keyboard.rctrl?0) & keyboard.x?0",
    //   movement:  { up: "...", down: "...", left: "...", right: "..." }
    // }

    // 1. Buscar el número total de líneas declarado
    const totalMatch = input.match(/config_lines:\s*(\d+)/);
    if (!totalMatch) {
      throw new Error("No se encontró 'config_lines: X'");
    }
    let totalLines = parseInt(totalMatch[1], 10);

    // 2. Encontrar la última línea config_lines[N]
    const lineMatches = [...input.matchAll(/config_lines\[(\d+)\]:/g)];
    if (lineMatches.length === 0) {
      throw new Error("No se encontraron líneas config_lines[N]");
    }
    const lastIndex = Math.max(...lineMatches.map(m => parseInt(m[1], 10)));
    let nextIndex = lastIndex + 1;

    let output = input;

    // 3. Función helper para agregar o reemplazar una línea mix
    const addOrReplaceMix = (mixName, combo) => {
      if (!combo || combo.trim() === '') return; // No agregar si está vacío

      // Buscar si ya existe una línea con ese mix
      const regex = new RegExp(`mix ${mixName} \`.*?\``, 'g');
      if (regex.test(output)) {
        // Reemplazar la existente
        output = output.replace(
          regex,
          `mix ${mixName} \`${combo}\``
        );
      } else {
        // Agregar nueva al final (antes del })
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

    // 4. Aplicar los combos que vienen del frontend
    if (config.camera) {
      addOrReplaceMix("camera_zero", config.camera);
    }

    if (config.teleport) {
      addOrReplaceMix("teleport", config.teleport);
    }

    // Movimiento (si decides usar nombres como cam_move_up, etc.)
    if (config.movement) {
      const { up, down, left, right } = config.movement;
      if (up)    addOrReplaceMix("cam_move_up", up);
      if (down)  addOrReplaceMix("cam_move_down", down);
      if (left)  addOrReplaceMix("cam_move_left", left);
      if (right) addOrReplaceMix("cam_move_right", right);
    }

    // 5. Actualizar el contador final de config_lines
    const newTotal = nextIndex - 1; // o totalLines + líneas nuevas agregadas
    output = output.replace(
      /config_lines:\s*\d+/,
      `config_lines: ${newTotal}`
    );

    return output.trim();

  } catch (error) {
    console.error("Error al generar controls.sii:", error);
    return input; // Devuelve el original si algo falla
  }
};