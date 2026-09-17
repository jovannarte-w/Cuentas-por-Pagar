import { FacturasClient } from "./facturas-client";
import { facturas } from "@/lib/datos";

export default function FacturasPage() {
  return <FacturasClient facturasIniciales={facturas} />;
}
