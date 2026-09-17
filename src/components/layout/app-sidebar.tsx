"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSidebar } from "@/lib/sidebar-context";
import { navItems } from "./nav-items";

export function AppSidebar({
  totalFacturas,
  totalProveedores,
}: {
  totalFacturas: number;
  totalProveedores: number;
}) {
  const pathname = usePathname();
  const { contraido, setContraido } = useSidebar();

  return (
    <aside className={cn(
      "hidden md:flex md:flex-col md:fixed md:inset-y-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border print:hidden transition-all duration-300",
      contraido ? "md:w-20" : "md:w-60"
    )}>
      <Link
        href="/dashboard"
        className="flex flex-col gap-1 px-4 py-4 border-b border-sidebar-border items-center"
      >
        <div className={cn("w-full h-auto dark:brightness-0 dark:invert transition-all", contraido ? "hidden" : "")}>
          <Image
            src="/logo-cenvalle.png"
            alt="Cenvalle S.A.S. — Centro de Endoscopia del Valle"
            width={960}
            height={269}
            priority
            className="w-full h-auto"
          />
        </div>
        {contraido && (
          <div className="w-8 h-8 flex items-center justify-center">
            <Image
              src="/logo-cenvalle.png"
              alt="Cenvalle"
              width={32}
              height={9}
              className="w-auto h-6"
            />
          </div>
        )}
        <span className={cn("text-[11px] tracking-wide text-sidebar-foreground/60 pl-0.5 transition-all", contraido ? "hidden" : "")}>
          Cuentas por Pagar
        </span>
      </Link>

      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={contraido ? item.label : ""}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors justify-center md:justify-start",
                contraido ? "md:px-2" : "",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span className={cn("transition-all", contraido ? "hidden" : "")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className={cn("px-3 py-3 border-t border-sidebar-border text-[10px] leading-relaxed text-sidebar-foreground/55 text-center transition-all", contraido ? "hidden" : "")}>
        Datos reales de septiembre 2026
        <br />
        {totalFacturas} facturas · {totalProveedores} proveedores
        <br />
        Elaborado por <span className="font-semibold text-sidebar-foreground/75">Jovanna Arteaga</span>
      </div>

      <button
        onClick={() => setContraido(!contraido)}
        className="flex items-center justify-center px-3 py-3 border-t border-sidebar-border text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
        title={contraido ? "Expandir menú" : "Contraer menú"}
      >
        {contraido ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
      </button>
    </aside>
  );
}
