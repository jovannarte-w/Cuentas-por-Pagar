/**
 * DATOS DE EJEMPLO -- no provienen de Supabase todavia.
 * Sirven para maquetar el dashboard y las pantallas mientras se conecta
 * un proyecto real. Los nombres y montos son ficticios.
 */

export type EstadoFactura = "pendiente" | "parcial" | "pagada";
export type TipoDocumento = "factura" | "cuenta_cobro" | "cotizacion_anticipo";

export type FacturaEjemplo = {
  id: string;
  proveedor: string;
  numeroFactura: string;
  tipoDocumento: TipoDocumento;
  fechaVencimiento: string; // ISO
  totalFactura: number;
  totalPagado: number;
  categoria: string;
};

const hoy = new Date();
function diasDesdeHoy(dias: number) {
  const d = new Date(hoy);
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
}

export const facturasEjemplo: FacturaEjemplo[] = [
  { id: "1", proveedor: "Distribuidora Médica del Pacífico SAS", numeroFactura: "FE-4821", tipoDocumento: "factura", fechaVencimiento: diasDesdeHoy(-12), totalFactura: 18_450_000, totalPagado: 0, categoria: "Insumos médicos" },
  { id: "2", proveedor: "Distribuidora Médica del Pacífico SAS", numeroFactura: "FE-4903", tipoDocumento: "factura", fechaVencimiento: diasDesdeHoy(9), totalFactura: 7_320_000, totalPagado: 7_320_000, categoria: "Insumos médicos" },
  { id: "3", proveedor: "Dr. Andrés Felipe Rojas", numeroFactura: "CC-118", tipoDocumento: "cuenta_cobro", fechaVencimiento: diasDesdeHoy(-3), totalFactura: 4_200_000, totalPagado: 2_000_000, categoria: "Honorarios médicos" },
  { id: "4", proveedor: "Insumos Quirúrgicos Andina Ltda", numeroFactura: "FEIQ-990", tipoDocumento: "factura", fechaVencimiento: diasDesdeHoy(4), totalFactura: 12_680_000, totalPagado: 0, categoria: "Insumos médicos" },
  { id: "5", proveedor: "Tecnimed Equipos SAS", numeroFactura: "Cotiz-882", tipoDocumento: "cotizacion_anticipo", fechaVencimiento: diasDesdeHoy(20), totalFactura: 31_000_000, totalPagado: 10_000_000, categoria: "Mantenimiento de equipos" },
  { id: "6", proveedor: "Suministros Andina de Colombia SAS", numeroFactura: "FSA-2231", tipoDocumento: "factura", fechaVencimiento: diasDesdeHoy(-1), totalFactura: 3_150_000, totalPagado: 0, categoria: "Insumos no médicos" },
  { id: "7", proveedor: "Dra. Lucía Fernanda Mesa", numeroFactura: "CC-045", tipoDocumento: "cuenta_cobro", fechaVencimiento: diasDesdeHoy(6), totalFactura: 5_800_000, totalPagado: 5_800_000, categoria: "Honorarios médicos" },
  { id: "8", proveedor: "Distribuidora Médica del Pacífico SAS", numeroFactura: "FE-5010", tipoDocumento: "factura", fechaVencimiento: diasDesdeHoy(2), totalFactura: 9_940_000, totalPagado: 4_000_000, categoria: "Insumos médicos" },
  { id: "9", proveedor: "Insumos Quirúrgicos Andina Ltda", numeroFactura: "FEIQ-1004", tipoDocumento: "factura", fechaVencimiento: diasDesdeHoy(-20), totalFactura: 2_480_000, totalPagado: 0, categoria: "Insumos médicos" },
  { id: "10", proveedor: "Tecnimed Equipos SAS", numeroFactura: "FTE-330", tipoDocumento: "factura", fechaVencimiento: diasDesdeHoy(15), totalFactura: 6_050_000, totalPagado: 0, categoria: "Mantenimiento de equipos" },
];

export function estadoDe(f: FacturaEjemplo): EstadoFactura {
  const saldo = f.totalFactura - f.totalPagado;
  if (saldo <= 0) return "pagada";
  if (f.totalPagado > 0) return "parcial";
  return "pendiente";
}

export function saldoDe(f: FacturaEjemplo) {
  return f.totalFactura - f.totalPagado;
}

export function diasParaVencer(f: FacturaEjemplo) {
  const venc = new Date(f.fechaVencimiento);
  return Math.round((venc.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
}

export function kpisEjemplo() {
  const pendientesOParciales = facturasEjemplo.filter((f) => estadoDe(f) !== "pagada");
  const totalPorPagar = pendientesOParciales.reduce((s, f) => s + saldoDe(f), 0);
  const totalVencido = pendientesOParciales
    .filter((f) => diasParaVencer(f) < 0)
    .reduce((s, f) => s + saldoDe(f), 0);
  const porVencer7 = pendientesOParciales
    .filter((f) => diasParaVencer(f) >= 0 && diasParaVencer(f) <= 7)
    .reduce((s, f) => s + saldoDe(f), 0);
  const pagadoEsteMes = facturasEjemplo.reduce((s, f) => s + f.totalPagado, 0);

  return { totalPorPagar, totalVencido, porVencer7, pagadoEsteMes };
}

export function topProveedoresPorDeuda(n = 5) {
  const porProveedor = new Map<string, number>();
  for (const f of facturasEjemplo) {
    if (estadoDe(f) === "pagada") continue;
    porProveedor.set(f.proveedor, (porProveedor.get(f.proveedor) ?? 0) + saldoDe(f));
  }
  return [...porProveedor.entries()]
    .map(([proveedor, saldo]) => ({ proveedor, saldo }))
    .sort((a, b) => b.saldo - a.saldo)
    .slice(0, n);
}

export function formatoCOP(valor: number) {
  return valor.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
}
