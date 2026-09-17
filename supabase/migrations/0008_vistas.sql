-- ============================================================
-- 0008: vistas calculadas -- el saldo NUNCA se guarda como columna
-- editable (la causa #1 de errores en el Excel); siempre se deriva
-- de facturas + pagos en el momento de la consulta.
-- ============================================================
create or replace view public.v_facturas_saldo as
select
  f.*,
  coalesce(p.total_pagado, 0)                                   as total_pagado,
  coalesce(nc.total_notas_credito, 0)                            as total_notas_credito,
  f.total_factura - coalesce(p.total_pagado, 0) - coalesce(nc.total_notas_credito, 0) as saldo_pendiente,
  case
    when f.anulada then 'anulada'
    when f.total_factura - coalesce(p.total_pagado, 0) - coalesce(nc.total_notas_credito, 0) <= 0 then 'pagada'
    when coalesce(p.total_pagado, 0) > 0 then 'parcial'
    else 'pendiente'
  end::estado_factura as estado,
  (f.fecha_vencimiento - current_date)                           as dias_para_vencer,
  greatest(current_date - f.fecha_vencimiento, 0)                as dias_vencido
from public.facturas f
left join (
  select factura_id, sum(monto_pagado) as total_pagado
  from public.pagos
  group by factura_id
) p on p.factura_id = f.id
left join (
  select factura_id, sum(valor) as total_notas_credito
  from public.notas_credito_debito
  where tipo = 'credito'
  group by factura_id
) nc on nc.factura_id = f.id;

create or replace view public.v_proveedores_resumen as
select
  pr.*,
  count(fs.id)                                              as num_facturas,
  coalesce(sum(fs.total_factura), 0)                         as total_facturado,
  coalesce(sum(fs.saldo_pendiente) filter (where fs.estado <> 'anulada'), 0) as total_pendiente
from public.proveedores pr
left join public.v_facturas_saldo fs on fs.proveedor_id = pr.id
group by pr.id;

create or replace view public.v_dashboard_kpis as
select
  coalesce(sum(saldo_pendiente) filter (where estado in ('pendiente','parcial')), 0)          as total_por_pagar,
  coalesce(sum(saldo_pendiente) filter (where estado in ('pendiente','parcial') and dias_vencido > 0), 0) as total_vencido,
  coalesce(sum(saldo_pendiente) filter (where estado in ('pendiente','parcial') and dias_para_vencer between 0 and 7), 0) as total_por_vencer_7dias,
  count(*) filter (where estado = 'pendiente')     as num_pendientes,
  count(*) filter (where estado = 'parcial')       as num_parciales,
  count(*) filter (where estado = 'pagada')        as num_pagadas,
  count(*) filter (where estado in ('pendiente','parcial') and dias_vencido > 0) as num_vencidas
from public.v_facturas_saldo;

create or replace view public.v_pagos_del_mes as
select
  date_trunc('month', fecha_pago)::date as mes,
  sum(monto_pagado)                     as total_pagado,
  count(*)                              as num_pagos
from public.pagos
group by 1
order by 1 desc;

-- Flujo de caja proyectado: saldo pendiente agrupado por semana de vencimiento,
-- cruzando con lo ya programado en programacion_pagos.
create or replace view public.v_flujo_caja_proyectado as
select
  date_trunc('week', coalesce(pp.fecha_programada, fs.fecha_vencimiento, fs.fecha_recibo))::date as semana,
  sum(fs.saldo_pendiente)  as monto_proyectado,
  count(distinct fs.id)    as num_facturas
from public.v_facturas_saldo fs
left join public.programacion_pagos pp on pp.factura_id = fs.id and pp.estado in ('programado','aprobado')
where fs.estado in ('pendiente', 'parcial')
group by 1
order by 1;
