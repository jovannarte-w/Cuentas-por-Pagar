/**
 * DATOS DE EJEMPLO -- reflejan public.obligaciones_financieras y
 * public.movimientos_obligacion (supabase/migrations/0010_tesoreria.sql).
 *
 * Separa del módulo de Facturas las obligaciones que en el Excel aparecían
 * mezcladas al final de cada hoja mensual: PRESTAMO VIRTUAL BBVA, PRESTAMO
 * VIRTUAL BANCOLOMBIA, POLIZA ASEGURADORA SOLIDARIA, TC BCOLOMBIA — no son
 * cuentas por pagar a proveedores, son deuda financiera de la clínica.
 */

import { cuentasBancariasEjemplo, programacionesEjemplo } from "./pagos";

export type TipoObligacion = "prestamo" | "poliza" | "tarjeta_credito";
export type EstadoObligacion = "activa" | "cancelada";

export const tipoObligacionLabel: Record<TipoObligacion, string> = {
  prestamo: "Préstamo",
  poliza: "Póliza financiada",
  tarjeta_credito: "Tarjeta de crédito",
};

export const estadoObligacionLabel: Record<EstadoObligacion, string> = {
  activa: "Activa",
  cancelada: "Cancelada",
};

export type ObligacionFinanciera = {
  id: string;
  tipo: TipoObligacion;
  entidadFinanciera: string;
  titular?: string; // responsable de la tarjeta empresarial (ej. Diana Cerón)
  numeroReferencia?: string; // número de crédito/póliza/tarjeta, enmascarado
  montoOriginal: number; // desembolsado / suma asegurada / cupo aprobado
  saldoActual: number; // saldo de capital pendiente, o saldo usado si es tarjeta
  tasaInteres?: number; // % efectivo anual
  cuotaPeriodica?: number; // valor de la cuota mensual estimada
  proximaCuotaFecha?: string; // ISO, próxima fecha de cobro/cuota proyectada
  cuentaBancariaId?: string;
  fechaInicio: string;
  fechaVencimiento?: string;
  estado: EstadoObligacion;
  notas?: string;
};

