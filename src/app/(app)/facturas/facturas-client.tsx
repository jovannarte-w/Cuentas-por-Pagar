"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { Plus, Search, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRolDemo } from "@/lib/rol-demo-context";
import {
  saldoPendiente,
  estadoFactura,
  diasVencimiento,
  tipoDocumentoLabel,
  type Factura,
  type TipoDocumentoFactura,
} from "@/lib/sample-data/facturas";
import { formatoCOP } from "@/lib/sample-data";
import type { FacturaCalculada } from "@/components/facturas/factura-form";

const FacturaForm = dynamic(
  () => import("@/components/facturas/factura-form").then((m) => m.FacturaForm),
  { ssr: false }
);

const estadoBadgeClase: Record<string, string> = {
  pendiente: "bg-muted text-foreground border border-border",
  parcial: "bg-warning/10 text-warning-foreground border border-warning/30",
  pagada: "bg-success/10 text-success border border-success/30",
  anulada: "bg-destructive/10 text-destructive border border-destructive/30",
};
const estadoLabel: Record<string, string> = {
  pendiente: "Pendiente",
  parcial: "Parcial",
  pagada: "Pagada",
  anulada: "Anulada",
};

export function FacturasClient({ facturasIniciales }: { facturasIniciales: Factura[] }) {
  const { permisos } = useRolDemo();
  const [facturas, setFacturas] = useState<Factura[]>(facturasIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<TipoDocumentoFactura | "todos">("todos");
  const [formAbierto, setFormAbierto] = useState(false);
  const [formMontado, setFormMontado] = useState(false);

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return facturas.filter((f) => {
      const coincideTexto =
        !q ||
        f.proveedorNombre.toLowerCase().includes(q) ||
        f.numeroFactura?.toLowerCase().includes(q);
      const coincideTipo = filtroTipo === "todos" || f.tipoDocumento === filtroTipo;
      return coincideTexto && coincideTipo;
    });
  }, [facturas, busqueda, filtroTipo]);

  function registrar(valores: FacturaCalculada) {
    const proveedor = facturas.find((f) => f.proveedorId === valores.proveedorId);
    const nueva: Factura = {
      id: crypto.randomUUID(),
      proveedorId: valores.proveedorId,
      proveedorNombre: proveedor?.proveedorNombre ?? "(proveedor de ejemplo)",
      numeroFactura: valores.numeroFactura || undefined,
      tipoDocumento: valores.tipoDocumento,
      categoria: valores.categoria,
      fechaRecibo: valores.fechaRecibo,
      fechaVencimiento: valores.fechaVencimiento,
      detalle: valores.detalle,
      valorSubtotal: valores.valorSubtotal,
      ivaValor: valores.ivaValor,
      reteFuenteValor: valores.reteFuenteValor,
      reteIcaValor: valores.reteIcaValor,
      totalFactura: valores.totalFactura,
      totalPagado: 0,
      anulada: false,
    };
    setFacturas((prev) => [nueva, ...prev]);
    toast.success(`Factura registrada por ${formatoCOP(valores.totalFactura)}`);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-success/30 bg-success/8 px-4 py-2.5 text-sm">
        <b>420 facturas reales</b> migradas de la hoja 1 SEPTIEMBRE 2026. 120 no traen fecha porque
        la fila del Excel tampoco la tenía; se muestran como <i>sin fecha</i> y quedan fuera del
        cálculo de vencidas. La columna Categoría muestra el Detalle de cada factura.
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por proveedor o número…"
              className="pl-8"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <Select
            value={filtroTipo}
            onValueChange={(v) => setFiltroTipo(v as TipoDocumentoFactura | "todos")}
            items={{ todos: "Todos los tipos", ...tipoDocumentoLabel }}
          >
            <SelectTrigger className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los tipos</SelectItem>
              {(Object.keys(tipoDocumentoLabel) as TipoDocumentoFactura[]).map((v) => (
                <SelectItem key={v} value={v}>
                  {tipoDocumentoLabel[v]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {permisos.puedeEditar && (
          <Button
            onClick={() => {
              setFormMontado(true);
              setFormAbierto(true);
            }}
          >
            <Plus />
            Registrar factura
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border bg-muted hover:bg-muted">
                  <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Proveedor</TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Número</TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tipo</TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Categoría</TableHead>
                  <TableHead className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total</TableHead>
                  <TableHead className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Saldo</TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtradas.map((f) => {
                  const estado = estadoFactura(f);
                  const dias = diasVencimiento(f);
                  const vencida =
                    estado !== "pagada" && estado !== "anulada" && dias !== null && dias < 0;
                  return (
                    <TableRow key={f.id} className="border-b border-border hover:bg-primary/10 transition-colors duration-150">
                      <TableCell className="px-4 py-3 font-semibold text-foreground">{f.proveedorNombre}</TableCell>
                      <TableCell className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {f.numeroFactura ?? "—"}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge variant="outline" className="font-semibold text-xs border-border bg-white text-foreground">
                          {tipoDocumentoLabel[f.tipoDocumento]}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm text-muted-foreground max-w-xs truncate">
                        {f.detalle ?? "Sin detalle"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-right tabular-nums text-foreground">
                        {formatoCOP(f.totalFactura)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-right tabular-nums font-bold text-primary">
                        {formatoCOP(saldoPendiente(f))}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge
                          variant="secondary"
                          className={vencida ? "bg-destructive/10 text-destructive border border-destructive/30 font-semibold" : `${estadoBadgeClase[estado]} font-semibold`}
                        >
                          {vencida && dias !== null
                            ? `Vencida (${Math.abs(dias)}d)`
                            : estadoLabel[estado]}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtradas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground border-b border-border">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="size-6" />
                        No hay facturas que coincidan con la búsqueda.
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {formMontado && (
        <FacturaForm open={formAbierto} onOpenChange={setFormAbierto} onSubmit={registrar} />
      )}
    </div>
  );
}
