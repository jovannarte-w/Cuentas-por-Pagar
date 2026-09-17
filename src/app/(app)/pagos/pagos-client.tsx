"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { Plus, Check, X, Ban, PlayCircle, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
  programacionesEjemplo,
  estadoProgramacionLabel,
  metodoPagoLabel,
  montoAPagar,
  type ProgramacionPago,
  type Pago,
} from "@/lib/sample-data/pagos";
import type { Factura } from "@/lib/sample-data/facturas";
import { formatoCOP } from "@/lib/sample-data";
import { useRolDemo } from "@/lib/rol-demo-context";
import type { ProgramacionFormValues } from "@/components/pagos/programacion-form";

const ProgramacionForm = dynamic(
  () => import("@/components/pagos/programacion-form").then((m) => m.ProgramacionForm),
  { ssr: false }
);
const RechazarDialog = dynamic(
  () => import("@/components/pagos/rechazar-dialog").then((m) => m.RechazarDialog),
  { ssr: false }
);
const AprobarDialog = dynamic(
  () => import("@/components/pagos/aprobar-dialog").then((m) => m.AprobarDialog),
  { ssr: false }
);

const estadoBadgeClase: Record<string, string> = {
  programado: "bg-muted text-foreground border border-border",
  aprobado: "bg-warning/10 text-warning-foreground border border-warning/30",
  ejecutado: "bg-success/10 text-success border border-success/30",
  rechazado: "bg-destructive/10 text-destructive border border-destructive/30",
  cancelado: "bg-destructive/10 text-destructive border border-destructive/30",
};

