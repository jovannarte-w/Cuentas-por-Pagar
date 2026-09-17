-- ============================================================
-- 0005: facturas, pagos, notas credito/debito, programacion de pagos
-- Cada factura vive en una unica fila para siempre -- reemplaza el
-- patron del Excel de copiar la factura pendiente al mes siguiente.
-- ============================================================
create table public.facturas (
  id uuid primary key default gen_random_uuid(),
  proveedor_id uuid not null references public.proveedores(id),
  categoria_id smallint references public.categorias_gasto(id),
  numero_factura text,
  tipo_documento tipo_documento_factura not null default 'sin_numero',
  fecha_emision date,
  fecha_recibo date not null default current_date,
  fecha_vencimiento date,
  detalle text,
  valor_subtotal numeric(14,2) not null default 0,
  iva_valor numeric(14,2) not null default 0,
  rete_fuente_valor numeric(14,2) not null default 0,
  rete_ica_valor numeric(14,2) not null default 0,
  total_factura numeric(14,2) not null default 0,
  moneda text not null default 'COP',
  anulada boolean not null default false,
  observaciones text,
  creado_por uuid references public.usuarios(id),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  -- una misma factura de un mismo proveedor no deberia registrarse dos veces
  -- (el hallazgo #1 de la auditoria: 12 facturas duplicadas en septiembre)
  unique (proveedor_id, numero_factura)
);

create index facturas_proveedor_idx on public.facturas (proveedor_id);
create index facturas_fecha_vencimiento_idx on public.facturas (fecha_vencimiento);
create index facturas_tipo_documento_idx on public.facturas (tipo_documento);

create trigger trg_facturas_actualizado_en
  before update on public.facturas
  for each row execute function public.set_actualizado_en();

create table public.pagos (
  id uuid primary key default gen_random_uuid(),
  factura_id uuid not null references public.facturas(id),
  fecha_pago date not null default current_date,
  monto_pagado numeric(14,2) not null check (monto_pagado > 0),
  tipo_pago tipo_pago not null default 'abono',
  metodo_pago metodo_pago not null default 'transferencia',
  cuenta_bancaria_id uuid references public.cuentas_bancarias(id),
  referencia_bancaria text,
  registrado_por uuid references public.usuarios(id),
  creado_en timestamptz not null default now()
);

create index pagos_factura_idx on public.pagos (factura_id);
create index pagos_fecha_idx on public.pagos (fecha_pago);

create table public.notas_credito_debito (
  id uuid primary key default gen_random_uuid(),
  factura_id uuid not null references public.facturas(id),
  tipo tipo_nota not null,
  valor numeric(14,2) not null check (valor > 0),
  motivo text not null,
  creado_por uuid references public.usuarios(id),
  creado_en timestamptz not null default now()
);

create table public.programacion_pagos (
  id uuid primary key default gen_random_uuid(),
  factura_id uuid not null references public.facturas(id),
  fecha_programada date not null,
  monto_programado numeric(14,2) not null check (monto_programado > 0),
  cuenta_bancaria_id uuid references public.cuentas_bancarias(id),
  estado estado_programacion not null default 'programado',
  aprobado_por uuid references public.usuarios(id),
  aprobado_en timestamptz,
  -- El Presidente puede aprobar por un valor menor al programado; si queda
  -- nulo, se aprobo por el monto completo. Nunca puede superar lo programado.
  monto_aprobado numeric(14,2) check (monto_aprobado > 0),
  -- Comentario del Presidente al aprobar (ej. por que aprueba un valor menor).
  observacion_aprobacion text,
  motivo_rechazo text,
  constraint monto_aprobado_no_supera_programado
    check (monto_aprobado is null or monto_aprobado <= monto_programado),
  creado_por uuid references public.usuarios(id),
  creado_en timestamptz not null default now()
);

create index programacion_pagos_factura_idx on public.programacion_pagos (factura_id);
create index programacion_pagos_estado_idx on public.programacion_pagos (estado);

-- Al ejecutar una programacion aprobada, registra el pago real automaticamente
create or replace function public.ejecutar_programacion_pago(p_programacion_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_prog record;
  v_pago_id uuid;
begin
  select * into v_prog from public.programacion_pagos where id = p_programacion_id for update;

  if v_prog is null then
    raise exception 'Programacion de pago % no existe', p_programacion_id;
  end if;
  if v_prog.estado <> 'aprobado' then
    raise exception 'Solo se puede ejecutar una programacion en estado aprobado (actual: %)', v_prog.estado;
  end if;

  -- Se paga lo APROBADO, no lo programado: si el Presidente aprobo un valor
  -- menor, ese es el que se ejecuta.
  insert into public.pagos (factura_id, fecha_pago, monto_pagado, cuenta_bancaria_id, registrado_por, tipo_pago)
  values (
    v_prog.factura_id,
    current_date,
    coalesce(v_prog.monto_aprobado, v_prog.monto_programado),
    v_prog.cuenta_bancaria_id,
    auth.uid(),
    'abono'
  )
  returning id into v_pago_id;

  update public.programacion_pagos set estado = 'ejecutado' where id = p_programacion_id;

  return v_pago_id;
end;
$$;
