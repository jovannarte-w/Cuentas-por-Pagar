/**
 * FUENTE DE DATOS DE LA APLICACION.
 *
 * Hoy sirve el snapshot REAL de septiembre de 2026, migrado y validado desde
 * el Excel (ver src/lib/datos-reales/). Cuando se conecte Supabase, solo hay
 * que cambiar este archivo por consultas a la base de datos: las pantallas no
 * se tocan porque todas importan desde aqui.
 */

import { facturasReales } from "@/lib/datos-reales/facturas";
import { proveedoresReales } from "@/lib/datos-reales/proveedores";
import { pagosReales, tipoPagoRealLabel } from "@/lib/datos-reales/pagos";
import { resumenMigracion } from "@/lib/datos-reales/resumen";
import { correccionesPago, exclusionesFacturas } from "@/lib/datos-reales/correcciones";
import type { Factura } from "@/lib/sample-data/facturas";
import type { Proveedor } from "@/lib/sample-data/proveedores";
import type { Pago } from "@/lib/sample-data/pagos";
import { saldoPendiente, estadoFactura, diasVencimiento } from "@/lib/sample-data/facturas";

export const proveedores: Proveedor[] = proveedoresReales;

const idsExcluidos = new Set(exclusionesFacturas.map((e) => e.facturaId));

// Aplica las correcciones manuales confirmadas (ver correcciones.ts): pagos
// que el Excel solo anotaba como texto en Observaciones y que la migración
// automática no pudo contar como abono, y filas que no son una factura real.
export const facturas: Factura[] = facturasReales
  .filter((f) => !idsExcluidos.has(f.id))
  .map((f) => {
    const correccion = correccionesPago.find((c) => c.facturaId === f.id);
    if (!correccion) return f;
    return { ...f, totalPagado: f.totalPagado + correccion.montoPagado };
  });

export const pagos: Pago[] = [
  ...pagosReales.map((p) => ({
    id: p.id,
    facturaId: p.facturaId,
    facturaNumero: p.facturaNumero,
    proveedorNombre: p.proveedorNombre,
    montoPagado: p.montoPagado,
    referenciaBancaria: p.referenciaBancaria,
    tipoPago: p.tipoPago,
  })),
  ...correccionesPago.map((c): Pago => {
    const f = facturasReales.find((x) => x.id === c.facturaId)!;
    return {
      id: `CORR-${c.facturaId}`,
      facturaId: c.facturaId,
      facturaNumero: f.numeroFactura ?? "sin número",
      proveedorNombre: f.proveedorNombre,
      montoPagado: c.montoPagado,
      fechaPago: c.fechaPago,
      referenciaBancaria: c.motivo,
      tipoPago: "abono",
    };
  }),
];

export { resumenMigracion, tipoPagoRealLabel };

/** Deuda pendiente consolidada por proveedor, ordenada de mayor a menor. */
export type DeudaProveedor = {
  proveedorId: string;
  razonSocial: string;
  nit: string;
  numFacturas: number;
  numFacturasPendientes: number;
  totalFacturado: number;
  totalPagado: number;
  saldoPendiente: number;
  facturaMasAntigua?: string;
};

export function deudaPorProveedor(): DeudaProveedor[] {
  const porProveedor = new Map<string, DeudaProveedor>();

  for (const prov of proveedores) {
    porProveedor.set(prov.id, {
      proveedorId: prov.id,
      razonSocial: prov.razonSocial,
      nit: prov.nit,
      numFacturas: 0,
      numFacturasPendientes: 0,
      totalFacturado: 0,
      totalPagado: 0,
      saldoPendiente: 0,
    });
  }

  for (const f of facturas) {
    const fila = porProveedor.get(f.proveedorId);
    if (!fila) continue;
    fila.numFacturas += 1;
    fila.totalFacturado += f.totalFactura;
    fila.totalPagado += f.totalPagado;
    const saldo = saldoPendiente(f);
    if (estadoFactura(f) !== "pagada" && estadoFactura(f) !== "anulada") {
      fila.saldoPendiente += saldo;
      fila.numFacturasPendientes += 1;
      if (f.fechaRecibo && (!fila.facturaMasAntigua || f.fechaRecibo < fila.facturaMasAntigua)) {
        fila.facturaMasAntigua = f.fechaRecibo;
      }
    }
  }

  return [...porProveedor.values()].sort((a, b) => b.saldoPendiente - a.saldoPendiente);
}

/** Fila liviana de factura para el detalle expandible de un proveedor (dashboard). */
export type FacturaResumen = {
  id: string;
  numeroFactura: string;
  detalle: string;
  fechaRecibo: string;
  fechaVencimiento: string | null;
  totalFactura: number;
  saldo: number;
  estado: ReturnType<typeof estadoFactura>;
  diasVencimiento: number | null;
};

/**
 * Agrupa las facturas por proveedor, ya resumidas al vuelo, para pasarlas como
 * props desde un Server Component. Evita que el cliente reciba el arreglo
 * completo de `facturas` (7000+ líneas) solo para poder expandir una fila.
 */
export function facturasPorProveedor(): Record<string, FacturaResumen[]> {
  const porProveedor: Record<string, Factura[]> = {};

  for (const f of facturas) {
    (porProveedor[f.proveedorId] ??= []).push(f);
  }

  const resultado: Record<string, FacturaResumen[]> = {};
  for (const [proveedorId, suyas] of Object.entries(porProveedor)) {
    resultado[proveedorId] = [...suyas]
      .sort((a, b) => (b.fechaRecibo ?? "").localeCompare(a.fechaRecibo ?? ""))
      .map((f) => ({
        id: f.id,
        numeroFactura: f.numeroFactura ?? "sin número",
        detalle: f.detalle ?? "—",
        fechaRecibo: f.fechaRecibo ?? "sin fecha",
        fechaVencimiento: f.fechaVencimiento ?? null,
        totalFactura: f.totalFactura,
        saldo: saldoPendiente(f),
        estado: estadoFactura(f),
        diasVencimiento: diasVencimiento(f),
      }));
  }

  return resultado;
}

/** KPIs del dashboard, calculados sobre los datos reales. */
export function kpis() {
  const vivas = facturas.filter((f) => {
    const e = estadoFactura(f);
    return e === "pendiente" || e === "parcial";
  });

  const hoy = new Date().toISOString().slice(0, 10);
  const totalPorPagar = vivas.reduce((s, f) => s + saldoPendiente(f), 0);
  const vencidas = vivas.filter((f) => f.fechaVencimiento && f.fechaVencimiento < hoy);
  const enSieteDias = new Date();
  enSieteDias.setDate(enSieteDias.getDate() + 7);
  const limite7 = enSieteDias.toISOString().slice(0, 10);
  const porVencer = vivas.filter(
    (f) => f.fechaVencimiento && f.fechaVencimiento >= hoy && f.fechaVencimiento <= limite7
  );
  const sinFecha = vivas.filter((f) => !f.fechaVencimiento);

  return {
    totalPorPagar,
    totalVencido: vencidas.reduce((s, f) => s + saldoPendiente(f), 0),
    numVencidas: vencidas.length,
    porVencer7: porVencer.reduce((s, f) => s + saldoPendiente(f), 0),
    numPorVencer7: porVencer.length,
    totalPagado: facturas.reduce((s, f) => s + f.totalPagado, 0),
    numFacturasVivas: vivas.length,
    totalSinFecha: sinFecha.reduce((s, f) => s + saldoPendiente(f), 0),
    numSinFecha: sinFecha.length,
  };
}

export type Kpis = ReturnType<typeof kpis>;
