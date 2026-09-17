import { PagosClient } from "./pagos-client";
import { pagos, facturas } from "@/lib/datos";

export default function PagosPage() {
  return <PagosClient pagosIniciales={pagos} facturas={facturas} />;
}
