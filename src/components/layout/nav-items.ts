import type { LucideIcon } from "lucide-react";
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
};

export const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/proveedores", label: "Proveedores", icon: Building2 },
  { href: "/facturas", label: "Facturas", icon: FileText },
  { href: "/pagos", label: "Pagos", icon: Wallet },
  { href: "/tesoreria", label: "Tesorería", icon: Landmark },
  { href: "/reportes", label: "Reportes", icon: BarChart3 },
  { href: "/administracion", label: "Administración", icon: Settings },
];
