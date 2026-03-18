{/* ===== MOVIMIENTO ===== */}
<div className="bg-[#111] border border-gray-700 p-6 rounded-xl mb-6">

  <h2 className="mb-6 font-semibold text-lg">Movimiento Cámara</h2>

  {/* SELECTOR */}
  <div className="flex gap-4 mb-6">

    {["arrows","numpad","custom"].map(mode => (
      <button
        key={mode}
        onClick={() => {
          setMoveMode(mode);
          setMvCustom(mode === "custom");
        }}
        className={`px-4 py-2 rounded-lg border transition-all
        ${moveMode === mode
          ? "border-yellow-400 bg-yellow-400/10 shadow-[0_0_10px_rgba(255,204,0,0.4)]"
          : "border-gray-600 hover:border-yellow-400/40"
        }`}
      >
        {mode === "arrows" ? "Flechas" : mode === "numpad" ? "Numpad" : "Custom"}
      </button>
    ))}

  </div>

  {/* MODIFIERS */}
  <div className="flex gap-4 mb-6">

    {[
      { label: "CTRL", state: mvCtrl, set: setMvCtrl },
      { label: "SHIFT", state: mvShift, set: setMvShift },
      { label: "ALT", state: mvAlt, set: setMvAlt }
    ].map((item, i) => (
      <label
        key={i}
        className={`px-3 py-2 rounded-lg border cursor-pointer transition-all
        ${item.state
          ? "border-yellow-400 bg-yellow-400/10 shadow-[0_0_10px_rgba(255,204,0,0.4)]"
          : "border-gray-600 hover:border-yellow-400/40"
        }`}
      >
        <input
          type="checkbox"
          checked={item.state}
          onChange={() => item.set(!item.state)}
          className="hidden"
        />
        {item.label}
      </label>
    ))}

  </div>

  {/* GRID VISUAL */}
  <div className="flex justify-center">

    <div className="grid grid-cols-3 gap-3">

      {/* EMPTY */}
      <div></div>

      {/* UP */}
      <div className="w-16 h-16 flex items-center justify-center border border-gray-600 rounded-lg bg-black text-xl">
        ↑
      </div>

      <div></div>

      {/* LEFT */}
      <div className="w-16 h-16 flex items-center justify-center border border-gray-600 rounded-lg bg-black text-xl">
        ←
      </div>

      {/* EMPTY */}
      <div></div>

      {/* RIGHT */}
      <div className="w-16 h-16 flex items-center justify-center border border-gray-600 rounded-lg bg-black text-xl">
        →
      </div>

      <div></div>

      {/* DOWN */}
      <div className="w-16 h-16 flex items-center justify-center border border-gray-600 rounded-lg bg-black text-xl">
        ↓
      </div>

      <div></div>

    </div>

  </div>

  {/* CUSTOM INPUTS */}
  {mvCustom && (
    <div className="grid grid-cols-4 gap-4 mt-6">

      <input
        placeholder="UP"
        value={mvUp}
        onChange={(e)=>setMvUp(e.target.value)}
        className="bg-black border border-gray-600 rounded p-2 text-center"
      />

      <input
        placeholder="DOWN"
        value={mvDown}
        onChange={(e)=>setMvDown(e.target.value)}
        className="bg-black border border-gray-600 rounded p-2 text-center"
      />

      <input
        placeholder="LEFT"
        value={mvLeft}
        onChange={(e)=>setMvLeft(e.target.value)}
        className="bg-black border border-gray-600 rounded p-2 text-center"
      />

      <input
        placeholder="RIGHT"
        value={mvRight}
        onChange={(e)=>setMvRight(e.target.value)}
        className="bg-black border border-gray-600 rounded p-2 text-center"
      />

    </div>
  )}

</div>