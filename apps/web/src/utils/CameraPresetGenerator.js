export function generateControls(originalText) {

  // 🔥 configs que quieres aplicar
  const controlsToApply = [
    {
      key: "camera_zero",
      value: "(keyboard.lctrl?0 | keyboard.rctrl?0) & (keyboard.lshift?0 | keyboard.rshift?0) & keyboard.z?0"
    },
    {
      key: "cam_rotate",
      value: "mouse.x"
    }
  ];

  let updatedText = originalText;

  controlsToApply.forEach(control => {
    const regex = new RegExp(`mix\\s+${control.key}\\s+\`.*?\``);

    const newLine = `mix ${control.key} \`${control.value}\``;

    if (regex.test(updatedText)) {
      // 🔁 reemplaza si ya existe
      updatedText = updatedText.replace(regex, newLine);
    } else {
      // ➕ agrega si no existe
      updatedText += `\n${newLine}`;
    }
  });

  return updatedText;
}