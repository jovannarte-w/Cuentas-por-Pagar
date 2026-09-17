"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatoCOP } from "@/lib/sample-data";
import type { ProgramacionPago } from "@/lib/sample-data/pagos";

export function AprobarDialog({
  programacion,
  onOpenChange,
  onConfirmar,
}: {
  /** null = cerrado. */
  programacion: ProgramacionPago | null;
  onOpenChange: (open: boolean) => void;
  onConfirmar: (montoAprobado: number, observacion: string) => void;
}) {
  const [monto, setMonto] = useState("");
  const [observacion, setObservacion] = useState("");

  useEffect(() => {
    if (programacion) {
      setMonto(String(programacion.montoProgramado));
      setObservacion("");
    }
  }, [programacion]);

  if (!programacion) return null;

  const montoNumero = Number(monto) || 0;
  const excede = montoNumero > programacion.montoProgramado;
  const invalido = montoNumero <= 0 || excede;
  const esParcial = montoNumero > 0 && montoNumero < programacion.montoProgramado;
  const diferencia = programacion.montoProgramado - montoNumero;

  return (
    <Dialog open={!!programacion} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Aprobar pago</DialogTitle>
          <DialogDescription>
            {programacion.proveedorNombre} — {programacion.facturaNumero}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg bg-muted/50 px-3 py-2 text-sm">
            <span className="text-muted-foreground">Monto programado: </span>
            <span className="font-semibold tabular-nums">
              {formatoCOP(programacion.montoProgramado)}
            </span>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="monto-aprobado">Monto que se aprueba</Label>
            <Input
              id="monto-aprobado"
              type="number"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
            />
            {excede && (
              <p className="text-xs text-destructive">
                No puede superar el monto programado ({formatoCOP(programacion.montoProgramado)}).
              </p>
            )}
            {esParcial && (
              <p className="text-xs text-warning-foreground">
                Aprobación parcial: quedan {formatoCOP(diferencia)} sin aprobar. Explica el motivo
                en las observaciones.
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="observacion-aprobacion">
              Observaciones {esParcial ? "(obligatoria)" : "(opcional)"}
            </Label>
            <Textarea
              id="observacion-aprobacion"
              placeholder="Ej: se aprueba solo el 50% hasta que entreguen el saldo del pedido"
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            disabled={invalido || (esParcial && !observacion.trim())}
            onClick={() => {
              onConfirmar(montoNumero, observacion.trim());
              onOpenChange(false);
            }}
          >
            {esParcial ? "Aprobar por menor valor" : "Aprobar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
