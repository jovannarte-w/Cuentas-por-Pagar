"use client";

import { useMemo, useState } from "react";
import { Download, Printer, FileBarChart, ChevronDown, ChevronUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

import { formatoCOP } from "@/lib/sample-data";
import { exportarCSV, type ColumnaExport } from "@/lib/csv-export";

import { facturas as facturasEjemplo, pagos as pagosEjemplo, proveedores as proveedoresEjemplo, tipoPagoRealLabel } from "@/lib/datos";
import {
  saldoPendiente,
  estadoFactura,
  tipoDocumentoLabel,
  type Factura,
} from "@/lib/sample-data/facturas";
import { cuentasBancariasEjemplo, metodoPagoLabel, type Pago } from "@/lib/sample-data/pagos";
import {
  ciudadesEjemplo,
  regimenLabel,
  estadoLabel as estadoProveedorLabel,
  type Proveedor,
} from "@/lib/sample-data/proveedores";
import { categoriasGastoEjemplo } from "@/lib/sample-data/catalogos";
import {
  obligacionesEjemplo,
  tipoObligacionLabel,
  estadoObligacionLabel,
  cupoDisponible,
  type ObligacionFinanciera,
} from "@/lib/sample-data/tesoreria";

type TipoReporte = "facturas" | "pagos" | "proveedores" | "tesoreria";

const reporteLabel: Record<TipoReporte, string> = {
  facturas: "Facturas",
  pagos: "Pagos",
  proveedores: "Proveedores",
  tesoreria: "Tesorería",
};

const TODOS = "__todos__";

const estadoFacturaBadge: Record<string, string> = {
  pendiente: "bg-muted text-muted-foreground",
  parcial: "bg-warning/20 text-warning-foreground",
  pagada: "bg-primary/10 text-primary",
  anulada: "bg-destructive/10 text-destructive",
};

type Filtros = {
  proveedorId: string;
  categoria: string;
  estadoFactura: string;
  cuentaBancariaId: string;
  ciudad: string;
  regimen: string;
  estadoProveedor: string;
  tipoObligacion: string;
  estadoObligacion: string;
  fechaDesde: string;
  fechaHasta: string;
};

const filtrosVacios: Filtros = {
  proveedorId: TODOS,
  categoria: TODOS,
  estadoFactura: TODOS,
  cuentaBancariaId: TODOS,
  ciudad: TODOS,
  regimen: TODOS,
  estadoProveedor: TODOS,
  tipoObligacion: TODOS,
  estadoObligacion: TODOS,
  fechaDesde: "",
  fechaHasta: "",
};

function enRango(fechaISO: string | undefined, desde: string, hasta: string) {
  // Sin fecha registrada (120 facturas del Excel): solo se excluye si el
  // usuario efectivamente filtro por un rango.
  if (!fechaISO) return !desde && !hasta;
  if (desde && fechaISO < desde) return false;
  if (hasta && fechaISO > hasta) return false;
  return true;
}

export function ReportesClient() {
  const [tipoReporte, setTipoReporte] = useState<TipoReporte>("facturas");
  const [filtros, setFiltros] = useState<Filtros>(filtrosVacios);
  const [filtrosContraidos, setFiltrosContraidos] = useState(false);

  function cambiarTipoReporte(v: string) {
    setTipoReporte(v as TipoReporte);
    setFiltros(filtrosVacios);
  }

  function actualizarFiltro<K extends keyof Filtros>(clave: K, valor: Filtros[K]) {
    setFiltros((prev) => ({ ...prev, [clave]: valor }));
  }

  const facturasFiltradas = useMemo(
    () =>
      facturasEjemplo.filter((f) => {
        if (filtros.proveedorId !== TODOS && f.proveedorId !== filtros.proveedorId) return false;
        if (filtros.categoria !== TODOS && f.categoria !== filtros.categoria) return false;
        if (filtros.estadoFactura !== TODOS && estadoFactura(f) !== filtros.estadoFactura) return false;
        if (!enRango(f.fechaRecibo, filtros.fechaDesde, filtros.fechaHasta)) return false;
        return true;
      }),
    [filtros]
  );

  const pagosFiltrados = useMemo(
    () =>
      pagosEjemplo.filter((p) => {
        if (filtros.proveedorId !== TODOS) {
          const factura = facturasEjemplo.find((f) => f.id === p.facturaId);
          if (!factura || factura.proveedorId !== filtros.proveedorId) return false;
        }
        if (filtros.cuentaBancariaId !== TODOS) {
          const cuenta = cuentasBancariasEjemplo.find((c) => c.id === filtros.cuentaBancariaId);
          if (!cuenta || p.cuentaBancaria !== cuenta.nombre) return false;
        }
        if (!enRango(p.fechaPago, filtros.fechaDesde, filtros.fechaHasta)) return false;
        return true;
      }),
    [filtros]
  );

  const proveedoresFiltrados = useMemo(
    () =>
      proveedoresEjemplo.filter((p) => {
        if (filtros.ciudad !== TODOS && p.ciudad !== filtros.ciudad) return false;
        if (filtros.regimen !== TODOS && p.regimenTributario !== filtros.regimen) return false;
        if (filtros.estadoProveedor !== TODOS && p.estado !== filtros.estadoProveedor) return false;
        return true;
      }),
    [filtros]
  );

  const obligacionesFiltradas = useMemo(
    () =>
      obligacionesEjemplo.filter((o) => {
        if (filtros.tipoObligacion !== TODOS && o.tipo !== filtros.tipoObligacion) return false;
        if (filtros.estadoObligacion !== TODOS && o.estado !== filtros.estadoObligacion) return false;
        return true;
      }),
    [filtros]
  );

  function exportar() {
    const fecha = new Date().toISOString().slice(0, 10);
    if (tipoReporte === "facturas") {
      exportarCSV(`reporte-facturas-${fecha}`, columnasFacturas, facturasFiltradas);
    } else if (tipoReporte === "pagos") {
      exportarCSV(`reporte-pagos-${fecha}`, columnasPagos, pagosFiltrados);
    } else if (tipoReporte === "proveedores") {
      exportarCSV(`reporte-proveedores-${fecha}`, columnasProveedores, proveedoresFiltrados);
    } else {
      exportarCSV(`reporte-tesoreria-${fecha}`, columnasObligaciones, obligacionesFiltradas);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-success/30 bg-success/8 px-4 py-2.5 text-sm print:hidden">
        Reportes sobre los <b>datos reales</b> de septiembre 2026. Los filtros y la exportación a
        CSV/Excel funcionan de verdad: lo que exportes aquí sale con las cifras del Excel migrado.
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Tabs value={tipoReporte} onValueChange={cambiarTipoReporte}>
          <TabsList>
            {(Object.keys(reporteLabel) as TipoReporte[]).map((t) => (
              <TabsTrigger key={t} value={t}>
                {reporteLabel[t]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer />
            Imprimir / PDF
          </Button>
          <Button onClick={exportar}>
            <Download />
            Exportar CSV
          </Button>
        </div>
      </div>

      <Card className="print:hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-sm font-medium text-slate-700">Filtros</CardTitle>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setFiltrosContraidos(!filtrosContraidos)}
            title={filtrosContraidos ? "Expandir filtros" : "Contraer filtros"}
          >
            {filtrosContraidos ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
          </Button>
        </CardHeader>
        <CardContent className={`transition-all duration-200 ${filtrosContraidos ? "max-h-0 overflow-hidden p-0" : "p-6"}`}>
          {tipoReporte === "facturas" && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <CampoSelect
                etiqueta="Proveedor"
                valor={filtros.proveedorId}
                onChange={(v) => actualizarFiltro("proveedorId", v)}
                opciones={proveedoresEjemplo.map((p) => ({ value: p.id, label: p.razonSocial }))}
              />
              <CampoSelect
                etiqueta="Categoría"
                valor={filtros.categoria}
                onChange={(v) => actualizarFiltro("categoria", v)}
                opciones={categoriasGastoEjemplo.map((c) => ({ value: c, label: c }))}
              />
              <CampoSelect
                etiqueta="Estado"
                valor={filtros.estadoFactura}
                onChange={(v) => actualizarFiltro("estadoFactura", v)}
                opciones={[
                  { value: "pendiente", label: "Pendiente" },
                  { value: "parcial", label: "Parcial" },
                  { value: "pagada", label: "Pagada" },
                  { value: "anulada", label: "Anulada" },
                ]}
              />
              <CampoRangoFechas filtros={filtros} actualizarFiltro={actualizarFiltro} etiqueta="Fecha de recibo" />
            </div>
          )}

          {tipoReporte === "pagos" && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <CampoSelect
                etiqueta="Proveedor"
                valor={filtros.proveedorId}
                onChange={(v) => actualizarFiltro("proveedorId", v)}
                opciones={proveedoresEjemplo.map((p) => ({ value: p.id, label: p.razonSocial }))}
              />
              <CampoSelect
                etiqueta="Cuenta bancaria"
                valor={filtros.cuentaBancariaId}
                onChange={(v) => actualizarFiltro("cuentaBancariaId", v)}
                opciones={cuentasBancariasEjemplo.map((c) => ({ value: c.id, label: c.nombre }))}
              />
              <CampoRangoFechas filtros={filtros} actualizarFiltro={actualizarFiltro} etiqueta="Fecha de pago" />
            </div>
          )}

          {tipoReporte === "proveedores" && (
            <div className="grid gap-3 sm:grid-cols-3">
              <CampoSelect
                etiqueta="Ciudad"
                valor={filtros.ciudad}
                onChange={(v) => actualizarFiltro("ciudad", v)}
                opciones={ciudadesEjemplo.map((c) => ({ value: c, label: c }))}
              />
              <CampoSelect
                etiqueta="Régimen tributario"
                valor={filtros.regimen}
                onChange={(v) => actualizarFiltro("regimen", v)}
                opciones={Object.entries(regimenLabel).map(([value, label]) => ({ value, label }))}
              />
              <CampoSelect
                etiqueta="Estado"
                valor={filtros.estadoProveedor}
                onChange={(v) => actualizarFiltro("estadoProveedor", v)}
                opciones={Object.entries(estadoProveedorLabel).map(([value, label]) => ({ value, label }))}
              />
            </div>
          )}

          {tipoReporte === "tesoreria" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <CampoSelect
                etiqueta="Tipo"
                valor={filtros.tipoObligacion}
                onChange={(v) => actualizarFiltro("tipoObligacion", v)}
                opciones={Object.entries(tipoObligacionLabel).map(([value, label]) => ({ value, label }))}
              />
              <CampoSelect
                etiqueta="Estado"
                valor={filtros.estadoObligacion}
                onChange={(v) => actualizarFiltro("estadoObligacion", v)}
                opciones={Object.entries(estadoObligacionLabel).map(([value, label]) => ({ value, label }))}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="hidden print:block">
        <div className="flex items-center gap-2 mb-1">
          <FileBarChart className="size-5" />
          <h2 className="text-lg font-semibold">Reporte de {reporteLabel[tipoReporte]} — Cenvalle</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Generado el {new Date().toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {tipoReporte === "facturas" && <ReporteFacturas filas={facturasFiltradas} />}
      {tipoReporte === "pagos" && <ReportePagos filas={pagosFiltrados} />}
      {tipoReporte === "proveedores" && <ReporteProveedores filas={proveedoresFiltrados} />}
      {tipoReporte === "tesoreria" && <ReporteTesoreria filas={obligacionesFiltradas} />}
    </div>
  );
}

// ---- Campos de filtro reutilizables ----

function CampoSelect({
  etiqueta,
  valor,
  onChange,
  opciones,
}: {
  etiqueta: string;
  valor: string;
  onChange: (v: string) => void;
  opciones: { value: string; label: string }[];
}) {
  const items = { [TODOS]: "Todos", ...Object.fromEntries(opciones.map((o) => [o.value, o.label])) };
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{etiqueta}</Label>
      <Select value={valor} onValueChange={(v) => onChange(v ?? TODOS)} items={items}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={TODOS}>Todos</SelectItem>
          {opciones.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function CampoRangoFechas({
  filtros,
  actualizarFiltro,
  etiqueta,
}: {
  filtros: Filtros;
  actualizarFiltro: <K extends keyof Filtros>(clave: K, valor: Filtros[K]) => void;
  etiqueta: string;
}) {
  return (
    <div className="space-y-1.5 sm:col-span-2 lg:col-span-2">
      <Label className="text-xs text-muted-foreground">{etiqueta}</Label>
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={filtros.fechaDesde}
          onChange={(e) => actualizarFiltro("fechaDesde", e.target.value)}
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        <span className="text-xs text-muted-foreground">a</span>
        <input
          type="date"
          value={filtros.fechaHasta}
          onChange={(e) => actualizarFiltro("fechaHasta", e.target.value)}
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>
    </div>
  );
}

// ---- Reporte: Facturas ----

const columnasFacturas: ColumnaExport<Factura>[] = [
  { header: "Proveedor", accessor: (f) => f.proveedorNombre },
  { header: "Número", accessor: (f) => f.numeroFactura ?? "" },
  { header: "Tipo documento", accessor: (f) => tipoDocumentoLabel[f.tipoDocumento] },
  { header: "Categoría", accessor: (f) => f.categoria ?? "Sin clasificar" },
  { header: "Fecha recibo", accessor: (f) => f.fechaRecibo ?? "" },
  { header: "Fecha vencimiento", accessor: (f) => f.fechaVencimiento ?? "" },
  { header: "Total factura", accessor: (f) => f.totalFactura },
  { header: "Total pagado", accessor: (f) => f.totalPagado },
  { header: "Saldo pendiente", accessor: (f) => saldoPendiente(f) },
  { header: "Estado", accessor: (f) => estadoFactura(f) },
];

function ReporteFacturas({ filas }: { filas: Factura[] }) {
  const totalFacturado = filas.reduce((s, f) => s + f.totalFactura, 0);
  const totalPendiente = filas.reduce((s, f) => s + saldoPendiente(f), 0);

  return (
    <ReporteShell
      resumen={[
        { label: "Facturas", valor: String(filas.length) },
        { label: "Total facturado", valor: formatoCOP(totalFacturado) },
        { label: "Total pendiente", valor: formatoCOP(totalPendiente) },
      ]}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Proveedor</TableHead>
            <TableHead>Documento</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Recibo</TableHead>
            <TableHead>Vence</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Saldo</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filas.map((f) => (
            <TableRow key={f.id}>
              <TableCell className="font-medium">{f.proveedorNombre}</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">
                {f.numeroFactura ?? tipoDocumentoLabel[f.tipoDocumento]}
              </TableCell>
              <TableCell className="text-sm">{f.categoria}</TableCell>
              <TableCell className="text-sm">{f.fechaRecibo}</TableCell>
              <TableCell className="text-sm">{f.fechaVencimiento}</TableCell>
              <TableCell className="text-right tabular-nums">{formatoCOP(f.totalFactura)}</TableCell>
              <TableCell className="text-right tabular-nums">{formatoCOP(saldoPendiente(f))}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={estadoFacturaBadge[estadoFactura(f)]}>
                  {estadoFactura(f)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
          {filas.length === 0 && <FilaVacia colSpan={8} />}
        </TableBody>
      </Table>
    </ReporteShell>
  );
}

// ---- Reporte: Pagos ----

const columnasPagos: ColumnaExport<Pago>[] = [
  { header: "Proveedor", accessor: (p) => p.proveedorNombre },
  { header: "Factura", accessor: (p) => p.facturaNumero },
  { header: "Fecha pago", accessor: (p) => p.fechaPago ?? "" },
  { header: "Monto", accessor: (p) => p.montoPagado },
  {
    header: "Tipo",
    accessor: (p) => (p.tipoPago ? tipoPagoRealLabel[p.tipoPago] : ""),
  },
  { header: "Método", accessor: (p) => (p.metodoPago ? metodoPagoLabel[p.metodoPago] : "") },
  { header: "Cuenta", accessor: (p) => p.cuentaBancaria ?? "" },
  { header: "Referencia", accessor: (p) => p.referenciaBancaria ?? "" },
];

function ReportePagos({ filas }: { filas: Pago[] }) {
  const totalPagado = filas.reduce((s, p) => s + p.montoPagado, 0);

  return (
    <ReporteShell
      resumen={[
        { label: "Pagos", valor: String(filas.length) },
        { label: "Total pagado", valor: formatoCOP(totalPagado) },
      ]}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Proveedor</TableHead>
            <TableHead>Factura</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="text-right">Monto</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Referencia del Excel</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filas.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.proveedorNombre}</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">{p.facturaNumero}</TableCell>
              <TableCell className="text-sm">{p.fechaPago ?? "—"}</TableCell>
              <TableCell className="text-right tabular-nums">{formatoCOP(p.montoPagado)}</TableCell>
              <TableCell className="text-sm">
                {p.tipoPago ? tipoPagoRealLabel[p.tipoPago] : "—"}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {p.referenciaBancaria ?? "—"}
              </TableCell>
            </TableRow>
          ))}
          {filas.length === 0 && <FilaVacia colSpan={6} />}
        </TableBody>
      </Table>
    </ReporteShell>
  );
}

// ---- Reporte: Proveedores ----

const columnasProveedores: ColumnaExport<Proveedor>[] = [
  { header: "Razón social", accessor: (p) => p.razonSocial },
  { header: "NIT", accessor: (p) => p.nit },
  { header: "Ciudad", accessor: (p) => p.ciudad ?? "" },
  {
    header: "Régimen tributario",
    accessor: (p) => (p.regimenTributario ? regimenLabel[p.regimenTributario] : ""),
  },
  { header: "Condición de pago (días)", accessor: (p) => p.condicionesPagoDias },
  { header: "Estado", accessor: (p) => estadoProveedorLabel[p.estado] },
];

function ReporteProveedores({ filas }: { filas: Proveedor[] }) {
  return (
    <ReporteShell resumen={[{ label: "Proveedores", valor: String(filas.length) }]}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Razón social</TableHead>
            <TableHead>NIT</TableHead>
            <TableHead>Ciudad</TableHead>
            <TableHead>Régimen</TableHead>
            <TableHead className="text-right">Plazo</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filas.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.razonSocial}</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">
                {p.nit || "—"}
              </TableCell>
              <TableCell className="text-sm">{p.ciudad ?? "—"}</TableCell>
              <TableCell className="text-sm">
                {p.regimenTributario ? regimenLabel[p.regimenTributario] : "—"}
              </TableCell>
              <TableCell className="text-right text-sm">{p.condicionesPagoDias}d</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={
                    p.estado === "activo"
                      ? "bg-primary/10 text-primary"
                      : p.estado === "bloqueado"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-muted text-muted-foreground"
                  }
                >
                  {estadoProveedorLabel[p.estado]}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
          {filas.length === 0 && <FilaVacia colSpan={6} />}
        </TableBody>
      </Table>
    </ReporteShell>
  );
}

// ---- Reporte: Tesorería ----

const columnasObligaciones: ColumnaExport<ObligacionFinanciera>[] = [
  { header: "Tipo", accessor: (o) => tipoObligacionLabel[o.tipo] },
  { header: "Entidad", accessor: (o) => o.entidadFinanciera },
  { header: "Titular", accessor: (o) => o.titular ?? "" },
  { header: "Monto original / cupo", accessor: (o) => o.montoOriginal },
  { header: "Saldo actual", accessor: (o) => o.saldoActual },
  { header: "Cuota mensual", accessor: (o) => o.cuotaPeriodica ?? "" },
  { header: "Vencimiento", accessor: (o) => o.fechaVencimiento ?? "" },
  { header: "Estado", accessor: (o) => estadoObligacionLabel[o.estado] },
];

function ReporteTesoreria({ filas }: { filas: ObligacionFinanciera[] }) {
  const totalSaldo = filas.reduce((s, o) => s + o.saldoActual, 0);

  return (
    <ReporteShell
      resumen={[
        { label: "Obligaciones", valor: String(filas.length) },
        { label: "Saldo total", valor: formatoCOP(totalSaldo) },
      ]}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead>Entidad / Titular</TableHead>
            <TableHead className="text-right">Saldo</TableHead>
            <TableHead className="text-right">Cuota</TableHead>
            <TableHead>Vencimiento</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filas.map((o) => {
            const disponible = cupoDisponible(o);
            return (
              <TableRow key={o.id}>
                <TableCell className="text-sm">{tipoObligacionLabel[o.tipo]}</TableCell>
                <TableCell>
                  <div className="font-medium">{o.entidadFinanciera}</div>
                  <div className="text-xs text-muted-foreground">{o.titular ?? o.numeroReferencia ?? "—"}</div>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatoCOP(o.saldoActual)}
                  {disponible !== undefined && (
                    <div className="text-xs text-muted-foreground">Disp: {formatoCOP(disponible)}</div>
                  )}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {o.cuotaPeriodica ? formatoCOP(o.cuotaPeriodica) : "—"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{o.fechaVencimiento ?? "—"}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={o.estado === "activa" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}
                  >
                    {estadoObligacionLabel[o.estado]}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
          {filas.length === 0 && <FilaVacia colSpan={6} />}
        </TableBody>
      </Table>
    </ReporteShell>
  );
}

// ---- Compartidos ----

function ReporteShell({
  resumen,
  children,
}: {
  resumen: { label: string; valor: string }[];
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="print:hidden">
        <div className="flex flex-wrap gap-x-6 gap-y-1">
          {resumen.map((r) => (
            <div key={r.label} className="text-sm">
              <span className="text-muted-foreground">{r.label}: </span>
              <span className="font-semibold tabular-nums">{r.valor}</span>
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-0 print:p-0">{children}</CardContent>
    </Card>
  );
}

function FilaVacia({ colSpan }: { colSpan: number }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-24 text-center text-muted-foreground">
        Ningún registro coincide con estos filtros.
      </TableCell>
    </TableRow>
  );
}
