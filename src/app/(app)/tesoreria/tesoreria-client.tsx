"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import {
  Plus,
  Ban,
  RotateCcw,
  Landmark,
  ShieldCheck,
  CreditCard,
  AlertTriangle,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  obligacionesEjemplo,
  tipoObligacionLabel,
  estadoObligacionLabel,
  cupoDisponible,
  flujoCajaProyectado,
  saldoBancarioConsolidado,
  type ObligacionFinanciera,
} from "@/lib/sample-data/tesoreria";
import { formatoCOP } from "@/lib/sample-data";
import { useRolDemo } from "@/lib/rol-demo-context";
import type { ObligacionFormValues } from "@/components/tesoreria/obligacion-form";

const ObligacionForm = dynamic(
  () => import("@/components/tesoreria/obligacion-form").then((m) => m.ObligacionForm),
  { ssr: false }
);

const tipoIcono: Record<ObligacionFinanciera["tipo"], React.ComponentType<{ className?: string }>> = {
  prestamo: Landmark,
  poliza: ShieldCheck,
  tarjeta_credito: CreditCard,
};

const tipoBadgeClase: Record<ObligacionFinanciera["tipo"], string> = {
  prestamo: "bg-primary/10 text-primary border border-primary/30",
  poliza: "bg-warning/10 text-warning-foreground border border-warning/30",
  tarjeta_credito: "bg-purple-50 text-purple-700 border border-purple-200",
};

function formatoSemana(iso: string) {
  const inicio = new Date(iso);
  const fin = new Date(inicio);
  fin.setDate(fin.getDate() + 6);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  return `${inicio.toLocaleDateString("es-CO", opts)} – ${fin.toLocaleDateString("es-CO", opts)}`;
}

