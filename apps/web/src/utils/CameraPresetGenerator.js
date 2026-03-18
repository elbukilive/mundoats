// src/utils/CameraPresetGenerator.js

export const generateCameraControls = (inputText, mode = "arrows") => {
  try {
    if (!inputText.includes("input_config")) {
      throw new Error("Archivo inválido: no es controls.sii");
    }

    // 🔥 MODOS
    const controls =
      mode === "wasd"
        ? {
            forward: "keyboard.w?0",
            back: "keyboard.s?0",
            left: "keyboard.a?0",
            right: "keyboard.d?0",
          }
        : {
            forward: "keyboard.uarrow?0",
            back: "keyboard.darrow?0",
            left: "keyboard.larrow?0",
            right: "keyboard.rarrow?0",
          };

    let output = inputText;

    // 🔥 REEMPLAZAR CONTROLES DE CAMERA ZERO (dbg*)
    output = output
      .replace(/mix dbgfwd `.*?`/, `mix dbgfwd \`${controls.forward}\``)
      .replace(/mix dbgback `.*?`/, `mix dbgback \`${controls.back}\``)
      .replace(/mix dbgleft `.*?`/, `mix dbgleft \`${controls.left}\``)
      .replace(/mix dbgright `.*?`/, `mix dbgright \`${controls.right}\``);

    return output;
  } catch (error) {
    return "ERROR: " + error.message;
  }
};