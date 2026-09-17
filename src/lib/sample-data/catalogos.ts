/**
 * Catalogos de ejemplo -- reflejan las tablas parametricas reales
 * (ver supabase/migrations/0003_catalogos.sql). En producción estos
 * valores se editan desde Administración, no se tocan en código.
 */

export const categoriasGastoEjemplo = [
  "Insumos médicos",
  "Insumos no médicos",
  "Servicios generales",
  "Honorarios médicos",
  "Mantenimiento de equipos",
  "Administrativo",
];

export const tarifaIcaPorMilPorCiudad: Record<string, number> = {
  Cali: 10.0,
  "Bogotá D.C.": 6.9,
  Medellín: 7.0,
  Barranquilla: 8.0,
  Cartagena: 8.0,
  Palmira: 8.0,
  Yumbo: 10.0,
};

export type ConceptoRetencion = {
  id: string;
  nombre: string;
  porcentaje: number;
};

export const conceptosRetencionEjemplo: ConceptoRetencion[] = [
  { id: "ninguna", nombre: "Ninguna", porcentaje: 0 },
  { id: "compras", nombre: "Compras generales", porcentaje: 2.5 },
  { id: "serv_decl", nombre: "Servicios (declarante)", porcentaje: 4 },
  { id: "serv_no_decl", nombre: "Servicios (no declarante)", porcentaje: 6 },
  { id: "honorarios_juridica", nombre: "Honorarios (persona jurídica)", porcentaje: 11 },
  { id: "honorarios_natural", nombre: "Honorarios (persona natural declarante)", porcentaje: 10 },
  { id: "arrendamientos", nombre: "Arrendamientos", porcentaje: 3.5 },
];

export const ivaOpciones = [0, 5, 19];
