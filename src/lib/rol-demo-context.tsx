"use client";

/**
 * Deriva los permisos directamente de la cuenta autenticada (ver
 * src/lib/auth-context.tsx). Antes existia un selector de rol libre en el
 * encabezado, pensado para probar los permisos antes de tener autenticacion
 * real -- pero dejaba que cualquier cuenta se autoasignara "Presidente" y
 * aprobara pagos, anulando la separacion de funciones. Ahora el rol viene
 * fijo del login.
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

import { createContext, useContext, type ReactNode } from "react";
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
};

const RolDemoContext = createContext<RolContextValue | null>(null);

export function RolDemoProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const rol: RolDemo = user ? rolPorAuthRol[user.rol] : "consulta";

  return (
    <RolDemoContext.Provider
      value={{ rol, nombre: user?.name ?? "", permisos: permisosDe(rol) }}
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
