-- ============================================================
-- 0004: maestro de proveedores
-- Reemplaza la columna "PROVEEDOR" de texto libre del Excel.
-- ============================================================
create table public.proveedores (
  id uuid primary key default gen_random_uuid(),
  nit text not null,
  digito_verificacion text,
  razon_social text not null,
  nombre_comercial text,
  tipo_persona tipo_persona not null default 'juridica',
  regimen_tributario regimen_tributario not null default 'responsable_iva',
  autorretenedor_ica boolean not null default false,
  autorretenedor_renta boolean not null default false,
  ciudad_id smallint references public.ciudades(id),
  direccion text,
  telefono text,
  email_contacto text,
  contacto_nombre text,
  cuenta_bancaria_default_id uuid references public.cuentas_bancarias(id),
  condiciones_pago_dias int not null default 60,
  estado estado_proveedor not null default 'activo',
  notas text,
  creado_por uuid references public.usuarios(id),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  unique (nit)
);

-- Busqueda difusa de nombre (para detectar proveedores casi-duplicados como
-- "CARLOS JORGE L. CONTRERAS P." vs "LEONARDO CONTRERAS PARADA" antes de crearlos)
create index proveedores_razon_social_trgm on public.proveedores using gin (razon_social gin_trgm_ops);
create index proveedores_nombre_comercial_trgm on public.proveedores using gin (nombre_comercial gin_trgm_ops);

create or replace function public.set_actualizado_en()
returns trigger language plpgsql as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$;

create trigger trg_proveedores_actualizado_en
  before update on public.proveedores
  for each row execute function public.set_actualizado_en();
