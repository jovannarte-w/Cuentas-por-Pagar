"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function RechazarDialog({
  open,
  onOpenChange,
  onConfirmar,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmar: (motivo: string) => void;
}) {
  const [motivo, setMotivo] = useState("");

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) setMotivo("");
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rechazar programación de pago</DialogTitle>
          <DialogDescription>
            Quien programó el pago verá este motivo y podrá corregir o volver a enviarla.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          placeholder="Ej: falta soporte de recibido a satisfacción"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          rows={3}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            disabled={!motivo.trim()}
            onClick={() => {
              onConfirmar(motivo.trim());
              onOpenChange(false);
              setMotivo("");
            }}
          >
            Rechazar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
