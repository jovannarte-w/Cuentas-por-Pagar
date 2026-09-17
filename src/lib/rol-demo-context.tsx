"use client";

/**
 * Deriva los permisos directamente de la cuenta autenticada (ver
 * src/lib/auth-context.tsx). El rol puede ser demostrado/modificado en el
 * encabezado para testing, y los cambios se persisten en localStorage.
 *
 * Roles definidos por el cliente:
 *   administrador       -- hace todo, incluido gestionar usuarios y sus roles
 *   presidente          -- consulta y edita, y APRUEBA los pagos programados
 *   auxiliar_tesoreria  -- consulta y edita; programa y ejecuta los pagos aprobados
 *   consulta            -- solo lectura
 *
 * Separacion de funciones: quien aprueba (Presidente) no ejecuta, y quien
 * ejecuta (Auxiliar) no aprueba. El Administrador es la excepcion.
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useAuth, type User } from "./auth-context";

export type RolDemo = "administrador" | "presidente" | "auxiliar_tesoreria" | "consulta";

export const rolLabel: Record<RolDemo, string> = {
  administrador: "Administrador",
  presidente: "Presidente",
  auxiliar_tesoreria: "Auxiliar de Tesorería",
  consulta: "Solo consulta",
};

export const rolDescripcion: Record<RolDemo, string> = {
  administrador: "Hace todo: gestiona usuarios y sus niveles de acceso, y puede aprobar y ejecutar.",
  presidente: "Consulta y edita. Es quien aprueba o rechaza los pagos programados.",
  auxiliar_tesoreria: "Consulta y edita. Programa los pagos y ejecuta los que ya fueron aprobados.",
  consulta: "Solo lectura: puede ver y exportar, no puede modificar nada.",
};

const rolPorAuthRol: Record<User["rol"], RolDemo> = {
  administrador: "administrador",
  presidente: "presidente",
  auxiliar: "auxiliar_tesoreria",
  consulta: "consulta",
};

/** Que puede hacer cada rol. Refleja las politicas RLS de la base de datos. */
export function permisosDe(rol: RolDemo) {
  return {
    /** Crear y editar proveedores, facturas y obligaciones de tesoreria. */
    puedeEditar:
      rol === "administrador" || rol === "presidente" || rol === "auxiliar_tesoreria",
    /** Programar pagos y ejecutar los ya aprobados. */
    puedeProgramarYEjecutar: rol === "administrador" || rol === "auxiliar_tesoreria",
    /** Aprobar o rechazar programaciones de pago. */
    puedeAprobar: rol === "administrador" || rol === "presidente",
    /** Crear y editar usuarios y asignarles su nivel de acceso. */
    puedeAdministrarUsuarios: rol === "administrador",
    soloConsulta: rol === "consulta",
  };
}

type RolContextValue = {
  rol: RolDemo;
  nombre: string;
  permisos: ReturnType<typeof permisosDe>;
  setRol: (rol: RolDemo) => void;
};

const RolDemoContext = createContext<RolContextValue | null>(null);

export function RolDemoProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [rol, setRolState] = useState<RolDemo>("consulta");
  const [mounted, setMounted] = useState(false);

  // Cargar rol del localStorage al montar
  useEffect(() => {
    const savedRol = localStorage.getItem("demo_rol") as RolDemo | null;
    if (savedRol && Object.keys(rolLabel).includes(savedRol)) {
      setRolState(savedRol);
    } else if (user) {
      const authRol = rolPorAuthRol[user.rol];
      setRolState(authRol);
      localStorage.setItem("demo_rol", authRol);
    }
    setMounted(true);
  }, [user]);

  // Sincronizar cambios en localStorage desde otras pestañas
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "demo_rol" && e.newValue) {
        const newRol = e.newValue as RolDemo;
        if (Object.keys(rolLabel).includes(newRol)) {
          setRolState(newRol);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleSetRol = (newRol: RolDemo) => {
    setRolState(newRol);
    localStorage.setItem("demo_rol", newRol);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <RolDemoContext.Provider
      value={{ rol, nombre: user?.name ?? "", permisos: permisosDe(rol), setRol: handleSetRol }}
    >
      {children}
    </RolDemoContext.Provider>
  );
}

export function useRolDemo() {
  const ctx = useContext(RolDemoContext);
  if (!ctx) throw new Error("useRolDemo debe usarse dentro de RolDemoProvider");
  return ctx;
}
