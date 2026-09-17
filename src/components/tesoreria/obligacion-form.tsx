"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

import { cuentasBancariasEjemplo } from "@/lib/sample-data/pagos";
import { tipoObligacionLabel, type TipoObligacion } from "@/lib/sample-data/tesoreria";

const schema = z.object({
  tipo: z.enum(["prestamo", "poliza", "tarjeta_credito"]),
  entidadFinanciera: z.string().min(1, "Obligatoria"),
  titular: z.string().optional(),
  numeroReferencia: z.string().optional(),
  montoOriginal: z.coerce.number().positive("Debe ser mayor a 0"),
  saldoActual: z.coerce.number().min(0, "No puede ser negativo"),
  tasaInteres: z.coerce.number().min(0).optional(),
  cuotaPeriodica: z.coerce.number().min(0).optional(),
  proximaCuotaFecha: z.string().optional(),
  cuentaBancariaId: z.string().optional(),
  fechaInicio: z.string().min(1, "Obligatoria"),
  fechaVencimiento: z.string().optional(),
  notas: z.string().optional(),
});

type FormInput = z.input<typeof schema>;
export type ObligacionFormValues = z.output<typeof schema>;

const valoresPorDefecto: FormInput = {
  tipo: "prestamo",
  entidadFinanciera: "",
  titular: "",
  numeroReferencia: "",
  montoOriginal: 0,
  saldoActual: 0,
  tasaInteres: undefined,
  cuotaPeriodica: undefined,
  proximaCuotaFecha: "",
  cuentaBancariaId: "",
  fechaInicio: new Date().toISOString().slice(0, 10),
  fechaVencimiento: "",
  notas: "",
};

const cuentaItems = Object.fromEntries(cuentasBancariasEjemplo.map((c) => [c.id, c.nombre]));

export function ObligacionForm({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (valores: ObligacionFormValues & { cuentaNombre?: string }) => void;
}) {
  const form = useForm<FormInput, unknown, ObligacionFormValues>({
    resolver: zodResolver(schema),
    defaultValues: valoresPorDefecto,
  });

  useEffect(() => {
    if (open) form.reset(valoresPorDefecto);
  }, [open, form]);

  const tipo = form.watch("tipo") as TipoObligacion;

  function manejarEnvio(valores: ObligacionFormValues) {
    const cuenta = cuentasBancariasEjemplo.find((c) => c.id === valores.cuentaBancariaId);
    onSubmit({ ...valores, cuentaNombre: cuenta?.nombre });
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Nueva obligación financiera</SheetTitle>
          <SheetDescription>
            Préstamos, pólizas financiadas y tarjetas empresariales — separado de las cuentas por
            pagar a proveedores.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(manejarEnvio)} className="space-y-4 px-4 pb-6">
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange} items={tipoObligacionLabel}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(tipoObligacionLabel).map(([value, label]) => (
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
              name="entidadFinanciera"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entidad financiera</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Bancolombia, BBVA, Aseguradora Solidaria" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {tipo === "tarjeta_credito" && (
              <FormField
                control={form.control}
                name="titular"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titular de la tarjeta</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del responsable" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="numeroReferencia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de referencia</FormLabel>
                  <FormControl>
                    <Input placeholder="Últimos dígitos del crédito/póliza/tarjeta" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="montoOriginal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tipo === "tarjeta_credito" ? "Cupo total" : "Monto original"}</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value as number} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="saldoActual"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tipo === "tarjeta_credito" ? "Saldo usado" : "Saldo actual"}</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value as number} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="tasaInteres"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tasa de interés (% E.A.)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} value={field.value as number} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cuotaPeriodica"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cuota mensual estimada</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value as number} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="proximaCuotaFecha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Próxima cuota (para flujo de caja)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cuentaBancariaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cuenta desde donde se paga</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange} items={cuentaItems}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona una cuenta" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cuentasBancariasEjemplo.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="fechaInicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de inicio</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fechaVencimiento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vencimiento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea rows={2} placeholder="Ej: destino del crédito" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className="px-0 pt-2">
              <Button type="submit" className="w-full">
                Guardar obligación
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
