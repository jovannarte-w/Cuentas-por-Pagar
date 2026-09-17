"use client";

import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
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

import { proveedoresEjemplo } from "@/lib/sample-data/proveedores";
import {
  categoriasGastoEjemplo,
  conceptosRetencionEjemplo,
  tarifaIcaPorMilPorCiudad,
  ivaOpciones,
} from "@/lib/sample-data/catalogos";
import { tipoDocumentoLabel, type TipoDocumentoFactura } from "@/lib/sample-data/facturas";
import { formatoCOP } from "@/lib/sample-data";

// Select (Base UI) no infiere la etiqueta del item seleccionado por si solo
// como lo hacia Radix -- se le pasa "items" (valor -> etiqueta) explicitamente.
const proveedorItems = Object.fromEntries(proveedoresEjemplo.map((p) => [p.id, p.razonSocial]));
const conceptoRetencionItems = Object.fromEntries(
  conceptosRetencionEjemplo.map((c) => [c.id, c.nombre])
);
const ivaItems = Object.fromEntries(ivaOpciones.map((v) => [String(v), `${v}%`]));

const facturaSchema = z.object({
  proveedorId: z.string().min(1, "Selecciona un proveedor"),
  tipoDocumento: z.enum(["factura", "cuenta_cobro", "cotizacion_anticipo", "sin_numero", "otro"]),
  numeroFactura: z.string().optional(),
  categoria: z.string().min(1, "Selecciona una categoría"),
  fechaRecibo: z.string().min(1, "Obligatoria"),
  fechaVencimiento: z.string().min(1, "Obligatoria"),
  detalle: z.string().optional(),
  valorSubtotal: z.coerce.number().min(0, "Debe ser mayor o igual a 0"),
  ivaPorcentaje: z.coerce.number(),
  conceptoRetencionId: z.string(),
  aplicaReteIca: z.boolean(),
});

type FacturaFormInput = z.input<typeof facturaSchema>;
export type FacturaFormValues = z.output<typeof facturaSchema>;

const valoresPorDefecto: FacturaFormInput = {
  proveedorId: "",
  tipoDocumento: "factura",
  numeroFactura: "",
  categoria: "",
  fechaRecibo: new Date().toISOString().slice(0, 10),
  fechaVencimiento: "",
  detalle: "",
  valorSubtotal: 0,
  ivaPorcentaje: 19,
  conceptoRetencionId: "ninguna",
  aplicaReteIca: true,
};

export type FacturaCalculada = FacturaFormValues & {
  ivaValor: number;
  reteFuenteValor: number;
  reteIcaValor: number;
  totalFactura: number;
};

