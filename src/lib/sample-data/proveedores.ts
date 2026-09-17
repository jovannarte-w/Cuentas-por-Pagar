/**
 * DATOS DE EJEMPLO -- reemplazar por consultas reales a Supabase (tabla
 * public.proveedores) cuando se conecte un proyecto. Los nombres son
 * ficticios; la forma de los datos si refleja el esquema real (ver
 * supabase/migrations/0004_proveedores.sql).
 */

export type TipoPersona = "natural" | "juridica";
export type RegimenTributario =
  | "responsable_iva"
  | "no_responsable"
  | "regimen_simple"
  | "gran_contribuyente";
export type EstadoProveedor = "activo" | "inactivo" | "bloqueado";

export type Proveedor = {
  id: string;
  /** Vacio en los 115 proveedores migrados: el Excel nunca guardo el NIT. */
  nit: string;
  razonSocial: string;
  nombreComercial?: string;
  /** Opcionales: datos fiscales que el Excel no tenia y hay que completar. */
  tipoPersona?: TipoPersona;
  regimenTributario?: RegimenTributario;
  autorretenedorIca?: boolean;
  autorretenedorRenta?: boolean;
  ciudad?: string;
  telefono?: string;
  emailContacto?: string;
  contactoNombre?: string;
  condicionesPagoDias: number;
  estado: EstadoProveedor;
};

export const ciudadesEjemplo = [
  "Cali",
  "Bogotá D.C.",
  "Medellín",
  "Barranquilla",
  "Cartagena",
  "Palmira",
  "Yumbo",
];

export const regimenLabel: Record<RegimenTributario, string> = {
  responsable_iva: "Responsable de IVA",
  no_responsable: "No responsable",
  regimen_simple: "Régimen simple",
  gran_contribuyente: "Gran contribuyente",
};

export const estadoLabel: Record<EstadoProveedor, string> = {
  activo: "Activo",
  inactivo: "Inactivo",
  bloqueado: "Bloqueado",
};

export const proveedoresEjemplo: Proveedor[] = [
  {
    id: "p1",
    nit: "900123456-7",
    razonSocial: "Distribuidora Médica del Pacífico SAS",
    nombreComercial: "Dismedpac",
    tipoPersona: "juridica",
    regimenTributario: "responsable_iva",
    autorretenedorIca: true,
    autorretenedorRenta: false,
    ciudad: "Cali",
    telefono: "+57 602 4551200",
    emailContacto: "cartera@dismedpac.com.co",
    contactoNombre: "Jorge Iván Salazar",
    condicionesPagoDias: 60,
    estado: "activo",
  },
  {
    id: "p2",
    nit: "890305112-4",
    razonSocial: "Insumos Quirúrgicos Andina Ltda",
    tipoPersona: "juridica",
    regimenTributario: "responsable_iva",
    autorretenedorIca: false,
    autorretenedorRenta: false,
    ciudad: "Yumbo",
    telefono: "+57 602 6904411",
    emailContacto: "facturacion@iqandina.com",
    condicionesPagoDias: 45,
    estado: "activo",
  },
  {
    id: "p3",
    nit: "16789234",
    razonSocial: "Andrés Felipe Rojas Gómez",
    nombreComercial: "Dr. Andrés Felipe Rojas",
    tipoPersona: "natural",
    regimenTributario: "regimen_simple",
    autorretenedorIca: false,
    autorretenedorRenta: false,
    ciudad: "Cali",
    telefono: "+57 300 6541287",
    condicionesPagoDias: 30,
    estado: "activo",
  },
  {
    id: "p4",
    nit: "901044789-2",
    razonSocial: "Tecnimed Equipos SAS",
    tipoPersona: "juridica",
    regimenTributario: "gran_contribuyente",
    autorretenedorIca: true,
    autorretenedorRenta: true,
    ciudad: "Bogotá D.C.",
    telefono: "+57 601 7458822",
    emailContacto: "cxc@tecnimed.co",
    contactoNombre: "Patricia León",
    condicionesPagoDias: 60,
    estado: "activo",
  },
  {
    id: "p5",
    nit: "805019233-1",
    razonSocial: "Suministros Andina de Colombia SAS",
    tipoPersona: "juridica",
    regimenTributario: "responsable_iva",
    autorretenedorIca: false,
    autorretenedorRenta: false,
    ciudad: "Medellín",
    condicionesPagoDias: 30,
    estado: "activo",
  },
  {
    id: "p6",
    nit: "31456789",
    razonSocial: "Lucía Fernanda Mesa Cárdenas",
    nombreComercial: "Dra. Lucía Fernanda Mesa",
    tipoPersona: "natural",
    regimenTributario: "no_responsable",
    autorretenedorIca: false,
    autorretenedorRenta: false,
    ciudad: "Cali",
    condicionesPagoDias: 30,
    estado: "inactivo",
  },
];
