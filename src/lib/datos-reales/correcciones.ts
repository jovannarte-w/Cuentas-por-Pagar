/**
 * CORRECCIONES MANUALES -- confirmadas por Cenvalle, una por una.
 *
 * La migración del Excel solo contó como "pago" las filas propias tipo
 * ABONO/SALDO FINAL. Pero en varias facturas el pago quedó anotado
 * únicamente como texto en la columna OBSERVACIONES (ej. "x bcolombia 24
 * agosto 2026"), así que la migración las dejó con saldo pendiente aunque
 * ya estaban pagadas.
 *
 * Cada corrección de esta lista se aplicó porque el cliente la confirmó
 * explícitamente -- no se infiere automáticamente del texto libre del
 * Excel, para no adivinar mal.
 */

export type CorreccionPago = {
  facturaId: string;
  /** Monto que realmente se pagó (puede ser menor al total si fue parcial). */
  montoPagado: number;
  fechaPago?: string;
  motivo: string;
  confirmadoEn: string;
};

export const correccionesPago: CorreccionPago[] = [
  {
    facturaId: "FAC-00246", // LEONEL SANTOS TORRES — INVE-175
    montoPagado: 2_168_500,
    fechaPago: "2026-08-24",
    motivo:
      'Confirmado por Cenvalle: la factura quedó marcada "pendiente" en el Excel porque el pago solo se anotó como texto en Observaciones ("x bcolombia 24 agosto 2026"), nunca como fila de abono.',
    confirmadoEn: "2026-09-08",
  },
  {
    facturaId: "FAC-00292", // MAICOL HINESTROZA CAICEDO — CUT-2024-10-21C
    montoPagado: 6_000_000,
    fechaPago: "2024-10-24",
    motivo: 'Confirmado por Cenvalle: pagada. Observación del Excel: "x bcolombia 24 octubre/24".',
    confirmadoEn: "2026-09-08",
  },
  {
    facturaId: "FAC-00321", // MARIA TERESA RESTREPO BAÑOL — anticipo
    montoPagado: 5_000_000,
    fechaPago: "2025-09-12",
    motivo:
      'Confirmado por Cenvalle: pagada. Observación del Excel: "x bancolombia 12 septiembre/25".',
    confirmadoEn: "2026-09-08",
  },
  {
    facturaId: "FAC-00312", // YURY RICARDO DIAZ HERNANDEZ — CC-01
    montoPagado: 4_450_000,
    fechaPago: "2026-02-02",
    motivo: 'Confirmado por Cenvalle: pagada. Observación del Excel: "x bcolombia 2 febrero/26".',
    confirmadoEn: "2026-09-08",
  },
  {
    facturaId: "FAC-00026", // MIGUEL ANGEL UNIGARRO (ALACER) — cotizacion
    // Ya tenía $173.000 pagados desde la migración original (ajuste ya
    // confirmado antes); el cliente confirmó ahora que el total de
    // $3.332.000 quedó pagado, así que se completa el saldo restante.
    montoPagado: 3_159_000,
    fechaPago: "2026-08-13",
    motivo:
      'Confirmado por Cenvalle: el total ($3.332.000) está pagado. Ya tenía $173.000 registrados de un ajuste anterior; se completa el saldo restante ($3.159.000). Observación del Excel: "x bancolombia 13 agosto/26".',
    confirmadoEn: "2026-09-08",
  },
  {
    facturaId: "FAC-00038", // RP MEDICAS — ANTICIPO
    montoPagado: 1_920_000,
    fechaPago: "2026-07-14",
    motivo: 'Confirmado por Cenvalle: pagada. Observación del Excel: "x bcolombia 14 julio 2026".',
    confirmadoEn: "2026-09-08",
  },
  {
    facturaId: "FAC-00144", // LUIS HERNAN CAMPAZ CALLE — anticipo
    montoPagado: 911_834,
    fechaPago: "2026-09-03",
    motivo:
      'Confirmado por Cenvalle: pagada. Observación del Excel: "x bcolombia 03 septiembre 2026".',
    confirmadoEn: "2026-09-08",
  },
  {
    facturaId: "FAC-00141", // OSCAR FERNANDO ARAGON MERA — ANTICIPO
    montoPagado: 500_000,
    fechaPago: "2025-04-05",
    motivo: 'Confirmado por Cenvalle: pagada. Observación del Excel: "x bcolombia 5 abril/25".',
    confirmadoEn: "2026-09-08",
  },
  // RED DE SALUD DEL CENTRO ESE — 4 facturas pagadas juntas en una sola
  // transferencia (misma observación en las 4: "x bcolombia 01 septiembre 2026").
  {
    facturaId: "FAC-00173", // REDC-960477
    montoPagado: 165_300,
    fechaPago: "2026-09-01",
    motivo:
      'Confirmado por Cenvalle: pagada junto con REDC-960480, REDC-983782 y REDC-983789 en una sola transferencia. Observación del Excel: "x bcolombia 01 septiembre 2026".',
    confirmadoEn: "2026-09-08",
  },
  {
    facturaId: "FAC-00174", // REDC-960480
    montoPagado: 294_000,
    fechaPago: "2026-09-01",
    motivo:
      'Confirmado por Cenvalle: pagada junto con REDC-960477, REDC-983782 y REDC-983789 en una sola transferencia. Observación del Excel: "x bcolombia 01 septiembre 2026".',
    confirmadoEn: "2026-09-08",
  },
  {
    facturaId: "FAC-00175", // REDC-983782
    montoPagado: 588_000,
    fechaPago: "2026-09-01",
    motivo:
      'Confirmado por Cenvalle: pagada junto con REDC-960477, REDC-960480 y REDC-983789 en una sola transferencia. Observación del Excel: "x bcolombia 01 septiembre 2026".',
    confirmadoEn: "2026-09-08",
  },
  {
    facturaId: "FAC-00176", // REDC-983789
    montoPagado: 110_200,
    fechaPago: "2026-09-01",
    motivo:
      'Confirmado por Cenvalle: pagada junto con REDC-960477, REDC-960480 y REDC-983782 en una sola transferencia. Observación del Excel: "x bcolombia 01 septiembre 2026".',
    confirmadoEn: "2026-09-08",
  },
  // VANESSA SALOME CAMACHO — 2 cuentas de cobro pagadas juntas.
  {
    facturaId: "FAC-00252", // CC-01-2026
    montoPagado: 437_760,
    fechaPago: "2026-05-20",
    motivo:
      'Confirmado por Cenvalle: pagada junto con CC-02-2026 en una sola transferencia. Observación del Excel: "x bcolombia 20 mayo 2026".',
    confirmadoEn: "2026-09-08",
  },
  {
    facturaId: "FAC-00253", // CC-02-2026
    montoPagado: 437_760,
    fechaPago: "2026-05-20",
    motivo:
      'Confirmado por Cenvalle: pagada junto con CC-01-2026 en una sola transferencia. Observación del Excel: "x bcolombia 20 mayo 2026".',
    confirmadoEn: "2026-09-08",
  },
];