export function FacturaForm({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (valores: FacturaCalculada) => void;
}) {
  const form = useForm<FacturaFormInput, unknown, FacturaFormValues>({
    resolver: zodResolver(facturaSchema),
    defaultValues: valoresPorDefecto,
  });

  useEffect(() => {
    if (open) form.reset(valoresPorDefecto);
  }, [open, form]);

  const proveedorId = useWatch({ control: form.control, name: "proveedorId" });
  const valorSubtotal = useWatch({ control: form.control, name: "valorSubtotal" }) || 0;
  const ivaPorcentaje = useWatch({ control: form.control, name: "ivaPorcentaje" });
  const conceptoRetencionId = useWatch({ control: form.control, name: "conceptoRetencionId" });
  const aplicaReteIca = useWatch({ control: form.control, name: "aplicaReteIca" });
  const fechaRecibo = useWatch({ control: form.control, name: "fechaRecibo" });

  const proveedor = proveedoresEjemplo.find((p) => p.id === proveedorId);

  // Fecha de vencimiento sugerida = fecha de recibo + condiciones de pago del
  // proveedor. Se autocompleta al elegir el proveedor, pero sigue siendo editable.
  useEffect(() => {
    if (proveedor && fechaRecibo) {
      const d = new Date(fechaRecibo);
      d.setDate(d.getDate() + proveedor.condicionesPagoDias);
      form.setValue("fechaVencimiento", d.toISOString().slice(0, 10));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proveedorId]);

  const calculo = useMemo(() => {
    const subtotal = Number(valorSubtotal) || 0;
    const iva = Math.round((subtotal * (Number(ivaPorcentaje) || 0)) / 100);
    const concepto = conceptosRetencionEjemplo.find((c) => c.id === conceptoRetencionId);
    const reteFuente = Math.round((subtotal * (concepto?.porcentaje ?? 0)) / 100);
    const tarifaIca = proveedor?.ciudad ? tarifaIcaPorMilPorCiudad[proveedor.ciudad] ?? 0 : 0;
    const reteIca = aplicaReteIca && !proveedor?.autorretenedorIca
      ? Math.round((subtotal * tarifaIca) / 1000)
      : 0;
    const total = subtotal + iva - reteFuente - reteIca;
    return { subtotal, iva, reteFuente, reteIca, total, tarifaIca };
  }, [valorSubtotal, ivaPorcentaje, conceptoRetencionId, aplicaReteIca, proveedor]);

  function manejarEnvio(valores: FacturaFormValues) {
    onSubmit({
      ...valores,
      ivaValor: calculo.iva,
      reteFuenteValor: calculo.reteFuente,
      reteIcaValor: calculo.reteIca,
      totalFactura: calculo.total,
    });
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Registrar factura</SheetTitle>
          <SheetDescription>
            El total se calcula solo — nunca se escribe a mano (la causa #1 de errores en el Excel).
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(manejarEnvio)} className="space-y-4 px-4 pb-6">
            <FormField
              control={form.control}
              name="proveedorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proveedor</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange} items={proveedorItems}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona un proveedor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {proveedoresEjemplo.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.razonSocial}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {proveedor?.autorretenedorIca && (
                    <p className="text-xs text-muted-foreground">
                      Autorretenedor de ICA — no se le aplica retención de ICA.
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="tipoDocumento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de documento</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange} items={tipoDocumentoLabel}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(Object.keys(tipoDocumentoLabel) as TipoDocumentoFactura[]).map((v) => (
                          <SelectItem key={v} value={v}>
                            {tipoDocumentoLabel[v]}
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
                name="numeroFactura"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="FE-1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="categoria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoriasGastoEjemplo.map((c) => (
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

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="fechaRecibo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de recibo</FormLabel>
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
                    <FormLabel>Fecha de vencimiento</FormLabel>
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
              name="detalle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detalle (opcional)</FormLabel>
                  <FormControl>
                    <Textarea rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <FormField
              control={form.control}
              name="valorSubtotal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor subtotal (antes de impuestos)</FormLabel>
                  <FormControl>
                    <Input type="number" step="1" {...field} value={field.value as number} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="ivaPorcentaje"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IVA</FormLabel>
                    <Select
                      value={String(field.value)}
                      onValueChange={(v) => field.onChange(Number(v))}
                      items={ivaItems}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ivaOpciones.map((v) => (
                          <SelectItem key={v} value={String(v)}>
                            {v}%
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="conceptoRetencionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Retención en la fuente</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange} items={conceptoRetencionItems}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {conceptosRetencionEjemplo.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.nombre} {c.porcentaje > 0 ? `(${c.porcentaje}%)` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            {proveedor && !proveedor.autorretenedorIca && calculo.tarifaIca > 0 && (
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={aplicaReteIca}
                  onChange={(e) => form.setValue("aplicaReteIca", e.target.checked)}
                  className="size-4"
                />
                Aplicar retención de ICA de {proveedor.ciudad} ({calculo.tarifaIca}‰)
              </label>
            )}

            <Separator />

            <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-1.5 text-sm">
              <Fila label="Subtotal" valor={calculo.subtotal} />
              <Fila label={`IVA (${ivaPorcentaje}%)`} valor={calculo.iva} />
              <Fila label="Retención en la fuente" valor={-calculo.reteFuente} />
              <Fila label="Retención de ICA" valor={-calculo.reteIca} />
              <Separator className="my-1.5" />
              <div className="flex justify-between font-semibold text-base">
                <span>Total a pagar</span>
                <span className="tabular-nums">{formatoCOP(calculo.total)}</span>
              </div>
              <p className="text-xs text-muted-foreground pt-1">
                Calculado automáticamente — no es un campo editable.
              </p>
            </div>

            <SheetFooter className="px-0 pt-2">
              <Button type="submit" className="w-full">
                Registrar factura
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

function Fila({ label, valor }: { label: string; valor: number }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span className="tabular-nums">{formatoCOP(valor)}</span>
    </div>
  );
}
