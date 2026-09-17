/**
 * DATOS DE EJEMPLO -- reemplazar por la tabla public.facturas (vista
 * v_facturas_saldo para los campos calculados) cuando se conecte Supabase.
 */

export type TipoDocumentoFactura =
  | "factura"
  | "cuenta_cobro"
  | "cotizacion_anticipo"
  | "sin_numero"
  | "otro";

export const tipoDocumentoLabel: Record<TipoDocumentoFactura, string> = {
  factura: "Factura",
  cuenta_cobro: "Cuenta de cobro",
  cotizacion_anticipo: "Cotización / anticipo",
  sin_numero: "Sin número",
  otro: "Otro",
};

export type Factura = {
  id: string;
  proveedorId: string;
  proveedorNombre: string;
  numeroFactura?: string;
  tipoDocumento: TipoDocumentoFactura;
  /** El Excel original no tenia columna de categoria: queda por clasificar. */
  categoria?: string;
  /** Opcionales: 120 filas del Excel vigente no traen fecha. */
  fechaRecibo?: string;
  fechaVencimiento?: string;
  detalle?: string;
  valorSubtotal: number;
  ivaValor: number;
  reteFuenteValor: number;
  reteIcaValor: number;
  totalFactura: number;
  totalPagado: number;
  anulada: boolean;
  /** Notas heredadas de la columna OBSERVACIONES del Excel. */
  observaciones?: string;
  /** Fila del Excel original de la que salio, para poder auditar la migracion. */
  filaOrigen?: number;
};

export function saldoPendiente(f: Factura) {
  return f.totalFactura - f.totalPagado;
}

export function estadoFactura(f: Factura): "pendiente" | "parcial" | "pagada" | "anulada" {
  if (f.anulada) return "anulada";
  const saldo = saldoPendiente(f);
  if (saldo <= 0) return "pagada";
  if (f.totalPagado > 0) return "parcial";
  return "pendiente";
}

/** null cuando la factura no tiene fecha de vencimiento registrada. */
export function diasVencimiento(f: Factura): number | null {
  if (!f.fechaVencimiento) return null;
  const hoy = new Date();
  const venc = new Date(f.fechaVencimiento);
  return Math.round((venc.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
}

function hace(dias: number) {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  return d.toISOString().slice(0, 10);
}
function en(dias: number) {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
}

export const facturasEjemplo: Factura[] = [
  {
    id: "f1",
    proveedorId: "p1",
    proveedorNombre: "Distribuidora Médica del Pacífico SAS",
    numeroFactura: "FE-4821",
    tipoDocumento: "factura",
    categoria: "Insumos médicos",
    fechaRecibo: hace(72),
    fechaVencimiento: hace(12),
    detalle: "Insumos de endoscopia — pedido mensual",
    valorSubtotal: 15_500_000,
    ivaValor: 2_945_000,
    reteFuenteValor: 387_500,
    reteIcaValor: 155_000,
    totalFactura: 17_902_500,
    totalPagado: 0,
    anulada: false,
  },
  {
    id: "f2",
    proveedorId: "p1",
    proveedorNombre: "Distribuidora Médica del Pacífico SAS",
    numeroFactura: "FE-4903",
    tipoDocumento: "factura",
    categoria: "Insumos médicos",
    fechaRecibo: hace(50),
    fechaVencimiento: en(9),
    valorSubtotal: 6_150_000,
    ivaValor: 1_168_500,
    reteFuenteValor: 0,
    reteIcaValor: 61_500,
    totalFactura: 7_257_000,
    totalPagado: 7_257_000,
    anulada: false,
  },
  {
    id: "f3",
    proveedorId: "p3",
    proveedorNombre: "Andrés Felipe Rojas Gómez",
    numeroFactura: "CC-118",
    tipoDocumento: "cuenta_cobro",
    categoria: "Honorarios médicos",
    fechaRecibo: hace(33),
    fechaVencimiento: hace(3),
    detalle: "Honorarios procedimientos julio",
    valorSubtotal: 4_200_000,
    ivaValor: 0,
    reteFuenteValor: 462_000,
    reteIcaValor: 0,
    totalFactura: 3_738_000,
    totalPagado: 2_000_000,
    anulada: false,
  },
  {
    id: "f4",
    proveedorId: "p2",
    proveedorNombre: "Insumos Quirúrgicos Andina Ltda",
    numeroFactura: "FEIQ-990",
    tipoDocumento: "factura",
    categoria: "Insumos médicos",
    fechaRecibo: hace(41),
    fechaVencimiento: en(4),
    valorSubtotal: 10_655_000,
    ivaValor: 2_024_450,
    reteFuenteValor: 0,
    reteIcaValor: 106_550,
    totalFactura: 12_572_900,
    totalPagado: 0,
    anulada: false,
  },
  {
    id: "f5",
    proveedorId: "p4",
    proveedorNombre: "Tecnimed Equipos SAS",
    numeroFactura: "Cotiz-882",
    tipoDocumento: "cotizacion_anticipo",
    categoria: "Mantenimiento de equipos",
    fechaRecibo: hace(20),
    fechaVencimiento: en(20),
    detalle: "Mantenimiento preventivo torre de laparoscopia",
    valorSubtotal: 26_050_420,
    ivaValor: 4_949_580,
    reteFuenteValor: 0,
    reteIcaValor: 0,
    totalFactura: 31_000_000,
    totalPagado: 10_000_000,
    anulada: false,
  },
  {
    id: "f6",
    proveedorId: "p5",
    proveedorNombre: "Suministros Andina de Colombia SAS",
    numeroFactura: "FSA-2231",
    tipoDocumento: "factura",
    categoria: "Insumos no médicos",
    fechaRecibo: hace(31),
    fechaVencimiento: hace(1),
    valorSubtotal: 2_647_059,
    ivaValor: 502_941,
    reteFuenteValor: 0,
    reteIcaValor: 0,
    totalFactura: 3_150_000,
    totalPagado: 0,
    anulada: false,
  },
];
