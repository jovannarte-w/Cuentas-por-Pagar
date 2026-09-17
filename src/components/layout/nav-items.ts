import type { LucideIcon } from "lucide-react";
import type { RolDemo } from "@/lib/rol-demo-context";
import {
  LayoutDashboard,
  Building2,
  FileText,
  Wallet,
  Landmark,
  BarChart3,
  Settings,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  adminOnly?: boolean;
};

const allNavItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/proveedores", label: "Proveedores", icon: Building2 },
  { href: "/facturas", label: "Facturas", icon: FileText },
  { href: "/pagos", label: "Pagos", icon: Wallet },
  { href: "/tesoreria", label: "Tesorería", icon: Landmark },
  { href: "/reportes", label: "Reportes", icon: BarChart3 },
  { href: "/administracion", label: "Administración", icon: Settings, adminOnly: true },
];

export function getNavItems(rol: RolDemo): NavItem[] {
  return allNavItems.filter(item => {
    if (item.adminOnly && rol !== "administrador") {
      return false;
    }
    return true;
  });
}

export const navItems = allNavItems;
