-- ============================================================
-- 0003: tablas parametricas -- reemplazan los porcentajes y tarifas
-- que en el Excel estaban tecleados dentro de cada formula
-- ============================================================
create table public.ciudades (
  id smallint primary key generated always as identity,
  nombre text not null,
  departamento text not null,
  tarifa_ica_por_mil numeric(6,3) not null default 0,
  unique (nombre, departamento)
);

create table public.categorias_gasto (
  id smallint primary key generated always as identity,
  nombre text not null unique,
  tipo text not null default 'general'   -- insumos_medicos | insumos_no_medicos | servicios | honorarios | administrativo
);

insert into public.categorias_gasto (nombre, tipo) values
  ('Insumos medicos', 'insumos_medicos'),
  ('Insumos no medicos', 'insumos_no_medicos'),
  ('Servicios generales', 'servicios'),
  ('Honorarios medicos', 'honorarios'),
  ('Mantenimiento de equipos', 'servicios'),
  ('Administrativo', 'administrativo');

create table public.conceptos_retencion (
  id smallint primary key generated always as identity,
  nombre text not null,
  tipo text not null check (tipo in ('rete_fuente', 'rete_ica', 'rete_iva')),
  porcentaje numeric(6,3) not null,
  base_minima_uvt numeric(10,2) not null default 0,
  aplica_regimen regimen_tributario,       -- null = aplica a todos
  vigente_desde date not null default current_date,
  vigente_hasta date,
  activo boolean not null default true
);

-- Tarifas de referencia; se ajustan desde Administracion sin tocar codigo.
insert into public.conceptos_retencion (nombre, tipo, porcentaje) values
  ('Compras generales', 'rete_fuente', 2.5),
  ('Servicios generales (declarante)', 'rete_fuente', 4),
  ('Servicios generales (no declarante)', 'rete_fuente', 6),
  ('Honorarios y comisiones (persona juridica)', 'rete_fuente', 11),
  ('Honorarios (persona natural, declarante)', 'rete_fuente', 10),
  ('Arrendamientos', 'rete_fuente', 3.5);

create table public.cuentas_bancarias (
  id uuid primary key default gen_random_uuid(),
  banco_nombre text not null,
  numero_cuenta text not null,
  tipo_cuenta text not null default 'corriente',   -- corriente | ahorros
  moneda text not null default 'COP',
  saldo_inicial numeric(14,2) not null default 0,
  activa boolean not null default true,
  creado_en timestamptz not null default now(),
  unique (banco_nombre, numero_cuenta)
);

create table public.parametros_sistema (
  clave text primary key,
  valor text not null,
  descripcion text
);

insert into public.parametros_sistema (clave, valor, descripcion) values
  ('iva_tarifa_general', '19', 'Tarifa general de IVA vigente, en porcentaje'),
  ('condiciones_pago_dias_default', '60', 'Dias de plazo de pago por defecto para proveedores nuevos'),
  ('aprobacion_requerida_desde', '0', 'Monto minimo de pago que requiere aprobacion del Administrador; 0 = todo pago la requiere');
