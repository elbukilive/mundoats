{/* ===== TELEPORT ===== */}
<div className="bg-[#111] border border-gray-700 p-6 rounded-xl mb-6">

  <h2 className="mb-6 font-semibold text-lg">Teleport</h2>

  <div className="flex items-center justify-between flex-wrap gap-6">

    {/* MODIFIERS */}
    <div className="flex items-center gap-6">

      {/* CTRL */}
      <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all
        ${tpCtrl
          ? "border-yellow-400 bg-yellow-400/10 shadow-[0_0_10px_rgba(255,204,0,0.5)]"
          : "border-gray-600 hover:border-yellow-400/40"
        }`}>
        <input
          type="checkbox"
          checked={tpCtrl}
          onChange={() => setTpCtrl(!tpCtrl)}
          className="hidden"
        />
        CTRL
      </label>

      {/* SHIFT */}
      <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all
        ${tpShift
          ? "border-yellow-400 bg-yellow-400/10 shadow-[0_0_10px_rgba(255,204,0,0.5)]"
          : "border-gray-600 hover:border-yellow-400/40"
        }`}>
        <input
          type="checkbox"
          checked={tpShift}
          onChange={() => setTpShift(!tpShift)}
          className="hidden"
        />
        SHIFT
      </label>

      {/* ALT */}
      <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all
        ${tpAlt
          ? "border-yellow-400 bg-yellow-400/10 shadow-[0_0_10px_rgba(255,204,0,0.5)]"
          : "border-gray-600 hover:border-yellow-400/40"
        }`}>
        <input
          type="checkbox"
          checked={tpAlt}
          onChange={() => setTpAlt(!tpAlt)}
          className="hidden"
        />
        ALT
      </label>

      {/* F9 */}
      <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all
        ${tpUseF9
          ? "border-yellow-400 bg-yellow-400/10 shadow-[0_0_10px_rgba(255,204,0,0.5)]"
          : "border-gray-600 hover:border-yellow-400/40"
        }`}>
        <input
          type="checkbox"
          checked={tpUseF9}
          onChange={(e) => {
            const checked = e.target.checked;
            setTpUseF9(checked);
            setTpKey(checked ? "f9" : "");
          }}
          className="hidden"
        />
        F9
      </label>

    </div>

    {/* INPUT */}
    <input
      value={tpUseF9 ? "f9" : tpKey}
      onChange={(e) => setTpKey(e.target.value.slice(0,1))}
      disabled={tpUseF9}
      placeholder=""
      className={`w-24 h-14 text-center text-xl font-semibold 
      bg-black text-white 
      border rounded-lg outline-none
      transition-all duration-200
      ${tpUseF9
        ? "border-gray-800 opacity-40 cursor-not-allowed"
        : "border-gray-600 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 focus:shadow-[0_0_12px_rgba(255,204,0,0.4)] hover:border-yellow-400/50"
      }`}
    />

  </div>

</div>