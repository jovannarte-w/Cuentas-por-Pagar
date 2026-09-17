"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search } from "lucide-react";

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

import { saldoPendiente, estadoFactura, type Factura } from "@/lib/sample-data/facturas";
import { cuentasBancariasEjemplo } from "@/lib/sample-data/pagos";
import { formatoCOP } from "@/lib/sample-data";

const schema = z.object({
  facturaId: z.string().min(1, "Selecciona una factura"),
  fechaProgramada: z.string().min(1, "Obligatoria"),
  montoProgramado: z.coerce.number().positive("Debe ser mayor a 0"),
  cuentaBancariaId: z.string().min(1, "Selecciona una cuenta"),
});

type FormInput = z.input<typeof schema>;
export type ProgramacionFormValues = z.output<typeof schema>;

const valoresPorDefecto: FormInput = {
  facturaId: "",
  fechaProgramada: new Date().toISOString().slice(0, 10),
  montoProgramado: 0,
  cuentaBancariaId: "",
};

const cuentaItems = Object.fromEntries(cuentasBancariasEjemplo.map((c) => [c.id, c.nombre]));

const LIMITE_RESULTADOS = 30;

export function ProgramacionForm({
  open,
  onOpenChange,
  onSubmit,
  facturas,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (valores: ProgramacionFormValues & { facturaNumero: string; proveedorNombre: string; cuentaNombre: string }) => void;
  facturas: Factura[];
}) {
  const [busqueda, setBusqueda] = useState("");

  const facturasPendientes = useMemo(
    () => facturas.filter((f) => estadoFactura(f) !== "pagada" && estadoFactura(f) !== "anulada"),
    [facturas]
  );

  const form = useForm<FormInput, unknown, ProgramacionFormValues>({
    resolver: zodResolver(schema),
    defaultValues: valoresPorDefecto,
  });

  useEffect(() => {
    if (open) {
      form.reset(valoresPorDefecto);
      setBusqueda("");
    }
  }, [open, form]);

  const facturaId = useWatch({ control: form.control, name: "facturaId" });
  const factura = facturasPendientes.find((f) => f.id === facturaId);

  useEffect(() => {
    if (factura) form.setValue("montoProgramado", saldoPendiente(factura));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facturaId]);

  const resultados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    const filtradas = !q
      ? facturasPendientes
      : facturasPendientes.filter(
          (f) =>
            f.proveedorNombre.toLowerCase().includes(q) ||
            (f.numeroFactura ?? "").toLowerCase().includes(q)
        );
    return [...filtradas]
      .sort((a, b) => saldoPendiente(b) - saldoPendiente(a))
      .slice(0, LIMITE_RESULTADOS);
  }, [busqueda, facturasPendientes]);

  const totalCoincidencias = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return facturasPendientes.length;
    return facturasPendientes.filter(
      (f) =>
        f.proveedorNombre.toLowerCase().includes(q) ||
        (f.numeroFactura ?? "").toLowerCase().includes(q)
    ).length;
  }, [busqueda, facturasPendientes]);

  function manejarEnvio(valores: ProgramacionFormValues) {
    const cuenta = cuentasBancariasEjemplo.find((c) => c.id === valores.cuentaBancariaId);
    if (factura && valores.montoProgramado > saldoPendiente(factura)) {
      form.setError("montoProgramado", {
        message: `No puede superar el saldo pendiente (${formatoCOP(saldoPendiente(factura))})`,
      });
      return;
    }
    onSubmit({
      ...valores,
      facturaNumero: factura?.numeroFactura ?? "sin número",
      proveedorNombre: factura?.proveedorNombre ?? "",
      cuentaNombre: cuenta?.nombre ?? "",
    });
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Programar pago</SheetTitle>
          <SheetDescription>
            Queda pendiente de aprobación del Administrador antes de poder ejecutarse.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(manejarEnvio)} className="space-y-4 px-4 pb-6">
            <FormField
              control={form.control}
              name="facturaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Factura</FormLabel>

                  {factura ? (
                    <div className="flex items-center justify-between gap-2 rounded-lg border border-primary/40 bg-primary/5 px-3 py-2">
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">
                          {factura.proveedorNombre}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {factura.numeroFactura ?? "sin número"} · Saldo:{" "}
                          {formatoCOP(saldoPendiente(factura))}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => field.onChange("")}
                      >
                        Cambiar
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="relative">
                        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Buscar por proveedor o número de factura…"
                          value={busqueda}
                          onChange={(e) => setBusqueda(e.target.value)}
                          className="pl-8"
                        />
                      </div>

                      <div className="rounded-lg border border-input max-h-60 overflow-y-auto divide-y divide-border">
                        {resultados.length === 0 && (
                          <p className="px-3 py-4 text-sm text-muted-foreground text-center">
                            Ninguna factura pendiente coincide con "{busqueda}".
                          </p>
                        )}
                        {resultados.map((f) => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => field.onChange(f.id)}
                            className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-accent"
                          >
                            <div className="min-w-0">
                              <div className="font-medium truncate">{f.proveedorNombre}</div>
                              <div className="text-xs text-muted-foreground truncate">
                                {f.numeroFactura ?? "sin número"}
                                {f.fechaVencimiento ? ` · vence ${f.fechaVencimiento}` : ""}
                              </div>
                            </div>
                            <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                              {formatoCOP(saldoPendiente(f))}
                            </span>
                          </button>
                        ))}
                      </div>
                      {totalCoincidencias > LIMITE_RESULTADOS && (
                        <p className="text-xs text-muted-foreground">
                          Mostrando {LIMITE_RESULTADOS} de {totalCoincidencias} — sigue escribiendo
                          para acotar la búsqueda.
                        </p>
                      )}
                    </>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fechaProgramada"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha programada</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="montoProgramado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto a pagar</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} value={field.value as number} />
                  </FormControl>
                  {factura && (
                    <p className="text-xs text-muted-foreground">
                      Saldo pendiente de la factura: {formatoCOP(saldoPendiente(factura))}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cuentaBancariaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cuenta de origen</FormLabel>
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

            <SheetFooter className="px-0 pt-2">
              <Button type="submit" className="w-full">
                Enviar a aprobación
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
