"use client";

/**
 * Selector de rol SOLO para esta etapa de maqueta -- simula lo que hara
 * Supabase Auth + public.usuarios/roles, para poder probar los permisos
 * sin autenticación real todavía. Se elimina cuando se conecte el backend.
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

import { createContext, useContext, useState, type ReactNode } from "react";

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

const nombrePorRol: Record<RolDemo, string> = {
  administrador: "Administrador del sistema",
  presidente: "Carlos Contreras",
  auxiliar_tesoreria: "Jhonatan Sandoval",
  consulta: "Diana Cerón",
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
  setRol: (r: RolDemo) => void;
  nombre: string;
  permisos: ReturnType<typeof permisosDe>;
};

const RolDemoContext = createContext<RolContextValue | null>(null);

export function RolDemoProvider({ children }: { children: ReactNode }) {
  const [rol, setRol] = useState<RolDemo>("administrador");
  return (
    <RolDemoContext.Provider
      value={{ rol, setRol, nombre: nombrePorRol[rol], permisos: permisosDe(rol) }}
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
