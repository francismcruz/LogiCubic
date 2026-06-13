import React, { useState } from "react";

interface TruckVisualizerProps {
  A: number;
  B: number;
  C: number;
  tablaB: number;
  tablaD: number;
  tablaE: number;
  bPlus: number;
  bMinus: number;
  H: number;
  activeInput: string | null;
  theme?: "dark" | "light";
}

export function TruckVisualizer({
  A,
  B,
  C,
  tablaB,
  tablaD,
  tablaE,
  bPlus,
  bMinus,
  H,
  activeInput,
  theme = "dark",
}: TruckVisualizerProps) {
  const [activeTab, setActiveTab] = useState<"side" | "cross">("side");

  const totalVolume = (A * B * C) / 1.4;
  const boardVolume = tablaB * tablaD * tablaE;
  const bottleVolume = ((bPlus + bMinus) / 2) * H;
  const netVolume = totalVolume + boardVolume; // mathematically the net calculation as given by user

  // Highlight classes based on active inputs
  const getHighlightClass = (sections: string[]) => {
    if (!activeInput) {
      return theme === "light"
        ? "stroke-slate-400 fill-slate-200/50"
        : "stroke-slate-500/60 fill-slate-800/10";
    }
    return sections.includes(activeInput)
      ? theme === "light"
        ? "stroke-yellow-600 stroke-[2.5px] fill-yellow-100/30"
        : "stroke-yellow-400 stroke-[2.5px] drop-shadow-[0_0_8px_rgba(252,196,25,0.4)]"
      : theme === "light"
        ? "stroke-slate-300 fill-slate-100 opacity-20"
        : "stroke-slate-600/40 fill-slate-800/5 opacity-40";
  };

  const getArrowHighlightClass = (sections: string[]) => {
    if (!activeInput) {
      return theme === "light" ? "stroke-indigo-600 fill-indigo-600" : "stroke-[#fcc419] fill-[#fcc419]";
    }
    return sections.includes(activeInput)
      ? theme === "light"
        ? "stroke-yellow-600 fill-yellow-600 stroke-[3.3px]"
        : "stroke-yellow-300 fill-yellow-300 stroke-[3px] text-yellow-300 scale-102"
      : theme === "light"
        ? "stroke-slate-300 fill-slate-300 opacity-20"
        : "stroke-slate-600 fill-slate-600 opacity-20";
  };

  const getTextHighlightClass = (sections: string[]) => {
    if (!activeInput) {
      return theme === "light" ? "fill-slate-700 font-semibold" : "fill-slate-300";
    }
    return sections.includes(activeInput)
      ? theme === "light"
        ? "fill-yellow-700 font-extrabold"
        : "fill-yellow-400 font-bold"
      : theme === "light"
        ? "fill-slate-300 opacity-20"
        : "fill-slate-500 opacity-25";
  };

  return (
    <div className={`${theme === "light" ? "bg-white border-slate-200" : "bg-[#1f2942] border-gray-700/50"} rounded-xl border p-4 shadow-md space-y-3`}>
      <div className="flex justify-between items-center">
        <h3 className={`text-xs font-bold tracking-wider ${theme === "light" ? "text-amber-600" : "text-[#fcc419]"} uppercase flex items-center gap-1.5`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Vista Esquemática de Medidas
        </h3>
        <div className={`flex ${theme === "light" ? "bg-slate-100 border-slate-200" : "bg-[#111827] border-slate-800"} p-0.5 rounded-lg border`}>
          <button
            onClick={() => setActiveTab("side")}
            className={`text-[10px] px-2.5 py-1 rounded font-bold transition-all cursor-pointer ${
              activeTab === "side"
                ? "bg-[#fcc419] text-slate-950 shadow"
                : theme === "light"
                  ? "text-slate-600 hover:text-slate-900"
                  : "text-slate-400 hover:text-white"
            }`}
          >
            Perfil Tolva
          </button>
          <button
            onClick={() => setActiveTab("cross")}
            className={`text-[10px] px-2.5 py-1 rounded font-bold transition-all cursor-pointer ${
              activeTab === "cross"
                ? "bg-[#fcc419] text-slate-950 shadow"
                : theme === "light"
                  ? "text-slate-600 hover:text-slate-900"
                  : "text-slate-400 hover:text-white"
            }`}
          >
            Cilindro Botella
          </button>
        </div>
      </div>

      <div className={`rounded-lg p-2 flex items-center justify-center relative overflow-hidden border ${theme === "light" ? "bg-slate-100/50 border-slate-200" : "bg-[#111827] border-slate-800/85"}`} style={{ minHeight: "220px" }}>
        {activeTab === "side" ? (
          /* Profile view of the truck and boards */
          <svg viewBox="0 0 400 200" className="w-full max-w-[340px] h-auto transition-all duration-300">
            {/* Ground line */}
            <line x1="10" y1="165" x2="390" y2="165" stroke={theme === "light" ? "#94a3b8" : "#374151"} strokeWidth="1" strokeDasharray="3 3" />

            {/* Background chassis shadow */}
            <rect x="25" y="145" width="280" height="15" fill={theme === "light" ? "#64748b" : "#1f2937"} rx="3" opacity="0.15" id="rectChassisShadow" />

            {/* Truck Cab Outline */}
            <path
              d="M 20 150 L 20 115 A 8 8 0 0 1 28 107 L 50 107 A 15 15 0 0 1 65 120 L 72 153 L 70 155 Z"
              fill="none"
              stroke={theme === "light" ? "#64748b" : "#4b5563"}
              strokeWidth="2"
              className="opacity-40"
              id="pathCab"
            />
            <rect x="26" y="115" width="22" height="18" fill="none" stroke={theme === "light" ? "#64748b" : "#4b5563"} strokeWidth="1.5" rx="1.5" className="opacity-40" id="rectWindow" />
            <circle cx="45" cy="165" r="14" fill={theme === "light" ? "#f1f5f9" : "#0f172a"} stroke={theme === "light" ? "#64748b" : "#4b5563"} strokeWidth="2.5" id="circleWheel1" />
            <circle cx="45" cy="165" r="4" fill={theme === "light" ? "#64748b" : "#4b5563"} id="circleWheel1Hub" />

            {/* Rear wheels */}
            <circle cx="160" cy="165" r="14" fill={theme === "light" ? "#f1f5f9" : "#0f172a"} stroke={theme === "light" ? "#64748b" : "#4b5563"} strokeWidth="2.5" id="circleWheel2" />
            <circle cx="160" cy="165" r="4" fill={theme === "light" ? "#64748b" : "#4b5563"} id="circleWheel2Hub" />

            <circle cx="195" cy="165" r="14" fill={theme === "light" ? "#f1f5f9" : "#0f172a"} stroke={theme === "light" ? "#64748b" : "#4b5563"} strokeWidth="2.5" id="circleWheel3" />
            <circle cx="195" cy="165" r="4" fill={theme === "light" ? "#64748b" : "#4b5563"} id="circleWheel3Hub" />

            {/* Hydraulic bottle indicator inside hopper or under hopper front */}
            <g className="transition-all duration-300" id="groupBottleIndicator">
              {/* Bottle silhouette */}
              <line
                x1="100"
                y1="140"
                x2="105"
                y2="75"
                className={getHighlightClass(["bPlus", "bMinus", "H"])}
                strokeWidth="10"
                strokeLinecap="round"
              />
              <line
                x1="100"
                y1="140"
                x2="105"
                y2="75"
                stroke={theme === "light" ? "#334155" : "#d1d5db"}
                className={getHighlightClass(["bPlus", "bMinus", "H"])}
                strokeWidth="4"
              />
              {/* Descontable water drops / bottle label */}
              <text x="117" y="115" className={`text-[9px] ${theme === "light" ? "fill-amber-800 font-extrabold" : "fill-amber-400"} font-mono`} id="textBotellaLabel">
                Botella
              </text>
            </g>

            {/* Truck Chassis Beam */}
            <line x1="55" y1="150" x2="350" y2="150" stroke={theme === "light" ? "#64748b" : "#4b5563"} strokeWidth="5" strokeLinecap="round" className="opacity-40" />

            {/* HOPPER (TOLVA) POLYGON */}
            {/* Based on coordinates to resemble a real mining dumper box */}
            <polygon
              points="100,140 330,140 345,65 110,65"
              fill={theme === "light" ? "rgba(148, 163, 184, 0.2)" : "rgba(31, 41, 55, 0.4)"}
              strokeWidth="2.5"
              className={`transition-all duration-300 ${getHighlightClass(["A", "B", "C"])}`}
              id="polyHopper"
            />

            {/* ADITIONAL WOODEN BOARD (TABLA) */}
            {/* Usually represented sitting on top of the hopper walls */}
            <rect
              x="108"
              y="53"
              width="235"
              height="12"
              rx="1.5"
              fill={theme === "light" ? "rgba(180, 83, 9, 0.2)" : "rgba(245, 158, 11, 0.15)"}
              strokeWidth="2"
              className={`transition-all duration-300 ${getHighlightClass(["tablaB", "tablaD", "tablaE"])}`}
              id="rectBoard"
            />
            {/* Wood fiber texture lines on board */}
            <line x1="120" y1="59" x2="160" y2="59" stroke={theme === "light" ? "#b45309" : "#b45309"} strokeWidth="0.8" opacity="0.3" />
            <line x1="280" y1="59" x2="310" y2="59" stroke={theme === "light" ? "#b45309" : "#b45309"} strokeWidth="0.8" opacity="0.3" />

            {/* MEASUREMENT DIMENSION ANNOTATIONS */}
            {/* A - Largo arrow */}
            <g className="transition-all duration-300" id="groupA">
              <line
                x1="100"
                y1="147"
                x2="330"
                y2="147"
                className={getArrowHighlightClass(["A"])}
                strokeWidth="1.5"
                markerEnd="url(#arrow)"
                markerStart="url(#arrow-start)"
              />
              <text x="215" y="143" textAnchor="middle" className={`text-[10px] font-mono ${getTextHighlightClass(["A"])}`}>
                A (Largo): {A > 0 ? `${A.toFixed(2)}m` : "--"}
              </text>
            </g>

            {/* C - Alto arrow */}
            <g className="transition-all duration-300" id="groupC">
              <line
                x1="352"
                y1="65"
                x2="352"
                y2="140"
                className={getArrowHighlightClass(["C"])}
                strokeWidth="1.5"
                markerEnd="url(#arrow)"
                markerStart="url(#arrow-start)"
              />
              <text x="360" y="105" textAnchor="start" className={`text-[10px] font-mono ${getTextHighlightClass(["C"])}`}>
                C (Alto): {C > 0 ? `${C.toFixed(2)}m` : "--"}
              </text>
            </g>

            {/* B - Ancho representing depth/width indicator */}
            <g className="transition-all duration-300 font-mono" id="groupB">
              {/* Representing visual depth box */}
              <line
                x1="330"
                y1="140"
                x2="345"
                y2="128"
                className={getArrowHighlightClass(["B"])}
                strokeWidth="1.5"
                markerEnd="url(#arrow)"
              />
              <text x="350" y="137" className={`text-[9px] ${getTextHighlightClass(["B"])}`}>
                B (Ancho): {B > 0 ? `${B.toFixed(2)}m` : "--"}
              </text>
            </g>

            {/* Tabla Dimensions indicators */}
            <g className="transition-all duration-300" id="groupTabla">
              <text
                x="225"
                y="45"
                textAnchor="middle"
                className={`text-[9px] font-mono ${getTextHighlightClass(["tablaB", "tablaD", "tablaE"])}`}
              >
                Tabla: {tablaD.toFixed(1)}m × {tablaB.toFixed(1)}m × {tablaE.toFixed(2)}m
              </text>
            </g>

            {/* Core definitions */}
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" />
              </marker>
              <marker id="arrow-start" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 10 0 L 0 5 L 10 10 z" />
              </marker>
            </defs>
          </svg>
        ) : (
          /* Detailed schematic cross-section of the hydraulic cylinder "Botella" */
          <svg viewBox="0 0 400 200" className="w-full max-w-[340px] h-auto transition-all duration-300">
            {/* Center Axis */}
            <line x1="200" y1="15" x2="200" y2="185" stroke={theme === "light" ? "#cbd5e1" : "#374151"} strokeWidth="1" strokeDasharray="4 4" />

            {/* Hydraulic Cylinder body - stylized as truncated cone based on B+ (max width) and B- (min width) */}
            {/* The base of cylinder usually narrower (or vice versa), represented clearly */}
            <polygon
              points="140,25 260,25 230,165 170,165"
              fill={theme === "light" ? "rgba(37, 99, 235, 0.15)" : "rgba(59, 130, 246, 0.1)"}
              strokeWidth="2.5"
              className={`transition-all duration-300 ${getHighlightClass(["bPlus", "bMinus", "H"])}`}
              id="polyCylinder"
            />

            {/* Piston Rod coming from bottom inside */}
            <rect
              x="185"
              y="160"
              width="30"
              height="25"
              rx="2"
              fill={theme === "light" ? "#94a3b8" : "#d1d5db"}
              className="opacity-50"
              id="rectPistonRod"
            />

            {/* B+ (Max Base / Top Base) Arrow */}
            <g className="transition-all duration-300" id="groupBPlus">
              <line
                x1="140"
                y1="17"
                x2="260"
                y2="17"
                className={getArrowHighlightClass(["bPlus"])}
                strokeWidth="1.5"
                markerEnd="url(#arrow)"
                markerStart="url(#arrow-start)"
              />
              <text x="200" y="12" textAnchor="middle" className={`text-[10px] font-mono ${getTextHighlightClass(["bPlus"])}`}>
                B⁺ (Máx): {bPlus > 0 ? `${bPlus.toFixed(2)}m` : "--"}
              </text>
            </g>

            {/* B- (Min Base / Bottom interface) Arrow */}
            <g className="transition-all duration-300" id="groupBMinus">
              <line
                x1="170"
                y1="171"
                x2="230"
                y2="171"
                className={getArrowHighlightClass(["bMinus"])}
                strokeWidth="1.5"
                markerEnd="url(#arrow)"
                markerStart="url(#arrow-start)"
              />
              <text x="200" y="184" textAnchor="middle" className={`text-[10px] font-mono ${getTextHighlightClass(["bMinus"])}`}>
                B⁻ (Mín): {bMinus > 0 ? `${bMinus.toFixed(2)}m` : "--"}
              </text>
            </g>

            {/* H (Altura) Arrow */}
            <g className="transition-all duration-300" id="groupH">
              <line
                x1="275"
                y1="25"
                x2="275"
                y2="165"
                className={getArrowHighlightClass(["H"])}
                strokeWidth="1.5"
                markerEnd="url(#arrow)"
                markerStart="url(#arrow-start)"
              />
              <text x="282" y="95" textAnchor="start" className={`text-[10px] font-mono ${getTextHighlightClass(["H"])}`}>
                H (Altura Botella): {H > 0 ? `${H.toFixed(2)}m` : "--"}
              </text>
            </g>

            {/* Highlighted text calculation */}
            <text x="20" y="100" className={`text-[10px] ${theme === "light" ? "fill-slate-600" : "fill-slate-400"} font-mono`} id="textMathFormula">
              {(bPlus + bMinus) > 0 && H > 0 ? (
                <>
                  <tspan x="20" dy="0">Fórmula:</tspan>
                  <tspan x="20" dy="14" className={`${theme === "light" ? "fill-amber-700" : "fill-amber-400"} font-bold`}>((B⁺ + B⁻)/2) × H</tspan>
                  <tspan x="20" dy="14">Vol: {bottleVolume.toFixed(2)} m³</tspan>
                </>
              ) : (
                <>
                  <tspan x="20" dy="0">Fórmula Botella:</tspan>
                  <tspan x="20" dy="14">((B⁺ + B⁻)/2) × H</tspan>
                </>
              )}
            </text>

            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" />
              </marker>
              <marker id="arrow-start" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 10 0 L 0 5 L 10 10 z" />
              </marker>
            </defs>
          </svg>
        )}
      </div>

      {/* Quick guide of the cubic math context */}
      <div className={`grid grid-cols-2 gap-2 text-[10px] ${theme === "light" ? "text-slate-600 bg-slate-100" : "text-gray-400 bg-slate-900/40"} p-2 rounded-lg`}>
        <div className="flex flex-col">
          <span className={`font-semibold ${theme === "light" ? "text-amber-700" : "text-[#fcc419]"} uppercase`}>Volumen Tolva</span>
          <span>Largo × Ancho × Alto (Geométrico)</span>
        </div>
        <div className="flex flex-col border-l border-gray-800 pl-2">
          <span className={`font-semibold ${theme === "light" ? "text-emerald-700" : "text-emerald-400"} uppercase`}>Vol. Neto Cubicaje</span>
          <span>Suma Bruta - Vol. Botella</span>
        </div>
      </div>
    </div>
  );
}
