/**
 * Usuarios del sistema -- reflejan public.usuarios/roles
 * (supabase/migrations/0002_roles_usuarios.sql).
 *
 * Los nombres son los reales indicados por Cenvalle. Los correos quedan
 * vacios a proposito: se completan al crear las cuentas en Supabase Auth,
 * que es a donde se envia la invitacion.
 *
 * Solo el Administrador puede crear, editar, activar o inactivar usuarios
 * (politica usuarios_admin_all en 0009_rls.sql).
 */

import type { RolDemo } from "@/lib/rol-demo-context";

export type UsuarioSistema = {
  id: string;
  nombreCompleto: string;
  email: string;
  rol: RolDemo;
  activo: boolean;
};

export const usuariosEjemplo: UsuarioSistema[] = [
  {
    id: "u1",
    nombreCompleto: "Administrador del sistema",
    email: "",
    rol: "administrador",
    activo: true,
  },
  {
    id: "u2",
    nombreCompleto: "Carlos Contreras",
    email: "",
    rol: "presidente",
    activo: true,
  },
  {
    id: "u3",
    nombreCompleto: "Jhonatan Sandoval",
    email: "",
    rol: "auxiliar_tesoreria",
    activo: true,
  },
  {
    id: "u4",
    nombreCompleto: "Diana Cerón",
    email: "",
    rol: "consulta",
    activo: true,
  },
];
