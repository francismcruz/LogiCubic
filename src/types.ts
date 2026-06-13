export interface CubicajeRecord {
  id: string;
  placa: string;
  cubicador?: string;
  chofer?: string;
  empresa?: string;
  empresaTransporte?: string;
  proyecto?: string;
  fecha: string; // ISO string
  A: number; // Largo de tolva
  B: number; // Ancho de tolva
  C: number; // Alto de tolva
  volTolva: number;
  
  tablaB: number; // Ancho de tabla
  tablaD: number; // Largo de tabla
  tablaE: number; // Espesor de tabla
  volTabla: number;
  
  bPlus: number; // Base Máx Botella
  bMinus: number; // Base Mín Botella
  H: number; // Altura Botella
  volBotella: number;
  
  sumaTotal: number; // Suma Bruta
  volNeto: number; // Volumen Neto (Cubicaje)
  foto?: string;  // base64 string
  userEmail?: string;
  userId?: string;
}

export interface PresetTruck {
  name: string;
  A: number;
  B: number;
  C: number;
  tablaB: number;
  tablaD: number;
  tablaE: number;
  bPlus: number;
  bMinus: number;
  H: number;
}
