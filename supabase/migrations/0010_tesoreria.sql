-- ============================================================
-- 0010: Tesoreria -- prestamos, polizas financiadas y tarjetas
-- empresariales. En el Excel aparecian mezclados al final de cada hoja
-- mensual de Cuentas por Pagar (PRESTAMO VIRTUAL BBVA, POLIZA ASEGURADORA
-- SOLIDARIA, TC BCOLOMBIA...); son deuda financiera de la clinica, no
-- cuentas por pagar a proveedores, y viven en su propio modulo.
--
-- Igual que con facturas (v_facturas_saldo), el saldo NUNCA se guarda
-- como columna editable: se deriva de los movimientos.
-- ============================================================

create type public.tipo_obligacion as enum ('prestamo', 'poliza', 'tarjeta_credito');
create type public.estado_obligacion as enum ('activa', 'cancelada');
create type public.tipo_movimiento_obligacion as enum ('desembolso', 'cargo', 'abono', 'ajuste');

create table public.obligaciones_financieras (
  id uuid primary key default gen_random_uuid(),
  tipo tipo_obligacion not null,
  entidad_financiera text not null,
  titular text,                            -- responsable de la tarjeta empresarial (ej. Diana Ceron)
  numero_referencia text,                  -- numero de credito/poliza/tarjeta, enmascarado
  monto_original numeric(14,2) not null,   -- desembolsado / suma asegurada / cupo aprobado
  tasa_interes numeric(6,3),               -- % efectivo anual, si aplica
  cuota_periodica numeric(14,2),           -- valor de la cuota mensual estimada
  proxima_cuota_fecha date,                -- proxima fecha de cobro, para flujo de caja proyectado
  cuenta_bancaria_id uuid references public.cuentas_bancarias(id),
  fecha_inicio date not null,
  fecha_vencimiento date,
  estado estado_obligacion not null default 'activa',
  notas text,
  creado_por uuid references public.usuarios(id),
  creado_en timestamptz not null default now()
);

create table public.movimientos_obligacion (
  id uuid primary key default gen_random_uuid(),
  obligacion_id uuid not null references public.obligaciones_financieras(id) on delete cascade,
  fecha date not null default current_date,
  tipo tipo_movimiento_obligacion not null,
  monto numeric(14,2) not null check (monto > 0),
  descripcion text,
  registrado_por uuid references public.usuarios(id),
  creado_en timestamptz not null default now()
);

create index movimientos_obligacion_obligacion_idx on public.movimientos_obligacion (obligacion_id);

-- saldo_actual: desembolsos y cargos suman, abonos restan -- calculado
-- en el momento de la consulta, nunca almacenado.
create or replace view public.v_obligaciones_saldo as
select
  o.*,
  coalesce(sum(
    case
      when m.tipo in ('desembolso', 'cargo') then m.monto
      when m.tipo = 'abono' then -m.monto
      when m.tipo = 'ajuste' then m.monto
    end
  ), 0) as saldo_actual,
  case when o.tipo = 'tarjeta_credito'
    then o.monto_original - coalesce(sum(
      case
        when m.tipo in ('desembolso', 'cargo') then m.monto
        when m.tipo = 'abono' then -m.monto
        when m.tipo = 'ajuste' then m.monto
      end
    ), 0)
  end as cupo_disponible
from public.obligaciones_financieras o
left join public.movimientos_obligacion m on m.obligacion_id = o.id
group by o.id;

-- Extiende el flujo de caja proyectado (0008_vistas.sql) sumando las cuotas
-- de obligaciones activas a lo ya programado en programacion_pagos.
create or replace view public.v_flujo_caja_obligaciones as
select
  date_trunc('week', proxima_cuota_fecha)::date as semana,
  sum(cuota_periodica)                          as monto_proyectado,
  count(*)                                      as num_obligaciones
from public.obligaciones_financieras
where estado = 'activa' and proxima_cuota_fecha is not null and cuota_periodica is not null
group by 1
order by 1;

create trigger trg_auditoria_obligaciones_financieras
  after insert or update or delete on public.obligaciones_financieras
  for each row execute function public.fn_auditoria();

create trigger trg_auditoria_movimientos_obligacion
  after insert or update or delete on public.movimientos_obligacion
  for each row execute function public.fn_auditoria();

-- ---- RLS: mismo criterio que proveedores/facturas -- Administrador y
-- Edicion gestionan; solo el Administrador borra. ----
alter table public.obligaciones_financieras enable row level security;
alter table public.movimientos_obligacion enable row level security;

create policy obligaciones_select on public.obligaciones_financieras for select to authenticated
  using (public.auth_rol() is not null);
create policy obligaciones_insert on public.obligaciones_financieras for insert to authenticated
  with check (public.auth_rol() in ('administrador','presidente','auxiliar_tesoreria'));
create policy obligaciones_update on public.obligaciones_financieras for update to authenticated
  using (public.auth_rol() in ('administrador','presidente','auxiliar_tesoreria'));
create policy obligaciones_delete on public.obligaciones_financieras for delete to authenticated
  using (public.auth_rol() = 'administrador');

create policy movimientos_obligacion_select on public.movimientos_obligacion for select to authenticated
  using (public.auth_rol() is not null);
create policy movimientos_obligacion_insert on public.movimientos_obligacion for insert to authenticated
  with check (public.auth_rol() in ('administrador','presidente','auxiliar_tesoreria'));
create policy movimientos_obligacion_delete on public.movimientos_obligacion for delete to authenticated
  using (public.auth_rol() = 'administrador');
