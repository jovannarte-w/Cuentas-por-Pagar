-- ============================================================
-- 0006: gestion documental (PDF, XML DIAN, soportes) via Supabase Storage
-- ============================================================
create table public.adjuntos (
  id uuid primary key default gen_random_uuid(),
  entidad_tipo entidad_adjunto not null,
  entidad_id uuid not null,
  tipo_documento tipo_documento_adjunto not null default 'otro',
  storage_path text not null,
  nombre_archivo text not null,
  tamano_bytes bigint,
  subido_por uuid references public.usuarios(id),
  creado_en timestamptz not null default now()
);

create index adjuntos_entidad_idx on public.adjuntos (entidad_tipo, entidad_id);

-- Bucket privado para todos los soportes documentales.
insert into storage.buckets (id, name, public)
values ('adjuntos-cxp', 'adjuntos-cxp', false)
on conflict (id) do nothing;
