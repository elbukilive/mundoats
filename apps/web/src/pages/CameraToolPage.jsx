<div className="bg-[#111] border border-gray-700 p-6 rounded-xl mb-6">

  <h2 className="mb-6 font-semibold text-lg">Activar Cámara Cero</h2>

  <div className="flex items-center justify-between flex-wrap gap-6">

    {/* CHECKBOXES */}
    <div className="flex gap-4">

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

    {/* INPUT + F9 */}
    <div className="flex flex-col items-center gap-4">

      {/* INPUT */}
      <input
        value={key === "f9" ? "" : key}
        onChange={(e) => {
          const val = e.target.value.slice(0,1).toLowerCase();
          setKey(val);
        }}
        placeholder="Z"
        disabled={key === "f9"}
        className={`w-24 h-14 text-center text-xl font-semibold 
        bg-black text-white 
        border rounded-lg outline-none
        transition-all duration-200

        ${key === "f9"
          ? "border-gray-800 opacity-40 cursor-not-allowed"
          : "border-gray-600 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 focus:shadow-[0_0_12px_rgba(255,204,0,0.4)] hover:border-yellow-400/50"
        }
        `}
      />

      {/* BOTÓN F9 */}
      <button
        onClick={() => setKey("f9")}
        className={`px-6 py-2 rounded-lg border text-sm transition-all duration-200

        ${key === "f9"
          ? "bg-yellow-500 text-black border-yellow-400 shadow-[0_0_10px_rgba(255,204,0,0.6)]"
          : "bg-[#111] border-gray-600 hover:border-yellow-400 hover:shadow-[0_0_8px_rgba(255,204,0,0.3)]"}
        `}
      >
        F9
      </button>

    </div>

  </div>

</div>