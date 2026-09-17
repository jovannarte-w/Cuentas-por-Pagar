import { DashboardClient } from "./dashboard-client";
import { facturas, proveedores, kpis, deudaPorProveedor, facturasPorProveedor, resumenMigracion } from "@/lib/datos";

export default function DashboardPage() {
  return (
    <DashboardClient
      kpis={kpis()}
      deudas={deudaPorProveedor()}
      facturasPorProveedor={facturasPorProveedor()}
      resumenMigracion={resumenMigracion}
      totalFacturas={facturas.length}
      totalProveedores={proveedores.length}
    />
  );
}
