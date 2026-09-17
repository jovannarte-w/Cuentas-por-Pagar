import { ProveedoresClient } from "./proveedores-client";
import { proveedores } from "@/lib/datos";

export default function ProveedoresPage() {
  return <ProveedoresClient proveedoresIniciales={proveedores} />;
}
