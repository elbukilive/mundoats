<div className="bg-[#111] border border-gray-700 p-6 rounded-xl mb-6">

  <h2 className="mb-6 font-semibold text-lg">Activar Cámara Cero</h2>

  <div className="flex items-center justify-between flex-wrap gap-6">

    {/* IZQUIERDA: MODIFIERS */}
    <div className="flex items-center gap-6">

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={ctrl} onChange={() => setCtrl(!ctrl)} />
        CTRL
      </label>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={shift} onChange={() => setShift(!shift)} />
        SHIFT
      </label>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={alt} onChange={() => setAlt(!alt)} />
        ALT
      </label>

    </div>

    {/* DERECHA: INPUT + F9 */}
    <div className="flex items-center gap-6">

      {/* INPUT */}
      <input
        value={key === "f9" ? "f9" : key}
        onChange={(e) => {
          const val = e.target.value.slice(0,1).toLowerCase();
          if (val) setKey(val);
        }}
        disabled={key === "f9"}
        placeholder="Z"
        className={`w-24 h-12 text-center text-lg font-semibold 
        bg-black text-white 
        border rounded-lg outline-none
        transition-all duration-200

        ${key === "f9"
          ? "border-yellow-400 bg-[#1a1a1a] text-yellow-300 cursor-not-allowed"
          : "border-gray-600 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 focus:shadow-[0_0_10px_rgba(255,204,0,0.4)] hover:border-yellow-400/50"
        }`}
      />

      {/* CHECKBOX F9 */}
      <label className="flex items-center gap-2 cursor-pointer">

        <input
          type="checkbox"
          checked={key === "f9"}
          onChange={() => setKey("f9")}
        />

        <span
          className={`px-3 py-1 rounded border text-sm transition-all
          ${key === "f9"
            ? "bg-yellow-500 text-black border-yellow-400 shadow-[0_0_8px_rgba(255,204,0,0.6)]"
            : "border-gray-600 text-white"}
          `}
        >
          F9
        </span>

      </label>

    </div>

  </div>

</div>