export function PagosClient({
  pagosIniciales,
  facturas,
}: {
  pagosIniciales: Pago[];
  facturas: Factura[];
}) {
  const { permisos, nombre } = useRolDemo();
  // Separación de funciones: el Auxiliar programa y ejecuta, el Presidente aprueba.
  const puedeProgramarYEjecutar = permisos.puedeProgramarYEjecutar;
  const puedeAprobar = permisos.puedeAprobar;

  const [programaciones, setProgramaciones] = useState<ProgramacionPago[]>(programacionesEjemplo);
  const [pagos, setPagos] = useState<Pago[]>(pagosIniciales);
  const [formAbierto, setFormAbierto] = useState(false);
  const [formMontado, setFormMontado] = useState(false);
  const [rechazando, setRechazando] = useState<ProgramacionPago | null>(null);
  const [rechazarMontado, setRechazarMontado] = useState(false);
  const [aprobando, setAprobando] = useState<ProgramacionPago | null>(null);
  const [aprobarMontado, setAprobarMontado] = useState(false);

  function crearProgramacion(v: ProgramacionFormValues & { facturaNumero: string; proveedorNombre: string; cuentaNombre: string }) {
    const nueva: ProgramacionPago = {
      id: crypto.randomUUID(),
      facturaId: v.facturaId,
      facturaNumero: v.facturaNumero,
      proveedorNombre: v.proveedorNombre,
      saldoFactura: v.montoProgramado,
      fechaProgramada: v.fechaProgramada,
      montoProgramado: v.montoProgramado,
      cuentaBancaria: v.cuentaNombre,
      estado: "programado",
      creadoPor: nombre,
    };
    setProgramaciones((prev) => [nueva, ...prev]);
    toast.success("Programación enviada a aprobación del Presidente");
  }

  function aprobar(p: ProgramacionPago, montoAprobado: number, observacion: string) {
    setProgramaciones((prev) =>
      prev.map((x) =>
        x.id === p.id
          ? {
              ...x,
              estado: "aprobado",
              montoAprobado,
              observacionAprobacion: observacion || undefined,
              aprobadoPor: nombre,
            }
          : x
      )
    );
    const parcial = montoAprobado < p.montoProgramado;
    toast.success(
      parcial
        ? `Aprobado por ${formatoCOP(montoAprobado)} de ${formatoCOP(p.montoProgramado)}`
        : `Pago a ${p.proveedorNombre} aprobado`
    );
  }

  function rechazar(p: ProgramacionPago, motivo: string) {
    setProgramaciones((prev) =>
      prev.map((x) => (x.id === p.id ? { ...x, estado: "rechazado", motivoRechazo: motivo } : x))
    );
    toast.warning(`Programación de ${p.proveedorNombre} rechazada`);
  }

  function cancelar(p: ProgramacionPago) {
    setProgramaciones((prev) => prev.map((x) => (x.id === p.id ? { ...x, estado: "cancelado" } : x)));
    toast("Programación cancelada");
  }

  function ejecutar(p: ProgramacionPago) {
    // Se paga lo APROBADO, no lo programado.
    const monto = montoAPagar(p);
    const nuevoPago: Pago = {
      id: crypto.randomUUID(),
      facturaId: p.facturaId,
      facturaNumero: p.facturaNumero,
      proveedorNombre: p.proveedorNombre,
      fechaPago: new Date().toISOString().slice(0, 10),
      montoPagado: monto,
      metodoPago: "transferencia",
      cuentaBancaria: p.cuentaBancaria,
      registradoPor: nombre,
    };
    setPagos((prev) => [nuevoPago, ...prev]);
    setProgramaciones((prev) => prev.map((x) => (x.id === p.id ? { ...x, estado: "ejecutado" } : x)));
    toast.success(`Pago ejecutado por ${formatoCOP(monto)}`);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-warning/30 bg-warning/10 px-4 py-2.5 text-sm text-warning-foreground">
        <b>104 pagos registrados</b> son reales (abonos del Excel). Las programaciones de pago
        son de ejemplo para que pruebes el flujo de aprobación: cambia el rol arriba a la derecha (Presidente / Auxiliar de Tesorería / Solo consulta) y observa cómo cambian las acciones disponibles.
      </div>

      <Tabs defaultValue="programacion">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="programacion">Programación de pagos</TabsTrigger>
            <TabsTrigger value="pagos">Pagos registrados</TabsTrigger>
          </TabsList>
          {puedeProgramarYEjecutar && (
            <Button
              onClick={() => {
                setFormMontado(true);
                setFormAbierto(true);
              }}
            >
              <Plus />
              Programar pago
            </Button>
          )}
        </div>

        <TabsContent value="programacion" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border bg-muted hover:bg-muted">
                      <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Proveedor</TableHead>
                      <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Factura</TableHead>
                      <TableHead className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Monto</TableHead>
                      <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Fecha</TableHead>
                      <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cuenta</TableHead>
                      <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Estado</TableHead>
                      <TableHead className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide sticky right-0 bg-muted shadow-[-8px_0_8px_-8px_rgba(0,0,0,0.12)]">
                        Acciones
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {programaciones.map((p) => (
                      <TableRow key={p.id} className="border-b border-border hover:bg-primary/10 transition-colors duration-150">
                        <TableCell className="px-4 py-3 font-semibold text-foreground">{p.proveedorNombre}</TableCell>
                        <TableCell className="px-4 py-3 font-mono text-xs text-muted-foreground">
                          {p.facturaNumero}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-right tabular-nums">
                          {p.montoAprobado !== undefined && p.montoAprobado < p.montoProgramado ? (
                            <>
                              <div className="font-bold text-primary">{formatoCOP(p.montoAprobado)}</div>
                              <div className="text-xs text-muted-foreground line-through">
                                {formatoCOP(p.montoProgramado)}
                              </div>
                            </>
                          ) : (
                            <span className="font-semibold text-foreground">{formatoCOP(p.montoProgramado)}</span>
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm text-foreground">{p.fechaProgramada}</TableCell>
                        <TableCell className="px-4 py-3 text-sm text-muted-foreground max-w-40 truncate">
                          {p.cuentaBancaria}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <Badge variant="secondary" className={`${estadoBadgeClase[p.estado]} font-semibold`}>
                            {estadoProgramacionLabel[p.estado]}
                          </Badge>
                          {p.estado === "rechazado" && p.motivoRechazo && (
                            <div className="text-xs text-muted-foreground mt-1 max-w-52">
                              {p.motivoRechazo}
                            </div>
                          )}
                          {p.observacionAprobacion && (
                            <div className="text-xs text-muted-foreground mt-1 max-w-52">
                              <span className="font-medium">Observación: </span>
                              {p.observacionAprobacion}
                              {p.aprobadoPor && (
                                <span className="block text-muted-foreground">
                                  — {p.aprobadoPor}
                                </span>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-right space-x-1 sticky right-0 bg-white border-l border-border shadow-[-8px_0_8px_-8px_rgba(0,0,0,0.12)]">
                          {puedeAprobar && p.estado === "programado" && (
                            <>
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                onClick={() => {
                                  setAprobarMontado(true);
                                  setAprobando(p);
                                }}
                                title="Aprobar"
                              >
                                <Check className="text-success" />
                              </Button>
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                onClick={() => {
                                  setRechazarMontado(true);
                                  setRechazando(p);
                                }}
                                title="Rechazar"
                              >
                                <X className="text-destructive" />
                              </Button>
                            </>
                          )}
                          {puedeProgramarYEjecutar && p.estado === "programado" && (
                            <Button size="icon-sm" variant="ghost" onClick={() => cancelar(p)} title="Cancelar">
                              <Ban className="text-muted-foreground" />
                            </Button>
                          )}
                          {puedeProgramarYEjecutar && p.estado === "aprobado" && (
                            <Button size="sm" variant="outline" onClick={() => ejecutar(p)}>
                              <PlayCircle className="size-4" />
                              Ejecutar
                            </Button>
                          )}
                          {!puedeAprobar && !puedeProgramarYEjecutar && (
                            <span className="text-xs text-muted-foreground">Solo lectura</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pagos" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border bg-muted hover:bg-muted">
                      <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Proveedor</TableHead>
                      <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Factura</TableHead>
                      <TableHead className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Monto</TableHead>
                      <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Fecha</TableHead>
                      <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Método</TableHead>
                      <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cuenta</TableHead>
                      <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Referencia</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagos.map((p) => (
                      <TableRow key={p.id} className="border-b border-border hover:bg-success/10 transition-colors duration-150">
                        <TableCell className="px-4 py-3 font-semibold text-foreground">{p.proveedorNombre}</TableCell>
                        <TableCell className="px-4 py-3 font-mono text-xs text-muted-foreground">
                          {p.facturaNumero}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-right tabular-nums font-bold text-success">{formatoCOP(p.montoPagado)}</TableCell>
                        <TableCell className="px-4 py-3 text-sm text-foreground">{p.fechaPago ?? "—"}</TableCell>
                        <TableCell className="px-4 py-3 text-sm text-foreground">
                          {p.metodoPago ? metodoPagoLabel[p.metodoPago] : "—"}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                          {p.cuentaBancaria ?? "—"}
                        </TableCell>
                        <TableCell className="px-4 py-3 font-mono text-xs text-muted-foreground">
                          {p.referenciaBancaria ?? "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                    {pagos.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="h-32 text-center text-muted-foreground border-b border-border">
                          <div className="flex flex-col items-center gap-2">
                            <Wallet className="size-6" />
                            Todavía no hay pagos registrados.
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {formMontado && (
        <ProgramacionForm
          open={formAbierto}
          onOpenChange={setFormAbierto}
          onSubmit={crearProgramacion}
          facturas={facturas}
        />
      )}
      {rechazarMontado && (
        <RechazarDialog
          open={!!rechazando}
          onOpenChange={(o) => !o && setRechazando(null)}
          onConfirmar={(motivo) => rechazando && rechazar(rechazando, motivo)}
        />
      )}
      {aprobarMontado && (
        <AprobarDialog
          programacion={aprobando}
          onOpenChange={(o) => !o && setAprobando(null)}
          onConfirmar={(monto, observacion) =>
            aprobando && aprobar(aprobando, monto, observacion)
          }
        />
      )}
    </div>
  );
}
