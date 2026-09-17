"use client";

import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { navItems } from "./nav-items";
import { useRolDemo, rolLabel, type RolDemo } from "@/lib/rol-demo-context";
import { useAuth } from "@/lib/auth-context";
import { LogOut } from "lucide-react";

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const titulo = navItems.find((n) => pathname === n.href || pathname.startsWith(n.href + "/"))?.label ?? "Cenvalle";
  const { rol, nombre, setRol } = useRolDemo();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-slate-200 bg-slate-50 px-4 md:px-6 print:hidden">
      <h1 className="text-2xl font-bold text-slate-900">{titulo}</h1>

      <div className="flex items-center gap-4">
        {user?.rol === "administrador" && (
          <Select value={rol} onValueChange={(v) => setRol(v as RolDemo)} items={rolLabel}>
            <SelectTrigger className="hidden sm:inline-flex h-9 text-xs border-slate-200 bg-white text-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(rolLabel) as RolDemo[]).map((r) => (
                <SelectItem key={r} value={r}>
                  {rolLabel[r]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-slate-900">{user?.name || nombre}</div>
            <div className="text-xs text-slate-500">{user?.email}</div>
          </div>
          <Avatar className="size-10">
            <AvatarFallback className="text-xs font-semibold bg-blue-100 text-blue-700">
              {(user?.name || nombre)
                .split(" ")
                .slice(0, 2)
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={handleLogout}
            title="Cerrar sesión"
            className="ml-2"
          >
            <LogOut className="size-4 text-slate-600" />
          </Button>
        </div>
      </div>
    </header>
  );
}
