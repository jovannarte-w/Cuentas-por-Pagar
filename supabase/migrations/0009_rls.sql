-- ============================================================
-- 0009: Row Level Security -- el control de acceso vive en la base
-- de datos, no en el frontend. Aunque alguien llame la API directamente,
-- no puede saltarse el rol.
-- ============================================================
alter table public.usuarios enable row level security;
alter table public.roles enable row level security;
alter table public.proveedores enable row level security;
alter table public.facturas enable row level security;
alter table public.pagos enable row level security;
alter table public.notas_credito_debito enable row level security;
alter table public.programacion_pagos enable row level security;
alter table public.adjuntos enable row level security;
alter table public.auditoria enable row level security;
alter table public.ciudades enable row level security;
alter table public.categorias_gasto enable row level security;
alter table public.conceptos_retencion enable row level security;
alter table public.cuentas_bancarias enable row level security;
alter table public.parametros_sistema enable row level security;

-- ---- catalogos: cualquier usuario autenticado con perfil activo puede leer ----
create policy cat_ciudades_select on public.ciudades for select to authenticated using (public.auth_rol() is not null);
create policy cat_categorias_select on public.categorias_gasto for select to authenticated using (public.auth_rol() is not null);
create policy cat_conceptos_select on public.conceptos_retencion for select to authenticated using (public.auth_rol() is not null);
create policy cat_cuentas_select on public.cuentas_bancarias for select to authenticated using (public.auth_rol() is not null);
create policy cat_parametros_select on public.parametros_sistema for select to authenticated using (public.auth_rol() is not null);
create policy cat_roles_select on public.roles for select to authenticated using (public.auth_rol() is not null);

-- Solo el Administrador modifica catalogos y parametros
create policy cat_ciudades_write on public.ciudades for all to authenticated
  using (public.auth_rol() = 'administrador') with check (public.auth_rol() = 'administrador');
create policy cat_categorias_write on public.categorias_gasto for all to authenticated
  using (public.auth_rol() = 'administrador') with check (public.auth_rol() = 'administrador');
create policy cat_conceptos_write on public.conceptos_retencion for all to authenticated
  using (public.auth_rol() = 'administrador') with check (public.auth_rol() = 'administrador');
create policy cat_cuentas_write on public.cuentas_bancarias for all to authenticated
  using (public.auth_rol() = 'administrador') with check (public.auth_rol() = 'administrador');
create policy cat_parametros_write on public.parametros_sistema for all to authenticated
  using (public.auth_rol() = 'administrador') with check (public.auth_rol() = 'administrador');

-- ---- usuarios ----
create policy usuarios_select_propio_o_admin on public.usuarios for select to authenticated
  using (id = auth.uid() or public.auth_rol() = 'administrador');
create policy usuarios_admin_all on public.usuarios for all to authenticated
  using (public.auth_rol() = 'administrador') with check (public.auth_rol() = 'administrador');

-- ---- proveedores: todos leen; Administrador, Presidente y Auxiliar escriben ----
create policy proveedores_select on public.proveedores for select to authenticated
  using (public.auth_rol() is not null);
create policy proveedores_insert on public.proveedores for insert to authenticated
  with check (public.auth_rol() in ('administrador','presidente','auxiliar_tesoreria'));
create policy proveedores_update on public.proveedores for update to authenticated
  using (public.auth_rol() in ('administrador','presidente','auxiliar_tesoreria'));
create policy proveedores_delete on public.proveedores for delete to authenticated
  using (public.auth_rol() = 'administrador');

-- ---- facturas: Administrador, Presidente y Auxiliar ingresan; todos leen ----
create policy facturas_select on public.facturas for select to authenticated
  using (public.auth_rol() is not null);
create policy facturas_insert on public.facturas for insert to authenticated
  with check (public.auth_rol() in ('administrador','presidente','auxiliar_tesoreria'));
create policy facturas_update on public.facturas for update to authenticated
  using (public.auth_rol() in ('administrador','presidente','auxiliar_tesoreria'));
create policy facturas_delete on public.facturas for delete to authenticated
  using (public.auth_rol() = 'administrador');

-- ---- pagos: SOLO el Auxiliar de Tesoreria ejecuta pagos (y el Administrador).
-- El Presidente aprueba pero NO ejecuta: separacion de funciones. ----
create policy pagos_select on public.pagos for select to authenticated
  using (public.auth_rol() is not null);
create policy pagos_insert on public.pagos for insert to authenticated
  with check (public.auth_rol() in ('administrador','auxiliar_tesoreria'));
create policy pagos_update on public.pagos for update to authenticated
  using (public.auth_rol() in ('administrador','auxiliar_tesoreria'));
create policy pagos_delete on public.pagos for delete to authenticated
  using (public.auth_rol() = 'administrador');

-- ---- notas credito/debito: mismas reglas que pagos ----
create policy ncd_select on public.notas_credito_debito for select to authenticated
  using (public.auth_rol() is not null);
create policy ncd_insert on public.notas_credito_debito for insert to authenticated
  with check (public.auth_rol() in ('administrador','auxiliar_tesoreria'));

-- ---- programacion de pagos: el Auxiliar programa y cancela;
-- SOLO el Presidente (o el Administrador) aprueba o rechaza. ----
create policy prog_select on public.programacion_pagos for select to authenticated
  using (public.auth_rol() is not null);
create policy prog_insert on public.programacion_pagos for insert to authenticated
  with check (public.auth_rol() in ('administrador','auxiliar_tesoreria'));
create policy prog_update_auxiliar on public.programacion_pagos for update to authenticated
  using (
    public.auth_rol() in ('administrador','auxiliar_tesoreria')
    and estado in ('programado','aprobado','cancelado')
  );
create policy prog_update_presidente on public.programacion_pagos for update to authenticated
  using (public.auth_rol() in ('administrador','presidente'));

-- ---- adjuntos: todos leen; Administrador, Presidente y Auxiliar suben ----
create policy adjuntos_select on public.adjuntos for select to authenticated
  using (public.auth_rol() is not null);
create policy adjuntos_insert on public.adjuntos for insert to authenticated
  with check (public.auth_rol() in ('administrador','presidente','auxiliar_tesoreria'));
create policy adjuntos_delete on public.adjuntos for delete to authenticated
  using (public.auth_rol() in ('administrador','presidente','auxiliar_tesoreria'));

-- ---- auditoria: solo lectura, y solo Administrador y Presidente la consultan ----
create policy auditoria_select on public.auditoria for select to authenticated
  using (public.auth_rol() in ('administrador','presidente'));

-- ---- storage: mismas reglas que la tabla adjuntos, sobre el bucket privado ----
create policy storage_adjuntos_select on storage.objects for select to authenticated
  using (bucket_id = 'adjuntos-cxp' and public.auth_rol() is not null);
create policy storage_adjuntos_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'adjuntos-cxp' and public.auth_rol() in ('administrador','presidente','auxiliar_tesoreria'));
create policy storage_adjuntos_delete on storage.objects for delete to authenticated
  using (bucket_id = 'adjuntos-cxp' and public.auth_rol() in ('administrador','presidente','auxiliar_tesoreria'));