export function TesoreriaClient() {
  const { permisos } = useRolDemo();
  const puedeGestionar = permisos.puedeEditar;

  const [obligaciones, setObligaciones] = useState<ObligacionFinanciera[]>(obligacionesEjemplo);
  const [formAbierto, setFormAbierto] = useState(false);
  const [formMontado, setFormMontado] = useState(false);

  const totalDeuda = useMemo(
    () => obligaciones.filter((o) => o.estado === "activa").reduce((s, o) => s + o.saldoActual, 0),
    [obligaciones]
  );
  const cuotaMensualTotal = useMemo(
    () =>
      obligaciones
        .filter((o) => o.estado === "activa")
        .reduce((s, o) => s + (o.cuotaPeriodica ?? 0), 0),
    [obligaciones]
  );
  const cupoTarjetasDisponible = useMemo(
    () =>
      obligaciones
        .filter((o) => o.estado === "activa" && o.tipo === "tarjeta_credito")
        .reduce((s, o) => s + (cupoDisponible(o) ?? 0), 0),
    [obligaciones]
  );

  function crearObligacion(v: ObligacionFormValues & { cuentaNombre?: string }) {
    const nueva: ObligacionFinanciera = {
      id: crypto.randomUUID(),
      tipo: v.tipo,
      entidadFinanciera: v.entidadFinanciera,
      titular: v.titular || undefined,
      numeroReferencia: v.numeroReferencia || undefined,
      montoOriginal: v.montoOriginal,
      saldoActual: v.saldoActual,
      tasaInteres: v.tasaInteres,
      cuotaPeriodica: v.cuotaPeriodica,
      proximaCuotaFecha: v.proximaCuotaFecha || undefined,
      cuentaBancariaId: v.cuentaBancariaId || undefined,
      fechaInicio: v.fechaInicio,
      fechaVencimiento: v.fechaVencimiento || undefined,
      estado: "activa",
      notas: v.notas || undefined,
    };
    setObligaciones((prev) => [nueva, ...prev]);
    toast.success(`${tipoObligacionLabel[v.tipo]} registrada`);
  }

  function alternarEstado(o: ObligacionFinanciera) {
    const nuevoEstado = o.estado === "activa" ? "cancelada" : "activa";
    setObligaciones((prev) => prev.map((x) => (x.id === o.id ? { ...x, estado: nuevoEstado } : x)));
    toast(nuevoEstado === "cancelada" ? `${o.entidadFinanciera} marcada como cancelada` : `${o.entidadFinanciera} reactivada`);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-purple-200 bg-purple-50 px-4 py-2.5 text-sm text-purple-900">
        <b>Obligaciones financieras de ejemplo</b>: Préstamos, pólizas financiadas y tarjetas empresariales. El flujo de caja proyectado cruza estas cuotas con los pagos ya programados.
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard icon={Landmark} label="Deuda financiera activa" value={formatoCOP(totalDeuda)} />
        <KpiCard icon={Wallet} label="Cuota mensual estimada" value={formatoCOP(cuotaMensualTotal)} tone="warning" />
        <KpiCard icon={CreditCard} label="Cupo disponible en tarjetas" value={formatoCOP(cupoTarjetasDisponible)} tone="ok" />
        <KpiCard icon={Wallet} label="Saldo bancario consolidado" value={formatoCOP(saldoBancarioConsolidado())} />
      </div>

      <Tabs defaultValue="obligaciones">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="obligaciones">Obligaciones financieras</TabsTrigger>
            <TabsTrigger value="flujo">Flujo de caja proyectado</TabsTrigger>
          </TabsList>
          {puedeGestionar && (
            <Button
              onClick={() => {
                setFormMontado(true);
                setFormAbierto(true);
              }}
            >
              <Plus />
              Nueva obligación
            </Button>
          )}
        </div>

        <TabsContent value="obligaciones" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border bg-muted hover:bg-muted">
                      <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tipo</TableHead>
                      <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Entidad / Titular</TableHead>
                      <TableHead className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Saldo / Cupo usado</TableHead>
                      <TableHead className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cuota mensual</TableHead>
                      <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Próxima cuota</TableHead>
                      <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Vencimiento</TableHead>
                      <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Estado</TableHead>
                      <TableHead className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                <TableBody>
                  {obligaciones.map((o) => {
                    const Icon = tipoIcono[o.tipo];
                    const disponible = cupoDisponible(o);
                    return (
                      <TableRow key={o.id} className="border-b border-border hover:bg-primary/10 transition-colors duration-150">
                        <TableCell className="px-4 py-3">
                          <Badge variant="secondary" className={`${tipoBadgeClase[o.tipo]} font-semibold text-xs`}>
                            <Icon className="size-3.5" />
                            {tipoObligacionLabel[o.tipo]}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <div className="font-semibold text-foreground">{o.entidadFinanciera}</div>
                          <div className="text-xs text-muted-foreground">
                            {o.titular ?? o.numeroReferencia ?? "—"}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-right tabular-nums text-foreground">
                          {formatoCOP(o.saldoActual)}
                          {disponible !== undefined && (
                            <div className="text-xs text-muted-foreground">
                              Disponible: {formatoCOP(disponible)}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-right tabular-nums text-foreground">
                          {o.cuotaPeriodica ? formatoCOP(o.cuotaPeriodica) : "—"}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm text-foreground">{o.proximaCuotaFecha ?? "—"}</TableCell>
                        <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                          {o.fechaVencimiento ?? "—"}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <Badge
                            variant="secondary"
                            className={`${
                              o.estado === "activa"
                                ? "bg-success/10 text-success border border-success/30"
                                : "bg-destructive/10 text-destructive border border-destructive/30"
                            } font-semibold`}
                          >
                            {estadoObligacionLabel[o.estado]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {puedeGestionar ? (
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              onClick={() => alternarEstado(o)}
                              title={o.estado === "activa" ? "Marcar cancelada" : "Reactivar"}
                            >
                              {o.estado === "activa" ? (
                                <Ban className="text-destructive" />
                              ) : (
                                <RotateCcw className="text-primary" />
                              )}
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground">Solo lectura</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flujo" className="mt-4">
          <FlujoCajaTab />
        </TabsContent>
      </Tabs>

      {formMontado && (
        <ObligacionForm open={formAbierto} onOpenChange={setFormAbierto} onSubmit={crearObligacion} />
      )}
    </div>
  );
}

function FlujoCajaTab() {
  const horizontes = [4, 8, 12] as const;
  const [horizonte, setHorizonte] = useState<(typeof horizontes)[number]>(4);
  const semanas = useMemo(() => flujoCajaProyectado(horizonte), [horizonte]);
  const saldoFinal = semanas.at(-1)?.saldoProyectado ?? saldoBancarioConsolidado();
  const semanaEnRiesgo = semanas.find((s) => s.saldoProyectado < 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {horizontes.map((h) => (
          <Button
            key={h}
            size="sm"
            variant={horizonte === h ? "default" : "outline"}
            onClick={() => setHorizonte(h)}
          >
            {h} semanas
          </Button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Wallet className="size-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">
                Saldo proyectado tras {horizonte} semanas
              </div>
              <div
                className={`text-lg font-semibold tabular-nums ${saldoFinal < 0 ? "text-destructive" : ""}`}
              >
                {formatoCOP(saldoFinal)}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                semanaEnRiesgo ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
              }`}
            >
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Cobertura de caja</div>
              <div className="text-sm font-semibold">
                {semanaEnRiesgo
                  ? `Alerta: saldo insuficiente semana de ${formatoSemana(semanaEnRiesgo.semanaInicio)}`
                  : "Saldo cubre las salidas proyectadas"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Salidas proyectadas por semana — Pagos programados + cuotas de Tesorería
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Semana</TableHead>
                <TableHead className="text-right">Pagos programados</TableHead>
                <TableHead className="text-right">Cuotas obligaciones</TableHead>
                <TableHead className="text-right">Total salidas</TableHead>
                <TableHead className="text-right">Saldo proyectado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {semanas.map((s) => (
                <TableRow key={s.semanaInicio}>
                  <TableCell className="text-sm">{formatoSemana(s.semanaInicio)}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatoCOP(s.pagosProgramados)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatoCOP(s.cuotasObligaciones)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-medium">
                    {formatoCOP(s.totalSalidas)}
                  </TableCell>
                  <TableCell
                    className={`text-right tabular-nums ${s.saldoProyectado < 0 ? "text-destructive font-medium" : ""}`}
                  >
                    {formatoCOP(s.saldoProyectado)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  tone = "default",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone?: "default" | "danger" | "warning" | "ok";
}) {
  const iconBackgroundClasses = {
    default: "bg-primary/10 text-primary",
    danger: "bg-destructive/10 text-destructive",
    warning: "bg-warning/10 text-warning-foreground",
    ok: "bg-success/10 text-success",
  }[tone];

  const valueColorClasses = {
    default: "text-primary",
    danger: "text-destructive",
    warning: "text-warning-foreground",
    ok: "text-success",
  }[tone];

  return (
    <div className="rounded-lg border border-border bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            {label}
          </p>
          <p className={`text-3xl font-bold tabular-nums mb-1.5 ${valueColorClasses}`}>
            {value}
          </p>
        </div>
        <div className={`flex size-12 shrink-0 items-center justify-center rounded-lg ${iconBackgroundClasses}`}>
          <Icon className="size-6" />
        </div>
      </div>
    </div>
  );
}
