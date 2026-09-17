-- ============================================================
-- 0002: roles y usuarios
-- Roles del negocio (definidos por el cliente):
--   administrador       -- hace todo, incluido gestionar usuarios y sus roles
--   presidente          -- consulta y edita, y APRUEBA los pagos programados
--   auxiliar_tesoreria  -- consulta y edita; programa y ejecuta los pagos aprobados
--   consulta            -- solo lectura
--
-- Separacion de funciones: quien aprueba (Presidente) no ejecuta, y quien
-- ejecuta (Auxiliar) no aprueba. El Administrador es la excepcion.
-- ============================================================
create table public.roles (
  id smallint primary key generated always as identity,
  nombre text not null unique,
  descripcion text not null
);

insert into public.roles (nombre, descripcion) values
  ('administrador', 'Hace todo: gestiona usuarios y sus roles, y puede aprobar y ejecutar pagos.'),
  ('presidente', 'Consulta y edita. Aprueba o rechaza los pagos que programa el Auxiliar de Tesoreria.'),
  ('auxiliar_tesoreria', 'Consulta y edita. Programa los pagos y ejecuta los que ya fueron aprobados.'),
  ('consulta', 'Solo lectura: consulta y exporta informacion, sin poder modificarla.');

-- Perfil de cada usuario autenticado (1:1 con auth.users)
create table public.usuarios (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre_completo text not null,
  email text not null unique,
  rol_id smallint not null references public.roles(id),
  activo boolean not null default true,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

comment on table public.usuarios is 'Perfil de negocio de cada usuario; auth.users guarda las credenciales.';

-- Helper: rol del usuario autenticado actual (usado en las politicas RLS)
create or replace function public.auth_rol()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select r.nombre
  from public.usuarios u
  join public.roles r on r.id = u.rol_id
  where u.id = auth.uid() and u.activo
$$;

create or replace function public.auth_usuario_id()
returns uuid
language sql
stable
as $$
  select auth.uid()
$$;

-- Crea automaticamente el perfil en public.usuarios cuando alguien se registra
-- via Supabase Auth (queda con rol_id nulo hasta que un administrador lo asigne).
create table public.usuarios_pendientes_rol (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  creado_en timestamptz not null default now()
);

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.usuarios_pendientes_rol (id, email) values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();
