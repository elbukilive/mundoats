export const generateConfig = (level, options, buffer) => {

  const { includePerformance, includeCamera } = options;

  let config = [];

  // =========================
  // 🔥 PERFORMANCE BASE
  // =========================
  if (includePerformance) {

    if (level === "Bajo") {
      config.push('uset r_scale_x "0.75"');
      config.push('uset r_scale_y "0.75"');
      config.push('uset r_shadow_quality "0"');
    }

    if (level === "Medio") {
      config.push('uset r_scale_x "0.85"');
      config.push('uset r_scale_y "0.85"');
      config.push('uset r_shadow_quality "1"');
    }

    if (level === "Alto") {
      config.push('uset r_scale_x "1.0"');
      config.push('uset r_scale_y "1.0"');
      config.push('uset r_shadow_quality "2"');
    }

    if (level === "Ultra" || level === "Pro") {
      config.push('uset r_scale_x "1.25"');
      config.push('uset r_scale_y "1.25"');
      config.push('uset r_shadow_quality "3"');
    }

    // =========================
    // ⚡ FPS BOOST REAL
    // =========================
    config.push('uset r_vsync "0"');
    config.push('uset r_full_resolution_corrections "0"');
    config.push('uset r_color_correction "1"');

    // =========================
    // 🧠 CPU / MULTICORE
    // =========================
    config.push('uset r_multimon_mode "0"');
    config.push('uset r_buffer_page_size "20"');

    // =========================
    // 🚛 TRÁFICO (LAG CONTROL)
    // =========================
    config.push('uset g_traffic "1.0"');
    config.push('uset g_traffic_density "1.0"');

    // =========================
    // 🪞 MIRRORS OPTIMIZADOS
    // =========================
    config.push('uset r_mirror_quality "1"');
    config.push('uset r_mirror_view_distance "80"');

    // =========================
    // 🌎 LOD / DISTANCIA
    // =========================
    config.push('uset r_lod_switch_distance "1.0"');
    config.push('uset r_lod_switch_distance_traffic "1.0"');

    // =========================
    // 🎮 DEV + DEBUG
    // =========================
    config.push('uset g_console "1"');
    config.push('uset g_console_state "1"');
    config.push('uset g_developer "1"');
    config.push('uset g_fps "1"');

    // =========================
    // 🌐 CONVOY 128
    // =========================
    config.push('uset g_max_convoy_size "128"');

    // =========================
    // 🔌 CONEXIÓN ESTABLE
    // =========================
    config.push('uset g_client_connect_timeout "60"');
    config.push('uset g_server_connect_timeout "60"');
  }

  // =========================
  // 📷 CAMERA
  // =========================
  if (includeCamera) {
    config.push(`uset g_cam_buffer "${buffer}"`);
  }

  // =========================
  // 📦 OUTPUT FINAL
  // =========================
  return [
    '// ====== GENERADO POR MUNDOATS PRO ======',
    ...config,
    '// ====== FIN ======'
  ].join('\n');
};