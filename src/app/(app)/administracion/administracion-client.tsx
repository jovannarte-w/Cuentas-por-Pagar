"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { Plus, Pencil, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { rolLabel, rolDescripcion, useRolDemo, type RolDemo } from "@/lib/rol-demo-context";
import { usuariosEjemplo, type UsuarioSistema } from "@/lib/sample-data/administracion";
import type { UsuarioFormValues } from "@/components/administracion/usuario-form";

const UsuarioForm = dynamic(
  () => import("@/components/administracion/usuario-form").then((m) => m.UsuarioForm),
  { ssr: false }
);

const rolBadgeClase: Record<RolDemo, string> = {
  administrador: "bg-primary/10 text-primary",
  presidente: "bg-brand-azul-medio/15 text-brand-azul-medio",
  auxiliar_tesoreria: "bg-brand-verde/15 text-brand-verde",
  consulta: "bg-muted text-muted-foreground",
};

export function AdministracionClient() {
  const { permisos, rol } = useRolDemo();
  const esAdmin = permisos.puedeAdministrarUsuarios;

  const [usuarios, setUsuarios] = useState<UsuarioSistema[]>(() => {
    if (typeof window !== "undefined") {
      const guardados = localStorage.getItem("usuarios_sistema");
      return guardados ? JSON.parse(guardados) : usuariosEjemplo;
    }
    return usuariosEjemplo;
  });
  const [formAbierto, setFormAbierto] = useState(false);
  const [formMontado, setFormMontado] = useState(false);
  const [editando, setEditando] = useState<UsuarioSistema | undefined>();

  function abrirCreacion() {
    setEditando(undefined);
    setFormMontado(true);
    setFormAbierto(true);
  }

  function abrirEdicion(u: UsuarioSistema) {
    setEditando(u);
    setFormMontado(true);
    setFormAbierto(true);
  }

  function guardar(v: UsuarioFormValues) {
    if (editando) {
      setUsuarios((prev) => {
        const actualizado = prev.map((x) => (x.id === editando.id ? { ...x, nombreCompleto: v.nombreCompleto, email: v.email, rol: v.rol } : x));
        localStorage.setItem("usuarios_sistema", JSON.stringify(actualizado));

        // Guardar contraseña si se proporcionó
        if (v.contrasena) {
          const contrasenas = JSON.parse(localStorage.getItem("usuarios_contrasenas") || "{}");
          contrasenas[editando.id] = v.contrasena;
          localStorage.setItem("usuarios_contrasenas", JSON.stringify(contrasenas));
        }

        return actualizado;
      });
      toast.success(`${v.nombreCompleto} actualizado`);
      return;
    }
    const nuevoId = crypto.randomUUID();
    const nuevo: UsuarioSistema = {
      id: nuevoId,
      nombreCompleto: v.nombreCompleto,
      email: v.email,
      rol: v.rol,
      activo: true,
    };
    setUsuarios((prev) => {
      const conNuevo = [nuevo, ...prev];
      localStorage.setItem("usuarios_sistema", JSON.stringify(conNuevo));

      // Guardar contraseña
      if (v.contrasena) {
        const contrasenas = JSON.parse(localStorage.getItem("usuarios_contrasenas") || "{}");
        contrasenas[nuevoId] = v.contrasena;
        localStorage.setItem("usuarios_contrasenas", JSON.stringify(contrasenas));
      }

      return conNuevo;
    });
    toast.success(`Invitación enviada a ${v.email}`);
  }

  function alternarActivo(u: UsuarioSistema) {
    setUsuarios((prev) => {
      const actualizado = prev.map((x) => (x.id === u.id ? { ...x, activo: !x.activo } : x));
      localStorage.setItem("usuarios_sistema", JSON.stringify(actualizado));
      return actualizado;
    });
    toast(u.activo ? `${u.nombreCompleto} inactivado` : `${u.nombreCompleto} activado`);
  }

  const numAdmins = usuarios.filter((u) => u.rol === "administrador" && u.activo).length;

  return (
    <div className="space-y-4">
      {!esAdmin && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2.5 text-sm text-muted-foreground">
          <ShieldAlert className="size-4 shrink-0" />
          Estás viendo Administración como <b>{rolLabel[rol]}</b> — solo el Administrador puede
          crear, editar o cambiar el estado de los usuarios.
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {(Object.keys(rolLabel) as RolDemo[]).map((r) => (
          <Card key={r}>
            <CardContent className="pt-6 space-y-1">
              <Badge variant="secondary" className={rolBadgeClase[r]}>
                {rolLabel[r]}
              </Badge>
              <p className="text-xs text-muted-foreground">{rolDescripcion[r]}</p>
              <p className="text-xs text-muted-foreground/70">
                {usuarios.filter((u) => u.rol === r).length} usuario(s)
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-base">Usuarios del sistema</CardTitle>
          {esAdmin && (
            <Button size="sm" onClick={abrirCreacion}>
              <Plus />
              Crear usuario
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Nivel de acceso</TableHead>
                <TableHead>Estado</TableHead>
                {esAdmin && (
                  <TableHead className="text-right sticky right-0 bg-card shadow-[-8px_0_8px_-8px_rgba(0,0,0,0.12)]">Acciones</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.map((u) => {
                const esUltimoAdmin = u.rol === "administrador" && u.activo && numAdmins === 1;
                return (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.nombreCompleto}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {u.email || <span className="italic">— falta el correo</span>}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={rolBadgeClase[u.rol]}>
                        {rolLabel[u.rol]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          u.activo
                            ? "bg-success/15 text-success"
                            : "bg-destructive/10 text-destructive"
                        }
                      >
                        {u.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    {esAdmin && (
                      <TableCell className="sticky right-0 bg-card shadow-[-8px_0_8px_-8px_rgba(0,0,0,0.12)]">
                        <div className="flex items-center justify-end gap-3">
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => abrirEdicion(u)}
                            title="Editar usuario"
                          >
                            <Pencil />
                          </Button>
                          <Switch
                            checked={u.activo}
                            disabled={esUltimoAdmin}
                            onCheckedChange={() => alternarActivo(u)}
                            aria-label={u.activo ? "Inactivar usuario" : "Activar usuario"}
                          />
                        </div>
                        {esUltimoAdmin && (
                          <div className="text-[11px] text-muted-foreground text-right mt-0.5">
                            único administrador
                          </div>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {formMontado && (
        <UsuarioForm
          open={formAbierto}
          onOpenChange={setFormAbierto}
          onSubmit={guardar}
          usuario={editando}
        />
      )}
    </div>
  );
}
