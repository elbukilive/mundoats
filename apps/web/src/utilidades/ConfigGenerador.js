/**
 * Genera ajustes optimizados para config.cfg de American Truck Simulator
 * @param {string} level - Nivel de rendimiento: "Ultra Bajo", "Bajo", "Medio", "Alto", "Ultra", "Pro"
 * @param {Object} options - Opciones adicionales
 * @param {boolean} options.includePerformance - Incluir optimizaciones de rendimiento
 * @param {boolean} options.includeCamera - Incluir buffer de cámara cero
 * @param {number} buffer - Valor del buffer de cámara (30-120)
 * @param {string} originalConfig - Contenido completo del config.cfg original subido (obligatorio para preservar todo)
 * @returns {string} Configuración completa lista para pegar en config.cfg
 */
export const generateConfig = (level = 'Medio', options = {}, buffer = 80, originalConfig = '') => {
  const { includePerformance = true, includeCamera = true } = options;

  let config = [];

  // =============================================
  // 1. PRESERVAR EL CONFIG ORIGINAL (lo más importante)
  // =============================================
  if (originalConfig && originalConfig.trim()) {
    config.push(originalConfig.trim());
    config.push('\n\n'); // Separador visual
  } else {
    config.push('# Configuración base (sin original subido) + optimizaciones MundoATS');
    config.push('# ¡Sube tu config.cfg original para preservar todos los valores!');
    config.push('');
  }

  // =============================================
  // 2. BASE COMÚN (siempre incluido)
  // =============================================
  config.push('// ====== GENERADO POR MUNDOATS PRO ====== ');
  config.push('uset g_console "1"'); // Consola activada (útil para debug)

  // =============================================
  // 3. OPTIMIZACIONES DE RENDIMIENTO
  // =============================================
  if (includePerformance) {
    const presets = {
      "Ultra Bajo": { scale: "0.6", shadows: "0", traffic: "0.5", mirrors: "0", lod: "0.5", desc: "PCs muy bajos / integradas" },
      "Bajo": { scale: "0.75", shadows: "0", traffic: "0.7", mirrors: "1", lod: "0.8", desc: "GTX 750 / 4GB RAM" },
      "Medio": { scale: "0.85", shadows: "1", traffic: "1.0", mirrors: "1", lod: "1.0", desc: "GTX 1050 / 8GB RAM" },
      "Alto": { scale: "1.0", shadows: "2", traffic: "1.0", mirrors: "2", lod: "1.2", desc: "GTX 1660 / RTX 2060 / 16GB RAM" },
      "Ultra": { scale: "1.25", shadows: "3", traffic: "1.0", mirrors: "3", lod: "1.5", desc: "RTX 3070+ / 16GB RAM" },
      "Pro": { scale: "1.5", shadows: "4", traffic: "1.0", mirrors: "4", lod: "2.0", desc: "RTX 4090 / 32GB RAM" }
    };

    const preset = presets[level] || presets["Medio"];

    config.push(`// Nivel seleccionado: ${level} (${preset.desc})`);
    config.push(`uset r_scale_x "${preset.scale}"`);
    config.push(`uset r_scale_y "${preset.scale}"`);
    config.push(`uset r_shadow_quality "${preset.shadows}"`);
    config.push(`uset g_traffic "${preset.traffic}"`);
    config.push(`uset r_mirror_quality "${preset.mirrors}"`);
    config.push(`uset r_lod_switch_distance "${preset.lod}"`);
    config.push(`uset r_lod_switch_distance_traffic "${preset.lod}"`);

    // Optimizaciones comunes
    config.push('uset r_vsync "0"');
    config.push('uset r_color_correction "1"');
    config.push('uset r_full_resolution_corrections "0"');
    config.push('uset r_buffer_page_size "20"');
    config.push('uset g_max_convoy_size "128"');
  }

  // =============================================
  // 4. CÁMARA CERO
  // =============================================
  if (includeCamera) {
    config.push(`uset g_cam_buffer "${buffer}"`);
  }

  // =============================================
  // 5. VALORES SIEMPRE ACTIVADOS (tus prioridades)
  // =============================================
  config.push('');
  config.push('// === VALORES SIEMPRE ACTIVADOS POR MUNDOATS ===');
  config.push('uset g_developer "1"');          // Modo desarrollador activado
  config.push('uset g_console "1"');            // Consola activada (~)
  config.push('uset g_console_state "1"');      // Consola abierta al iniciar
  config.push('// Puedes cambiar console_state a "0" si prefieres que no abra sola');

  // =============================================
  // FIN
  // =============================================
  config.push('// ====== FIN DE AJUSTES MUNDOATS PRO ======');

  return config.join('\n');
};