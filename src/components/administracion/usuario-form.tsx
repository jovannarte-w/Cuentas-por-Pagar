"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { rolLabel, rolDescripcion, type RolDemo } from "@/lib/rol-demo-context";
import type { UsuarioSistema } from "@/lib/sample-data/administracion";

const schema = z.object({
  nombreCompleto: z.string().min(1, "Obligatorio"),
  email: z.string().email("Correo inválido"),
  rol: z.enum(["administrador", "presidente", "auxiliar_tesoreria", "consulta"]),
  contrasena: z.string().min(6, "Mínimo 6 caracteres").optional(),
});

export type UsuarioFormValues = z.infer<typeof schema>;

const valoresPorDefecto: UsuarioFormValues = {
  nombreCompleto: "",
  email: "",
  rol: "consulta",
  contrasena: "",
};

export function UsuarioForm({
  open,
  onOpenChange,
  onSubmit,
  usuario,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (valores: UsuarioFormValues) => void;
  /** Cuando viene, el formulario edita ese usuario en vez de crear uno nuevo. */
  usuario?: UsuarioSistema;
}) {
  const editando = !!usuario;

  const form = useForm<UsuarioFormValues>({
    resolver: zodResolver(schema),
    defaultValues: valoresPorDefecto,
  });

  useEffect(() => {
    if (!open) return;
    form.reset(
      usuario
        ? { nombreCompleto: usuario.nombreCompleto, email: usuario.email, rol: usuario.rol }
        : valoresPorDefecto
    );
  }, [open, usuario, form]);

  const rolSeleccionado = form.watch("rol") as RolDemo;

  function manejarEnvio(valores: UsuarioFormValues) {
    onSubmit(valores);
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{editando ? "Editar usuario" : "Crear usuario"}</SheetTitle>
          <SheetDescription>
            {editando
              ? "Cambia el nombre, el correo o el nivel de acceso de este usuario."
              : "Se le enviará una invitación por correo para crear su contraseña."}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(manejarEnvio)} className="space-y-4 px-4 pb-6">
            <FormField
              control={form.control}
              name="nombreCompleto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Ana María Restrepo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="nombre@cenvalle.com.co" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contrasena"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Contraseña
                    {editando && <span className="text-xs text-slate-500 ml-2">(dejar vacío para no cambiar)</span>}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={editando ? "Dejar vacío para mantener actual" : "Mínimo 6 caracteres"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nivel de acceso</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(v) => field.onChange((v ?? "consulta") as RolDemo)}
                    items={rolLabel}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(Object.keys(rolLabel) as RolDemo[]).map((r) => (
                        <SelectItem key={r} value={r}>
                          {rolLabel[r]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {rolDescripcion[rolSeleccionado]}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className="px-0 pt-2">
              <Button type="submit" className="w-full">
                {editando ? "Guardar cambios" : "Crear e invitar"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
