"use client";

import { Fragment, useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarOff,
  ChevronDown,
  ChevronRight,
  Clock,
  Search,
  Wallet,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { DeudaProveedor, FacturaResumen, Kpis } from "@/lib/datos";
import { formatoCOP } from "@/lib/sample-data";

type OrdenDeuda = "saldo" | "nombre" | "facturas" | "antiguedad";

const ordenLabel: Record<OrdenDeuda, string> = {
  saldo: "Mayor saldo pendiente",
  nombre: "Nombre (A-Z)",
  facturas: "Más facturas pendientes",
  antiguedad: "Factura más antigua",
};

const soloConDeudaLabel: Record<string, string> = {
  pendientes: "Solo con saldo pendiente",
  todos: "Todos los proveedores",
};

export function DashboardClient({
  kpis: k,
  deudas,
  facturasPorProveedor,
  resumenMigracion,
  totalFacturas,
  totalProveedores,
}: {
  kpis: Kpis;
  deudas: DeudaProveedor[];
  facturasPorProveedor: Record<string, FacturaResumen[]>;
  resumenMigracion: { hojaOrigen: string };
  totalFacturas: number;
  totalProveedores: number;
}) {
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState<OrdenDeuda>("saldo");
  const [filtro, setFiltro] = useState("pendientes");
  const [expandido, setExpandido] = useState<string | null>(null);

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    let lista = deudas.filter((d) => {
      if (filtro === "pendientes" && d.saldoPendiente <= 0) return false;
      if (!q) return true;
      return (
        d.razonSocial.toLowerCase().includes(q) ||
        d.nit.toLowerCase().includes(q) ||
        d.proveedorId.toLowerCase().includes(q)
      );
    });

    lista = [...lista].sort((a, b) => {
      if (orden === "saldo") return b.saldoPendiente - a.saldoPendiente;
      if (orden === "nombre") return a.razonSocial.localeCompare(b.razonSocial, "es");
      if (orden === "facturas") return b.numFacturasPendientes - a.numFacturasPendientes;
      const fa = a.facturaMasAntigua ?? "9999-12-31";
      const fb = b.facturaMasAntigua ?? "9999-12-31";
      return fa.localeCompare(fb);
    });

    return lista;
  }, [deudas, busqueda, orden, filtro]);

  const totalFiltrado = filtradas.reduce((s, d) => s + d.saldoPendiente, 0);

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-success/30 bg-success/8 px-4 py-2.5 text-sm">
        <b>Datos reales</b> migrados de{" "}
        <span className="font-mono text-xs">{resumenMigracion.hojaOrigen}</span> — {totalFacturas} facturas y{" "}
        {totalProveedores} proveedores del Excel que validamos juntos, más las correcciones confirmadas después
        (pagos que solo estaban anotados como texto, y filas que no eran cuentas por pagar).
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={Wallet}
          label="Total por pagar"
          value={formatoCOP(k.totalPorPagar)}
          detalle={`${k.numFacturasVivas} facturas abiertas`}
        />
        <KpiCard
          icon={AlertTriangle}
          label="Vencido"
          value={formatoCOP(k.totalVencido)}
          detalle={`${k.numVencidas} facturas`}
          tone="danger"
        />
        <KpiCard
          icon={Clock}
          label="Por vencer (7 días)"
          value={formatoCOP(k.porVencer7)}
          detalle={`${k.numPorVencer7} facturas`}
          tone="warning"
        />
        <KpiCard
          icon={CalendarOff}
          label="Sin fecha de pago"
          value={formatoCOP(k.totalSinFecha)}
          detalle={`${k.numSinFecha} facturas del Excel sin fecha`}
          tone="muted"
        />
      </div>

      <Card>
        <CardHeader className="gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-base">Cuánto se le debe a cada proveedor</CardTitle>
            <div className="text-sm">
              <span className="text-muted-foreground">Total filtrado: </span>
              <span className="font-semibold tabular-nums">{formatoCOP(totalFiltrado)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar proveedor por nombre o NIT…"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-8 pr-8"
              />
              {busqueda && (
                <button
                  type="button"
                  onClick={() => setBusqueda("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            <Select value={filtro} onValueChange={(v) => setFiltro(v ?? "pendientes")} items={soloConDeudaLabel}>
              <SelectTrigger className="sm:w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(soloConDeudaLabel).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={orden} onValueChange={(v) => setOrden(v as OrdenDeuda)} items={ordenLabel}>
              <SelectTrigger className="sm:w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(ordenLabel) as OrdenDeuda[]).map((o) => (
                  <SelectItem key={o} value={o}>
                    {ordenLabel[o]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border bg-muted hover:bg-muted">
                  <TableHead className="w-8 px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide" />
                  <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Proveedor
                  </TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    NIT
                  </TableHead>
                  <TableHead className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Facturas
                  </TableHead>
                  <TableHead className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Facturado
                  </TableHead>
                  <TableHead className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Pagado
                  </TableHead>
                  <TableHead className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Saldo pendiente
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtradas.map((d) => {
                  const abierto = expandido === d.proveedorId;
                  return (
                    <Fragment key={d.proveedorId}>
                      <TableRow
                        className="border-b border-border cursor-pointer transition-colors duration-200 hover:bg-primary/10"
                        onClick={() => setExpandido(abierto ? null : d.proveedorId)}
                      >
                        <TableCell className="px-4 py-3">
                          {abierto ? (
                            <ChevronDown className="size-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="size-4 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-3 font-semibold text-foreground">{d.razonSocial}</TableCell>
                        <TableCell className="px-4 py-3 font-mono text-xs text-muted-foreground">
                          {d.nit || "— pendiente"}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-right text-sm text-foreground">
                          {d.numFacturasPendientes}
                          <span className="text-muted-foreground"> / {d.numFacturas}</span>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                          {formatoCOP(d.totalFacturado)}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                          {formatoCOP(d.totalPagado)}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-right tabular-nums font-bold text-primary">
                          {formatoCOP(d.saldoPendiente)}
                        </TableCell>
                      </TableRow>
                      {abierto && (
                        <TableRow>
                          <TableCell colSpan={7} className="bg-muted p-0 border-b border-border">
                            <FacturasDelProveedor filas={facturasPorProveedor[d.proveedorId] ?? []} />
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  );
                })}
                {filtradas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground border-b border-border">
                      Ningún proveedor coincide con "{busqueda}".
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FacturasDelProveedor({ filas: suyas }: { filas: FacturaResumen[] }) {
  return (
    <div className="px-4 py-4">
      <div className="rounded-lg border border-border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border bg-muted hover:bg-muted">
              <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Documento
              </TableHead>
              <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Detalle
              </TableHead>
              <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Recibo
              </TableHead>
              <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Vence
              </TableHead>
              <TableHead className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Total
              </TableHead>
              <TableHead className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Saldo
              </TableHead>
              <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Estado
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suyas.map((f) => {
              const estado = f.estado;
              const dias = f.diasVencimiento;
              return (
                <TableRow key={f.id} className="border-b border-border hover:bg-muted transition-colors duration-150">
                  <TableCell className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {f.numeroFactura}
                  </TableCell>
                  <TableCell className="px-4 py-3 max-w-xs truncate text-xs text-muted-foreground">
                    {f.detalle}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-xs text-muted-foreground">{f.fechaRecibo}</TableCell>
                  <TableCell className="px-4 py-3 text-xs">
                    {f.fechaVencimiento ? (
                      <span className={dias !== null && dias < 0 ? "text-destructive font-semibold" : "text-muted-foreground"}>
                        {f.fechaVencimiento}
                        {dias !== null && dias < 0 && ` (${Math.abs(dias)}d vencido)`}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">sin fecha</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right tabular-nums text-xs text-muted-foreground">
                    {formatoCOP(f.totalFactura)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right tabular-nums text-xs font-semibold text-foreground">
                    {formatoCOP(f.saldo)}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge
                      variant="secondary"
                      className={
                        estado === "pagada"
                          ? "bg-success/10 text-success border border-success/30 font-semibold"
                          : estado === "parcial"
                            ? "bg-warning/10 text-warning-foreground border border-warning/30 font-semibold"
                            : "bg-muted text-foreground border border-border font-semibold"
                      }
                    >
                      {estado}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  detalle,
  tone = "default",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  detalle?: string;
  tone?: "default" | "danger" | "warning" | "muted";
}) {
  const iconBackgroundClasses = {
    default: "bg-primary/10 text-primary",
    danger: "bg-destructive/10 text-destructive",
    warning: "bg-warning/10 text-warning-foreground",
    muted: "bg-muted text-muted-foreground",
  }[tone];

  const valueColorClasses = {
    default: "text-primary",
    danger: "text-destructive",
    warning: "text-warning-foreground",
    muted: "text-foreground",
  }[tone];

  return (
    <div className="rounded-lg border border-border bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            {label}
          </p>
          <p className={`text-xl font-bold tabular-nums mb-1.5 leading-tight ${valueColorClasses}`}>
            {value}
          </p>
          {detalle && <p className="text-xs text-muted-foreground leading-relaxed">{detalle}</p>}
        </div>
        <div className={`flex size-12 shrink-0 items-center justify-center rounded-lg ${iconBackgroundClasses}`}>
          <Icon className="size-6" />
        </div>
      </div>
    </div>
  );
}
