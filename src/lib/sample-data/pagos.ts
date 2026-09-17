/**
 * DATOS DE EJEMPLO -- reflejan public.pagos y public.programacion_pagos.
 */

export type MetodoPago = "transferencia" | "cheque" | "efectivo";
export type EstadoProgramacion = "programado" | "aprobado" | "rechazado" | "ejecutado" | "cancelado";

export const metodoPagoLabel: Record<MetodoPago, string> = {
  transferencia: "Transferencia",
  cheque: "Cheque",
  efectivo: "Efectivo",
};

export const estadoProgramacionLabel: Record<EstadoProgramacion, string> = {
  programado: "Programado",
  aprobado: "Aprobado",
  rechazado: "Rechazado",
  ejecutado: "Ejecutado",
  cancelado: "Cancelado",
};

export const cuentasBancariasEjemplo = [
  { id: "cta1", nombre: "Bancolombia — Corriente ‧‧1234", saldoActual: 42_600_000 },
  { id: "cta2", nombre: "BBVA — Corriente ‧‧5678", saldoActual: 18_150_000 },
  { id: "cta3", nombre: "Davivienda — Ahorros ‧‧9012", saldoActual: 6_400_000 },
];

export type Pago = {
  id: string;
  facturaId: string;
  facturaNumero: string;
  proveedorNombre: string;
  /** Opcionales: los abonos migrados del Excel solo traen un texto libre
   *  ("x bcolombia 12 junio/26"), sin fecha, metodo ni cuenta estructurados. */
  fechaPago?: string;
  montoPagado: number;
  metodoPago?: MetodoPago;
  cuentaBancaria?: string;
  referenciaBancaria?: string;
  registradoPor?: string;
  /** Como venia clasificado el abono en el Excel migrado. */
  tipoPago?: "abono" | "saldo_final_declarado" | "cuota_programada";
};

export type ProgramacionPago = {
  id: string;
  facturaId: string;
  facturaNumero: string;
  proveedorNombre: string;
  saldoFactura: number;
  fechaProgramada: string;
  montoProgramado: number;
  cuentaBancaria: string;
  estado: EstadoProgramacion;
  /** El Presidente puede aprobar por un valor menor al programado.
   *  Si esta vacio, se aprobo por el monto completo. */
  montoAprobado?: number;
  /** Comentario del Presidente al aprobar (obligatorio si aprueba menos). */
  observacionAprobacion?: string;
  aprobadoPor?: string;
  motivoRechazo?: string;
  creadoPor: string;
};

/** Lo que realmente se va a pagar: lo aprobado, o lo programado si aun no se toca. */
export function montoAPagar(p: ProgramacionPago) {
  return p.montoAprobado ?? p.montoProgramado;
}

function en(dias: number) {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
}
function hace(dias: number) {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  return d.toISOString().slice(0, 10);
}

export const pagosEjemplo: Pago[] = [
  {
    id: "pg1",
    facturaId: "f2",
    facturaNumero: "FE-4903",
    proveedorNombre: "Distribuidora Médica del Pacífico SAS",
    fechaPago: hace(5),
    montoPagado: 7_257_000,
    metodoPago: "transferencia",
    cuentaBancaria: "Bancolombia — Corriente ‧‧1234",
    referenciaBancaria: "TRX-88213",
    registradoPor: "Jhonatan Sandoval",
  },
  {
    id: "pg2",
    facturaId: "f3",
    facturaNumero: "CC-118",
    proveedorNombre: "Andrés Felipe Rojas Gómez",
    fechaPago: hace(15),
    montoPagado: 2_000_000,
    metodoPago: "transferencia",
    cuentaBancaria: "BBVA — Corriente ‧‧5678",
    registradoPor: "Jhonatan Sandoval",
  },
  {
    id: "pg3",
    facturaId: "f5",
    facturaNumero: "Cotiz-882",
    proveedorNombre: "Tecnimed Equipos SAS",
    fechaPago: hace(10),
    montoPagado: 10_000_000,
    metodoPago: "transferencia",
    cuentaBancaria: "Bancolombia — Corriente ‧‧1234",
    referenciaBancaria: "TRX-87950",
    registradoPor: "Jhonatan Sandoval",
  },
];

export const programacionesEjemplo: ProgramacionPago[] = [
  {
    id: "pr1",
    facturaId: "f1",
    facturaNumero: "FE-4821",
    proveedorNombre: "Distribuidora Médica del Pacífico SAS",
    saldoFactura: 17_902_500,
    fechaProgramada: en(2),
    montoProgramado: 17_902_500,
    cuentaBancaria: "Bancolombia — Corriente ‧‧1234",
    estado: "programado",
    creadoPor: "Jhonatan Sandoval",
  },
  {
    id: "pr2",
    facturaId: "f4",
    facturaNumero: "FEIQ-990",
    proveedorNombre: "Insumos Quirúrgicos Andina Ltda",
    saldoFactura: 12_572_900,
    fechaProgramada: en(4),
    montoProgramado: 12_572_900,
    cuentaBancaria: "BBVA — Corriente ‧‧5678",
    estado: "aprobado",
    creadoPor: "Jhonatan Sandoval",
  },
  {
    id: "pr3",
    facturaId: "f6",
    facturaNumero: "FSA-2231",
    proveedorNombre: "Suministros Andina de Colombia SAS",
    saldoFactura: 3_150_000,
    fechaProgramada: hace(1),
    montoProgramado: 3_150_000,
    cuentaBancaria: "Davivienda — Ahorros ‧‧9012",
    estado: "rechazado",
    motivoRechazo: "Falta soporte de recibido a satisfacción",
    creadoPor: "Jhonatan Sandoval",
  },
];