export function cupoDisponible(o: ObligacionFinanciera) {
  return o.tipo === "tarjeta_credito" ? o.montoOriginal - o.saldoActual : undefined;
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

export const obligacionesEjemplo: ObligacionFinanciera[] = [
  {
    id: "ob1",
    tipo: "prestamo",
    entidadFinanciera: "BBVA",
    numeroReferencia: "PV-‧‧2201",
    montoOriginal: 180_000_000,
    saldoActual: 96_400_000,
    tasaInteres: 15.8,
    cuotaPeriodica: 9_500_000,
    proximaCuotaFecha: en(6),
    cuentaBancariaId: "cta2",
    fechaInicio: hace(540),
    fechaVencimiento: en(720),
    estado: "activa",
    notas: "Crédito virtual para remodelación de quirófano 2 (2024).",
  },
  {
    id: "ob2",
    tipo: "prestamo",
    entidadFinanciera: "Bancolombia",
    numeroReferencia: "PV-‧‧8834",
    montoOriginal: 120_000_000,
    saldoActual: 41_200_000,
    tasaInteres: 16.4,
    cuotaPeriodica: 6_800_000,
    proximaCuotaFecha: en(18),
    cuentaBancariaId: "cta1",
    fechaInicio: hace(780),
    fechaVencimiento: en(210),
    estado: "activa",
    notas: "Compra de torre de laparoscopia (2023).",
  },
  {
    id: "ob3",
    tipo: "poliza",
    entidadFinanciera: "Aseguradora Solidaria",
    numeroReferencia: "POL-‧‧4470",
    montoOriginal: 28_600_000,
    saldoActual: 11_900_000,
    tasaInteres: 22.0,
    cuotaPeriodica: 2_483_000,
    proximaCuotaFecha: en(11),
    cuentaBancariaId: "cta1",
    fechaInicio: hace(150),
    fechaVencimiento: en(60),
    estado: "activa",
    notas: "Póliza de responsabilidad civil clínica, financiada a 12 meses.",
  },
  {
    id: "ob4",
    tipo: "tarjeta_credito",
    entidadFinanciera: "Bancolombia",
    titular: "Diana Cerón",
    numeroReferencia: "TC-‧‧5512",
    montoOriginal: 15_000_000,
    saldoActual: 6_230_000,
    cuotaPeriodica: 6_230_000,
    proximaCuotaFecha: en(9),
    cuentaBancariaId: "cta1",
    fechaInicio: hace(900),
    estado: "activa",
    notas: "Tarjeta empresarial — compras de insumos y viáticos.",
  },
  {
    id: "ob5",
    tipo: "tarjeta_credito",
    entidadFinanciera: "Bancolombia",
    titular: "Contreras",
    numeroReferencia: "TC-‧‧7743",
    montoOriginal: 10_000_000,
    saldoActual: 3_080_000,
    cuotaPeriodica: 3_080_000,
    proximaCuotaFecha: en(9),
    cuentaBancariaId: "cta1",
    fechaInicio: hace(620),
    estado: "activa",
    notas: "Tarjeta empresarial — compras de insumos y viáticos.",
  },
];

/**
 * Proyecta las próximas ocurrencias de la cuota de una obligación dentro de
 * un horizonte en días (las cuotas de préstamo/póliza/tarjeta son mensuales).
 */
function proyectarCuotas(o: ObligacionFinanciera, horizonteDias: number) {
  if (!o.cuotaPeriodica || !o.proximaCuotaFecha || o.estado !== "activa") return [];
  const fechas: { fecha: string; monto: number }[] = [];
  const limite = en(horizonteDias);
  let cursor = new Date(o.proximaCuotaFecha);
  while (cursor.toISOString().slice(0, 10) <= limite) {
    fechas.push({ fecha: cursor.toISOString().slice(0, 10), monto: o.cuotaPeriodica });
    cursor = new Date(cursor);
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return fechas;
}

function inicioSemana(fechaISO: string) {
  const d = new Date(fechaISO);
  const diaSemana = d.getDay(); // 0=domingo
  const offset = diaSemana === 0 ? 6 : diaSemana - 1; // lunes como inicio
  d.setDate(d.getDate() - offset);
  return d.toISOString().slice(0, 10);
}

export type SemanaFlujoCaja = {
  semanaInicio: string;
  pagosProgramados: number;
  cuotasObligaciones: number;
  totalSalidas: number;
  saldoProyectado: number;
};

/**
 * Cruza lo ya programado en Pagos (programacion_pagos) con las cuotas
 * proyectadas de Tesorería, partiendo del saldo bancario consolidado actual
 * -- el mismo cruce que hará public.v_flujo_caja_proyectado en producción.
 */
export function flujoCajaProyectado(horizonteSemanas: 4 | 8 | 12): SemanaFlujoCaja[] {
  const horizonteDias = horizonteSemanas * 7;
  const saldoInicial = cuentasBancariasEjemplo.reduce((s, c) => s + c.saldoActual, 0);

  const salidas = new Map<string, { pagos: number; cuotas: number }>();
  for (let i = 0; i < horizonteSemanas; i++) {
    const semana = inicioSemana(en(i * 7));
    salidas.set(semana, { pagos: 0, cuotas: 0 });
  }

  for (const p of programacionesEjemplo) {
    if (p.estado !== "programado" && p.estado !== "aprobado") continue;
    const semana = inicioSemana(p.fechaProgramada);
    const bucket = salidas.get(semana);
    if (bucket) bucket.pagos += p.montoProgramado;
  }

  for (const o of obligacionesEjemplo) {
    for (const cuota of proyectarCuotas(o, horizonteDias)) {
      const semana = inicioSemana(cuota.fecha);
      const bucket = salidas.get(semana);
      if (bucket) bucket.cuotas += cuota.monto;
    }
  }

  let acumulado = saldoInicial;
  return [...salidas.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([semanaInicio, { pagos, cuotas }]) => {
      const totalSalidas = pagos + cuotas;
      acumulado -= totalSalidas;
      return { semanaInicio, pagosProgramados: pagos, cuotasObligaciones: cuotas, totalSalidas, saldoProyectado: acumulado };
    });
}

export function saldoBancarioConsolidado() {
  return cuentasBancariasEjemplo.reduce((s, c) => s + c.saldoActual, 0);
}
