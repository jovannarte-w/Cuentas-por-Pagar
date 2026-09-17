-- ============================================================
-- 0007: auditoria generica -- un solo mecanismo cubre todas las
-- tablas criticas, sin repetir logica de bitacora en cada modulo.
-- ============================================================
create table public.auditoria (
  id bigint primary key generated always as identity,
  tabla_afectada text not null,
  registro_id text not null,
  accion accion_auditoria not null,
  usuario_id uuid references public.usuarios(id),
  valores_anteriores jsonb,
  valores_nuevos jsonb,
  creado_en timestamptz not null default now()
);

create index auditoria_tabla_registro_idx on public.auditoria (tabla_afectada, registro_id);
create index auditoria_creado_en_idx on public.auditoria (creado_en desc);

create or replace function public.fn_auditoria()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_registro_id text;
begin
  v_registro_id := coalesce((case when tg_op = 'DELETE' then old.id else new.id end)::text, '');

  insert into public.auditoria (tabla_afectada, registro_id, accion, usuario_id, valores_anteriores, valores_nuevos)
  values (
    tg_table_name,
    v_registro_id,
    lower(tg_op)::accion_auditoria,
    auth.uid(),
    case when tg_op in ('UPDATE','DELETE') then to_jsonb(old) else null end,
    case when tg_op in ('UPDATE','INSERT') then to_jsonb(new) else null end
  );

  return coalesce(new, old);
end;
$$;

create trigger trg_auditoria_proveedores
  after insert or update or delete on public.proveedores
  for each row execute function public.fn_auditoria();

create trigger trg_auditoria_facturas
  after insert or update or delete on public.facturas
  for each row execute function public.fn_auditoria();

create trigger trg_auditoria_pagos
  after insert or update or delete on public.pagos
  for each row execute function public.fn_auditoria();

create trigger trg_auditoria_programacion_pagos
  after insert or update or delete on public.programacion_pagos
  for each row execute function public.fn_auditoria();

create trigger trg_auditoria_notas_credito_debito
  after insert or update or delete on public.notas_credito_debito
  for each row execute function public.fn_auditoria();

create trigger trg_auditoria_usuarios
  after insert or update or delete on public.usuarios
  for each row execute function public.fn_auditoria();
