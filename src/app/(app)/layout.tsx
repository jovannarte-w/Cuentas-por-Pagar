import { AppGroupContent } from "./app-group-content";
import { RolDemoProvider } from "@/lib/rol-demo-context";
import { SidebarProvider } from "@/lib/sidebar-context";
import { ProtectedLayout } from "@/components/protected-layout";
import { facturas, proveedores } from "@/lib/datos";

export default function AppGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <RolDemoProvider>
      <ProtectedLayout>
        <SidebarProvider>
          <AppGroupContent totalFacturas={facturas.length} totalProveedores={proveedores.length}>
            {children}
          </AppGroupContent>
        </SidebarProvider>
      </ProtectedLayout>
    </RolDemoProvider>
  );
}
