import { PresetTruck } from "./types";

export const PRESET_TRUCKS: PresetTruck[] = [
  {
    name: "Tolva Liviana (Ej. 10m³)",
    A: 4.20,
    B: 2.30,
    C: 1.20,
    tablaB: 2.00,
    tablaD: 2.80,
    tablaE: 0.20,
    bPlus: 0.60,
    bMinus: 0.35,
    H: 1.10,
  },
  {
    name: "Tolva Pesada (Ej. 14m³)",
    A: 5.00,
    B: 2.80,
    C: 1.79,
    tablaB: 2.00,
    tablaD: 3.00,
    tablaE: 0.25,
    bPlus: 0.80,
    bMinus: 0.40,
    H: 1.50,
  },
  {
    name: "Mega Tolva Extragrande",
    A: 6.20,
    B: 3.00,
    C: 2.10,
    tablaB: 2.40,
    tablaD: 4.00,
    tablaE: 0.35,
    bPlus: 0.95,
    bMinus: 0.50,
    H: 1.80,
  },
  {
    name: "Sin Implementos (Limpio)",
    A: 4.00,
    B: 2.00,
    C: 1.00,
    tablaB: 0.00,
    tablaD: 0.00,
    tablaE: 0.00,
    bPlus: 0.00,
    bMinus: 0.00,
    H: 0.00,
  }
];

export const FORMULA_HELP = {
  tolva: "La capacidad de la tolva vacía se calcula simplemente multiplicando el Largo (A) por el Ancho (B) por el Alto (C), obteniendo el volumen geométrico interno sin factores divisorios de compactación.",
  tabla: "Determina el volumen adicional agregado mediante tablas o listones de madera de soporte suplementaria en la tolva lateral. Se calcula como Ancho (B) × Largo (D) × Espesor (E).",
  botella: "Representa el volumen que ocupa el cilindro de la botella del pistón hidráulico dentro de la tolva. Dado que es un espacio sólido inservible para la carga, se considera descontable. Se calcula usando la fórmula de un cono truncado/trapezoide regular promedio: ((B⁺ + B⁻) / 2) × H.",
  neto: "El volumen neto final utilizable es la suma de los volúmenes del sistema menos el volumen de la botella hidráulica: (V. Tolva + V. Tabla)."
};
