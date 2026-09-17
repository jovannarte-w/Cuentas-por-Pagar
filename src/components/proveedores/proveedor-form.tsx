"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
import {
  ciudadesEjemplo,
  regimenLabel,
  estadoLabel,
  type Proveedor,
} from "@/lib/sample-data/proveedores";

const proveedorSchema = z.object({
  nit: z.string().min(5, "Escribe un NIT o cédula válido"),
  razonSocial: z.string().min(3, "La razón social es obligatoria"),
  nombreComercial: z.string().optional(),
  tipoPersona: z.enum(["natural", "juridica"]),
  regimenTributario: z.enum([
    "responsable_iva",
    "no_responsable",
    "regimen_simple",
    "gran_contribuyente",
  ]),
  ciudad: z.string().min(1, "Selecciona una ciudad"),
  autorretenedorIca: z.boolean(),
  autorretenedorRenta: z.boolean(),
  condicionesPagoDias: z.coerce.number().int().min(0).max(365),
  telefono: z.string().optional(),
  emailContacto: z.string().email("Correo inválido").optional().or(z.literal("")),
  contactoNombre: z.string().optional(),
  estado: z.enum(["activo", "inactivo", "bloqueado"]),
});

export type ProveedorFormValues = z.infer<typeof proveedorSchema>;

const valoresPorDefecto: ProveedorFormValues = {
  nit: "",
  razonSocial: "",
  nombreComercial: "",
  tipoPersona: "juridica",
  regimenTributario: "responsable_iva",
  ciudad: "",
  autorretenedorIca: false,
  autorretenedorRenta: false,
  condicionesPagoDias: 60,
  telefono: "",
  emailContacto: "",
  contactoNombre: "",
  estado: "activo",
};

function proveedorAFormulario(p: Proveedor): ProveedorFormValues {
  return {
    nit: p.nit,
    razonSocial: p.razonSocial,
    nombreComercial: p.nombreComercial ?? "",
    // Los proveedores migrados del Excel no traen datos fiscales: se abren
    // con los valores mas comunes para que el usuario los confirme.
    tipoPersona: p.tipoPersona ?? "juridica",
    regimenTributario: p.regimenTributario ?? "responsable_iva",
    ciudad: p.ciudad ?? "Cali",
    autorretenedorIca: p.autorretenedorIca ?? false,
    autorretenedorRenta: p.autorretenedorRenta ?? false,
    condicionesPagoDias: p.condicionesPagoDias,
    telefono: p.telefono ?? "",
    emailContacto: p.emailContacto ?? "",
    contactoNombre: p.contactoNombre ?? "",
    estado: p.estado,
  };
}

export function ProveedorForm({
  open,
  onOpenChange,
  proveedor,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proveedor?: Proveedor;
  onSubmit: (valores: ProveedorFormValues) => void;
}) {
  const form = useForm<z.input<typeof proveedorSchema>, unknown, ProveedorFormValues>({
    resolver: zodResolver(proveedorSchema),
    defaultValues: valoresPorDefecto,
  });

  useEffect(() => {
    if (open) {
      form.reset(proveedor ? proveedorAFormulario(proveedor) : valoresPorDefecto);
    }
  }, [open, proveedor, form]);

  function manejarEnvio(valores: ProveedorFormValues) {
    onSubmit(valores);
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{proveedor ? "Editar proveedor" : "Nuevo proveedor"}</SheetTitle>
          <SheetDescription>
            {proveedor
              ? `Actualizando ${proveedor.razonSocial}.`
              : "Se guarda solo en esta sesión — todavía no hay base de datos conectada."}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(manejarEnvio)} className="space-y-4 px-4 pb-6">
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="tipoPersona"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de persona</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      items={{ juridica: "Jurídica", natural: "Natural" }}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="juridica">Jurídica</SelectItem>
                        <SelectItem value="natural">Natural</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIT / Cédula</FormLabel>
                    <FormControl>
                      <Input placeholder="900123456-7" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="razonSocial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Razón social</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre legal completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nombreComercial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre comercial (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Como se conoce habitualmente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="regimenTributario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Régimen tributario</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange} items={regimenLabel}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(regimenLabel).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ciudad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ciudad</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ciudadesEjemplo.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
              <div>
                <div className="text-sm font-medium">Autorretenedor de ICA</div>
                <div className="text-xs text-muted-foreground">No aplicar retención de ICA a sus facturas</div>
              </div>
              <FormField
                control={form.control}
                name="autorretenedorIca"
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
              <div>
                <div className="text-sm font-medium">Autorretenedor de renta</div>
                <div className="text-xs text-muted-foreground">No aplicar retención en la fuente</div>
              </div>
              <FormField
                control={form.control}
                name="autorretenedorRenta"
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="condicionesPagoDias"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plazo de pago (días)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value as number} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange} items={estadoLabel}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(estadoLabel).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="contactoNombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de contacto (opcional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono (opcional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emailContacto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo (opcional)</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <SheetFooter className="px-0 pt-2">
              <Button type="submit" className="w-full">
                {proveedor ? "Guardar cambios" : "Crear proveedor"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