export type ExclusionFactura = {
  facturaId: string;
  motivo: string;
  confirmadoEn: string;
};

/**
 * Filas que la migración trajo como "factura" pero que Cenvalle confirmó que
 * NO son una cuenta por pagar a proveedor -- se excluyen por completo del
 * módulo de Facturas (no cuentan en ningún total).
 */
export const exclusionesFacturas: ExclusionFactura[] = [
  {
    facturaId: "FAC-00317", // CARLOS JORGE LEONARDO CONTRERAS PARADA — "4000000" (junio)
    motivo:
      'Confirmado por Cenvalle: no es una factura de proveedor. El detalle decía "AHORRO VOLUNTARIO JUNIO/26 BBVA AFC 858110760" -- es un aporte a un fondo de ahorro (AFC), una fila de tesorería personal que quedó mezclada por error en la hoja de Cuentas por Pagar del Excel.',
    confirmadoEn: "2026-09-08",
  },
  {
    facturaId: "FAC-00318", // CARLOS JORGE LEONARDO CONTRERAS PARADA — "4000000" (julio)
    motivo:
      'Confirmado por Cenvalle: mismo caso que FAC-00317. "AHORRO VOLUNTARIO JULIO/26 BBVA AFC 858110760" -- aporte al mismo fondo de ahorro (AFC), no es una factura de proveedor.',
    confirmadoEn: "2026-09-08",
  },
  {
    facturaId: "FAC-00319", // CARLOS JORGE LEONARDO CONTRERAS PARADA — "4000000" (agosto)
    motivo:
      'Confirmado por Cenvalle: mismo caso que FAC-00317 y FAC-00318. "AHORRO VOLUNTARIO AGOSTO/26 BBVA AFC 858110760" -- aporte al mismo fondo de ahorro (AFC), no es una factura de proveedor.',
    confirmadoEn: "2026-09-08",
  },
];
