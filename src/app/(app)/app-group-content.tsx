"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { useSidebar } from "@/lib/sidebar-context";

export function AppGroupContent({
  children,
  totalFacturas,
  totalProveedores,
}: {
  children: React.ReactNode;
  totalFacturas: number;
  totalProveedores: number;
}) {
  const { contraido } = useSidebar();

  return (
    <div className="min-h-screen">
      <AppSidebar totalFacturas={totalFacturas} totalProveedores={totalProveedores} />
      <div
        className={`flex flex-col min-h-screen print:pl-0 transition-all duration-300 ${
          contraido ? "md:pl-20" : "md:pl-60"
        }`}
      >
        <AppHeader />
        <main className="flex-1 p-4 md:p-6 print:p-0">{children}</main>
      </div>
    </div>
  );
}
