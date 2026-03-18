{/* MOVIMIENTO */}
<div className="bg-[#111] border border-gray-700 p-6 rounded-xl mb-6">

  <h2 className="mb-6 font-semibold text-lg">Movimiento Cámara</h2>

  {/* GRID PRINCIPAL */}
  <div className="grid grid-cols-2">

    {/* IZQUIERDA */}
    <div className="flex flex-col justify-start pt-6">

      {/* BOTONES ARRIBA ALINEADOS CON LEFT */}
      <div className="flex gap-4 mb-8">
        {["flechas","numpad","custom"].map(mode => (
          <button
            key={mode}
            onClick={()=>handleModeChange(mode)}
            className={`px-4 py-2 rounded-lg border ${movementMode===mode?"border-yellow-400 bg-yellow-400/10":"border-gray-600"}`}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* MODIFIERS SOLO CUSTOM (NO SE TOCA) */}
      {movementMode === "custom" && (
        <div className="flex gap-4">
          {["ctrl","shift","alt"].map(mod=>(
            <button
              key={mod}
              onClick={()=>updateDir(activeDir,{[mod]:!movementConfig[activeDir][mod]})}
              className={`px-4 py-2 rounded-lg border ${movementConfig[activeDir][mod]?"border-yellow-400 bg-yellow-400/10":"border-gray-600"}`}
            >
              {mod.toUpperCase()}
            </button>
          ))}
        </div>
      )}

    </div>

    {/* DERECHA */}
    <div className="flex justify-end items-start pr-10">

      {/* FLECHAS MÁS ARRIBA Y A LA DERECHA */}
      <div className="grid grid-cols-3 gap-4">

        <div></div>

        <button
          onClick={()=>setActiveDir("up")}
          className={`w-20 h-20 rounded-lg border ${activeDir==="up"?"border-yellow-400 bg-yellow-400/10":"border-gray-600 bg-black"}`}
        >
          {renderKey("up")}
        </button>

        <div></div>

        <button
          onClick={()=>setActiveDir("left")}
          className={`w-20 h-20 rounded-lg border ${activeDir==="left"?"border-yellow-400 bg-yellow-400/10":"border-gray-600 bg-black"}`}
        >
          {renderKey("left")}
        </button>

        <div></div>

        <button
          onClick={()=>setActiveDir("right")}
          className={`w-20 h-20 rounded-lg border ${activeDir==="right"?"border-yellow-400 bg-yellow-400/10":"border-gray-600 bg-black"}`}
        >
          {renderKey("right")}
        </button>

        <div></div>

        <button
          onClick={()=>setActiveDir("down")}
          className={`w-20 h-20 rounded-lg border ${activeDir==="down"?"border-yellow-400 bg-yellow-400/10":"border-gray-600 bg-black"}`}
        >
          {renderKey("down")}
        </button>

        <div></div>

      </div>

    </div>

  </div>

  {/* INPUT SOLO CUSTOM (NO SE TOCA) */}
  {movementMode === "custom" && (
    <div className="flex justify-center mt-6">
      <input
        ref={inputRef}
        value={buildInputValue()}
        onChange={(e)=>handleInputChange(e.target.value)}
        placeholder="CTRL+C"
        className="w-60 h-12 text-center bg-black border border-yellow-400 rounded-lg"
      />
    </div>
  )}

</div>