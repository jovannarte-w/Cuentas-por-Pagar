"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { Plus, Search, Pencil, Building2 } from "lucide-react";

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
  regimenLabel,
  estadoLabel,
  type Proveedor,
  type EstadoProveedor,
} from "@/lib/sample-data/proveedores";
import type { ProveedorFormValues } from "@/components/proveedores/proveedor-form";

const ProveedorForm = dynamic(
  () => import("@/components/proveedores/proveedor-form").then((m) => m.ProveedorForm),
  { ssr: false }
);

const estadoBadgeClase: Record<EstadoProveedor, string> = {
  activo: "bg-success/10 text-success border border-success/30",
  inactivo: "bg-muted text-foreground border border-border",
  bloqueado: "bg-destructive/10 text-destructive border border-destructive/30",
};

export function ProveedoresClient({ proveedoresIniciales }: { proveedoresIniciales: Proveedor[] }) {
  const { permisos } = useRolDemo();
  const [proveedores, setProveedores] = useState<Proveedor[]>(proveedoresIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<EstadoProveedor | "todos">("todos");
  const [formAbierto, setFormAbierto] = useState(false);
  const [formMontado, setFormMontado] = useState(false);
  const [proveedorEditando, setProveedorEditando] = useState<Proveedor | undefined>();

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return proveedores.filter((p) => {
      const coincideTexto =
        !q ||
        p.razonSocial.toLowerCase().includes(q) ||
        p.nombreComercial?.toLowerCase().includes(q) ||
        p.nit.includes(q);
      const coincideEstado = filtroEstado === "todos" || p.estado === filtroEstado;
      return coincideTexto && coincideEstado;
    });
  }, [proveedores, busqueda, filtroEstado]);

  function abrirNuevo() {
    setProveedorEditando(undefined);
    setFormMontado(true);
    setFormAbierto(true);
  }

  function abrirEdicion(p: Proveedor) {
    setProveedorEditando(p);
    setFormMontado(true);
    setFormAbierto(true);
  }

  function guardar(valores: ProveedorFormValues) {
    if (proveedorEditando) {
      setProveedores((prev) =>
        prev.map((p) => (p.id === proveedorEditando.id ? { ...p, ...valores } : p))
      );
      toast.success(`${valores.razonSocial} actualizado`);
    } else {
      // Deteccion basica de posible duplicado por NIT o nombre muy similar --
      // en el sistema real esto se apoya en pg_trgm (ver 0004_proveedores.sql).
      const posibleDuplicado = proveedores.find(
        (p) =>
          p.nit.replace(/\D/g, "") === valores.nit.replace(/\D/g, "") ||
          p.razonSocial.toLowerCase() === valores.razonSocial.toLowerCase()
      );
      if (posibleDuplicado) {
        toast.warning(
          `Ya existe un proveedor parecido: "${posibleDuplicado.razonSocial}" (${posibleDuplicado.nit}). Se creó de todas formas — revísalo.`
        );
      }
      const nuevo: Proveedor = { id: crypto.randomUUID(), ...valores };
      setProveedores((prev) => [nuevo, ...prev]);
      toast.success(`${valores.razonSocial} creado`);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm text-primary">
        <b>115 proveedores reales</b> del Excel de septiembre. El NIT, régimen tributario y ciudad aparecen como pendiente porque el Excel no los tenía — la columna PROVEEDOR era solo texto. Edita cada fila con el lápiz para completar la información.
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o NIT…"
              className="pl-8"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <Select
            value={filtroEstado}
            onValueChange={(v) => setFiltroEstado(v as EstadoProveedor | "todos")}
            items={{ todos: "Todos los estados", ...estadoLabel }}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              {Object.entries(estadoLabel).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {permisos.puedeEditar && (
          <Button onClick={abrirNuevo}>
            <Plus />
            Nuevo proveedor
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
                  <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">NIT</TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Régimen</TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Ciudad</TableHead>
                  <TableHead className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Plazo pago</TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Estado</TableHead>
                  <TableHead className="px-4 py-3 w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtrados.map((p) => (
                  <TableRow key={p.id} className="border-b border-border hover:bg-primary/10 transition-colors duration-150">
                    <TableCell className="px-4 py-3">
                      <div className="font-semibold text-foreground">{p.razonSocial}</div>
                      {p.nombreComercial && (
                        <div className="text-xs text-muted-foreground">{p.nombreComercial}</div>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {p.nit || <span className="text-muted-foreground">— pendiente</span>}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-foreground">
                      {p.regimenTributario ? (
                        regimenLabel[p.regimenTributario]
                      ) : (
                        <span className="text-muted-foreground">— pendiente</span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-foreground">
                      {p.ciudad ?? <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right tabular-nums text-sm font-semibold text-foreground">
                      {p.condicionesPagoDias} días
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge variant="secondary" className={`${estadoBadgeClase[p.estado]} font-semibold`}>
                        {estadoLabel[p.estado]}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 sticky right-0 bg-white border-l border-border shadow-[-8px_0_8px_-8px_rgba(0,0,0,0.12)]">
                      {permisos.puedeEditar && (
                        <Button variant="ghost" size="icon-sm" onClick={() => abrirEdicion(p)}>
                          <Pencil className="size-4 text-primary" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filtrados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground border-b border-border">
                      <div className="flex flex-col items-center gap-2">
                        <Building2 className="size-6" />
                        No hay proveedores que coincidan con la búsqueda.
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
        <ProveedorForm
          open={formAbierto}
          onOpenChange={setFormAbierto}
          proveedor={proveedorEditando}
          onSubmit={guardar}
        />
      )}
    </div>
  );
}
