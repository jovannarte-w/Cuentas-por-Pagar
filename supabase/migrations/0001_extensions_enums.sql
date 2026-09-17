-- ============================================================
-- 0001: extensiones y tipos enumerados
-- ============================================================
create extension if not exists "pgcrypto";      -- gen_random_uuid()
create extension if not exists "pg_trgm";        -- busqueda difusa (nombres de proveedor)

create type tipo_persona as enum ('natural', 'juridica');

create type regimen_tributario as enum (
  'responsable_iva',
  'no_responsable',
  'regimen_simple',
  'gran_contribuyente'
);

create type estado_proveedor as enum ('activo', 'inactivo', 'bloqueado');

-- Clasificacion real encontrada al auditar el Excel: no todo lo que se paga a un
-- proveedor llega como "factura electronica" -- ver Notas de Migracion del Excel.
create type tipo_documento_factura as enum (
  'factura',                 -- numeracion de factura electronica (FE-, FEL-, FEV-, etc.)
  'cuenta_cobro',             -- prefijo CC / CA -- persona natural sin obligacion de facturar
  'cotizacion_anticipo',      -- compromiso aun no facturado formalmente
  'sin_numero',
  'otro'
);

create type estado_factura as enum ('pendiente', 'parcial', 'pagada', 'anulada', 'en_disputa');

create type tipo_pago as enum ('abono', 'pago_total', 'cuota_programada', 'nota_credito');
create type metodo_pago as enum ('transferencia', 'cheque', 'efectivo', 'otro');

create type tipo_nota as enum ('credito', 'debito');

create type estado_programacion as enum ('programado', 'aprobado', 'rechazado', 'ejecutado', 'cancelado');

create type entidad_adjunto as enum ('factura', 'pago', 'proveedor');
create type tipo_documento_adjunto as enum (
  'pdf_factura', 'xml_dian', 'soporte_pago', 'rut', 'camara_comercio', 'contrato', 'otro'
);

create type accion_auditoria as enum ('insert', 'update', 'delete');
