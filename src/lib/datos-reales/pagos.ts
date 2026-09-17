/**
 * DATOS REALES -- generados desde "CUENTAS POR PAGAR - Nueva Estructura
 * (Septiembre 2026 vigente).xlsx", el archivo que validamos juntos a partir
 * de la hoja "1 SEPTIEMBRE 2026" del Excel original.
 *
 * 104 pagos y abonos extraidos de las filas "ABONO 1/2",
 * "SALDO FINAL" y cuotas del Excel original. No traen fecha ni cuenta bancaria
 * estructurada: el Excel solo guardaba un texto libre tipo "x bcolombia 12 junio/26",
 * que se conserva como referencia.
 *
 * NO editar a mano: se regenera desde el Excel. Al conectar Supabase, estas
 * mismas filas se cargan a las tablas reales.
 */

export type TipoPagoReal = "abono" | "saldo_final_declarado" | "cuota_programada";

export const tipoPagoRealLabel: Record<TipoPagoReal, string> = {
  abono: "Abono",
  saldo_final_declarado: "Saldo final (declarado en Excel)",
  cuota_programada: "Cuota programada",
};

export type PagoReal = {
  id: string;
  facturaId: string;
  facturaNumero: string;
  proveedorNombre: string;
  tipoPago: TipoPagoReal;
  montoPagado: number;
  referenciaBancaria?: string;
  filaOrigen: number;
};

export const pagosReales: PagoReal[] = [
  {
    "id": "PAG-00001",
    "facturaId": "FAC-00001",
    "facturaNumero": "sin número",
    "proveedorNombre": "TM MEDICAS SAS",
    "tipoPago": "abono",
    "montoPagado": 5774852,
    "referenciaBancaria": "x bcolombia pse 12 junio/26",
    "filaOrigen": 9
  },
  {
    "id": "PAG-00002",
    "facturaId": "FAC-00001",
    "facturaNumero": "sin número",
    "proveedorNombre": "TM MEDICAS SAS",
    "tipoPago": "abono",
    "montoPagado": 2956962,
    "referenciaBancaria": "x bcolombia 03 julio 2026",
    "filaOrigen": 10
  },
  {
    "id": "PAG-00003",
    "facturaId": "FAC-00001",
    "facturaNumero": "sin número",
    "proveedorNombre": "TM MEDICAS SAS",
    "tipoPago": "saldo_final_declarado",
    "montoPagado": 2043038,
    "filaOrigen": 11
  },
  {
    "id": "PAG-00004",
    "facturaId": "FAC-00005",
    "facturaNumero": "FEL-19704",
    "proveedorNombre": "DISTRIMEDICAS DAGO SAS",
    "tipoPago": "abono",
    "montoPagado": 5706908,
    "referenciaBancaria": "x bancolombia 10 abril/26",
    "filaOrigen": 17
  },
  {
    "id": "PAG-00005",
    "facturaId": "FAC-00005",
    "facturaNumero": "FEL-19704",
    "proveedorNombre": "DISTRIMEDICAS DAGO SAS",
    "tipoPago": "abono",
    "montoPagado": 5000000,
    "referenciaBancaria": "x bcolombia 20 mayo 2026",
    "filaOrigen": 18
  },
  {
    "id": "PAG-00006",
    "facturaId": "FAC-00005",
    "facturaNumero": "FEL-19704",
    "proveedorNombre": "DISTRIMEDICAS DAGO SAS",
    "tipoPago": "abono",
    "montoPagado": 2500000,
    "filaOrigen": 19
  },
  {
    "id": "PAG-00007",
    "facturaId": "FAC-00005",
    "facturaNumero": "FEL-19704",
    "proveedorNombre": "DISTRIMEDICAS DAGO SAS",
    "tipoPago": "abono",
    "montoPagado": 2500000,
    "filaOrigen": 20
  },
  {
    "id": "PAG-00008",
    "facturaId": "FAC-00005",
    "facturaNumero": "FEL-19704",
    "proveedorNombre": "DISTRIMEDICAS DAGO SAS",
    "tipoPago": "saldo_final_declarado",
    "montoPagado": 5000000,
    "filaOrigen": 21
  },
  {
    "id": "PAG-00009",
    "facturaId": "FAC-00035",
    "facturaNumero": "FEIN-2696",
    "proveedorNombre": "INNOVID SAS",
    "tipoPago": "abono",
    "montoPagado": 3320000,
    "referenciaBancaria": "x bcolombia 20 mayo 2026",
    "filaOrigen": 73
  },
  {
    "id": "PAG-00010",
    "facturaId": "FAC-00035",
    "facturaNumero": "FEIN-2696",
    "proveedorNombre": "INNOVID SAS",
    "tipoPago": "abono",
    "montoPagado": 3000000,
    "filaOrigen": 74
  },
  {
    "id": "PAG-00011",
    "facturaId": "FAC-00035",
    "facturaNumero": "FEIN-2696",
    "proveedorNombre": "INNOVID SAS",
    "tipoPago": "abono",
    "montoPagado": 3000000,
    "filaOrigen": 75
  },
  {
    "id": "PAG-00012",
    "facturaId": "FAC-00042",
    "facturaNumero": "FE-5366",
    "proveedorNombre": "DISPROMEDICAS SAS",
    "tipoPago": "abono",
    "montoPagado": 3288994,
    "filaOrigen": 92
  },
  {
    "id": "PAG-00013",
    "facturaId": "FAC-00042",
    "facturaNumero": "FE-5366",
    "proveedorNombre": "DISPROMEDICAS SAS",
    "tipoPago": "saldo_final_declarado",
    "montoPagado": 2000000,
    "filaOrigen": 93
  },
  {
    "id": "PAG-00014",
    "facturaId": "FAC-00056",
    "facturaNumero": "anticipo",
    "proveedorNombre": "SILVIA PATRICIA JAIMES ESCOBAR",
    "tipoPago": "abono",
    "montoPagado": 50000000,
    "filaOrigen": 140
  },
  {
    "id": "PAG-00015",
    "facturaId": "FAC-00058",
    "facturaNumero": "sin número",
    "proveedorNombre": "0.4",
    "tipoPago": "abono",
    "montoPagado": 3000000,
    "referenciaBancaria": "x bancolombia 28 agosto/26",
    "filaOrigen": 149
  },
  {
    "id": "PAG-00016",
    "facturaId": "FAC-00100",
    "facturaNumero": "COTIZACION",
    "proveedorNombre": "JULIO CESAR HURTADO",
    "tipoPago": "abono",
    "montoPagado": 5340000,
    "referenciaBancaria": "x bcolombia 22 mayo 2026",
    "filaOrigen": 216
  },
  {
    "id": "PAG-00017",
    "facturaId": "FAC-00100",
    "facturaNumero": "COTIZACION",
    "proveedorNombre": "JULIO CESAR HURTADO",
    "tipoPago": "saldo_final_declarado",
    "montoPagado": 3400000,
    "filaOrigen": 217
  },
  {
    "id": "PAG-00018",
    "facturaId": "FAC-00102",
    "facturaNumero": "CC N°. 425",
    "proveedorNombre": "JULIO CESAR HURTADO",
    "tipoPago": "abono",
    "montoPagado": 1000000,
    "referenciaBancaria": "x bcolombia a julio cesar el 28 de junio/26, se anexa al chat soporte se causa 31 de julio",
    "filaOrigen": 221
  },
  {
    "id": "PAG-00019",
    "facturaId": "FAC-00143",
    "facturaNumero": "COTIZACION",
    "proveedorNombre": "Mario Alberto Salazar Giraldo",
    "tipoPago": "abono",
    "montoPagado": 1378512,
    "referenciaBancaria": "x bancolombia 12 agosto/26",
    "filaOrigen": 303
  },
  {
    "id": "PAG-00020",
    "facturaId": "FAC-00155",
    "facturaNumero": "OFERTA ECONOMICA",
    "proveedorNombre": "ESTRATEGIA & GESTION LTDA",
    "tipoPago": "abono",
    "montoPagado": 2000000,
    "referenciaBancaria": "x bcolombia 4 diciembre/25",
    "filaOrigen": 428
  },
  {
    "id": "PAG-00021",
    "facturaId": "FAC-00155",
    "facturaNumero": "OFERTA ECONOMICA",
    "proveedorNombre": "ESTRATEGIA & GESTION LTDA",
    "tipoPago": "abono",
    "montoPagado": 2000000,
    "referenciaBancaria": "x bcolombia 20 mayo 2026 | revisar",
    "filaOrigen": 429
  },
  {
    "id": "PAG-00022",
    "facturaId": "FAC-00155",
    "facturaNumero": "OFERTA ECONOMICA",
    "proveedorNombre": "ESTRATEGIA & GESTION LTDA",
    "tipoPago": "abono",
    "montoPagado": 2000000,
    "filaOrigen": 430
  },
  {
    "id": "PAG-00023",
    "facturaId": "FAC-00155",
    "facturaNumero": "OFERTA ECONOMICA",
    "proveedorNombre": "ESTRATEGIA & GESTION LTDA",
    "tipoPago": "abono",
    "montoPagado": 2000000,
    "filaOrigen": 431
  },
  {
    "id": "PAG-00024",
    "facturaId": "FAC-00155",
    "facturaNumero": "OFERTA ECONOMICA",
    "proveedorNombre": "ESTRATEGIA & GESTION LTDA",
    "tipoPago": "abono",
    "montoPagado": 2000000,
    "filaOrigen": 432
  },
  {
    "id": "PAG-00025",
    "facturaId": "FAC-00155",
    "facturaNumero": "OFERTA ECONOMICA",
    "proveedorNombre": "ESTRATEGIA & GESTION LTDA",
    "tipoPago": "saldo_final_declarado",
    "montoPagado": 3766548,
    "filaOrigen": 433
  },
  {
    "id": "PAG-00026",
    "facturaId": "FAC-00165",
    "facturaNumero": "CONTRATO No. 077",
    "proveedorNombre": "INVERMEDICA S.A.S",
    "tipoPago": "abono",
    "montoPagado": 3280830,
    "referenciaBancaria": "x bancolombia 08 septiembre/25",
    "filaOrigen": 462
  },
  {
    "id": "PAG-00027",
    "facturaId": "FAC-00165",
    "facturaNumero": "CONTRATO No. 077",
    "proveedorNombre": "INVERMEDICA S.A.S",
    "tipoPago": "abono",
    "montoPagado": 2398590,
    "referenciaBancaria": "x bcolombia 20 mayo 2026",
    "filaOrigen": 463
  },
  {
    "id": "PAG-00028",
    "facturaId": "FAC-00165",
    "facturaNumero": "CONTRATO No. 077",
    "proveedorNombre": "INVERMEDICA S.A.S",
    "tipoPago": "abono",
    "montoPagado": 2398590,
    "filaOrigen": 464
  },
  {
    "id": "PAG-00029",
    "facturaId": "FAC-00165",
    "facturaNumero": "CONTRATO No. 077",
    "proveedorNombre": "INVERMEDICA S.A.S",
    "tipoPago": "saldo_final_declarado",
    "montoPagado": 2398590,
    "filaOrigen": 465
  },
  {
    "id": "PAG-00030",
    "facturaId": "FAC-00168",
    "facturaNumero": "FES-239",
    "proveedorNombre": "LABORATORIO CLINICO DE CITOLOGIA Y PATOLOGIA SAS",
    "tipoPago": "abono",
    "montoPagado": 4939874,
    "filaOrigen": 484
  },
  {
    "id": "PAG-00031",
    "facturaId": "FAC-00168",
    "facturaNumero": "FES-239",
    "proveedorNombre": "LABORATORIO CLINICO DE CITOLOGIA Y PATOLOGIA SAS",
    "tipoPago": "saldo_final_declarado",
    "montoPagado": 5000000,
    "filaOrigen": 485
  },
  {
    "id": "PAG-00032",
    "facturaId": "FAC-00209",
    "facturaNumero": "FELE-191",
    "proveedorNombre": "DRA CARIDAD MORA GASTRO",
    "tipoPago": "abono",
    "montoPagado": 1963170,
    "filaOrigen": 543
  },
  {
    "id": "PAG-00033",
    "facturaId": "FAC-00209",
    "facturaNumero": "FELE-191",
    "proveedorNombre": "DRA CARIDAD MORA GASTRO",
    "tipoPago": "saldo_final_declarado",
    "montoPagado": 2000000,
    "filaOrigen": 544
  },
  {
    "id": "PAG-00034",
    "facturaId": "FAC-00227",
    "facturaNumero": "FE-105",
    "proveedorNombre": "DR. CARLOS AUGUSTO JARAMILLO RUIZ",
    "tipoPago": "abono",
    "montoPagado": 280000,
    "referenciaBancaria": "x bcolombia 16 junio/25",
    "filaOrigen": 570
  },
  {
    "id": "PAG-00035",
    "facturaId": "FAC-00313",
    "facturaNumero": "FCE-47",
    "proveedorNombre": "FENIX CONSULTORES EMPRESARIALES S.A.S",
    "tipoPago": "abono",
    "montoPagado": 1085588,
    "referenciaBancaria": "x bcolombia 13 mayo 2026",
    "filaOrigen": 742
  },
  {
    "id": "PAG-00036",
    "facturaId": "FAC-00313",
    "facturaNumero": "FCE-47",
    "proveedorNombre": "FENIX CONSULTORES EMPRESARIALES S.A.S",
    "tipoPago": "abono",
    "montoPagado": 1000000,
    "referenciaBancaria": "x bcolombia 12 junio 2026",
    "filaOrigen": 743
  },
  {
    "id": "PAG-00037",
    "facturaId": "FAC-00313",
    "facturaNumero": "FCE-47",
    "proveedorNombre": "FENIX CONSULTORES EMPRESARIALES S.A.S",
    "tipoPago": "abono",
    "montoPagado": 1000000,
    "filaOrigen": 744
  },
  {
    "id": "PAG-00038",
    "facturaId": "FAC-00313",
    "facturaNumero": "FCE-47",
    "proveedorNombre": "FENIX CONSULTORES EMPRESARIALES S.A.S",
    "tipoPago": "abono",
    "montoPagado": 1000000,
    "filaOrigen": 745
  },
  {
    "id": "PAG-00039",
    "facturaId": "FAC-00326",
    "facturaNumero": "PSE",
    "proveedorNombre": "MUNICIPIO S. CALI",
    "tipoPago": "abono",
    "montoPagado": 3909831,
    "referenciaBancaria": "x debito automatico 24 abril/24",
    "filaOrigen": 995
  },
  {
    "id": "PAG-00040",
    "facturaId": "FAC-00326",
    "facturaNumero": "PSE",
    "proveedorNombre": "MUNICIPIO S. CALI",
    "tipoPago": "saldo_final_declarado",
    "montoPagado": 3755798,
    "referenciaBancaria": "x bbva debito automatico 29 ABR/24",
    "filaOrigen": 996
  },
  {
    "id": "PAG-00041",
    "facturaId": "FAC-00326",
    "facturaNumero": "PSE",
    "proveedorNombre": "MUNICIPIO S. CALI",
    "tipoPago": "abono",
    "montoPagado": 6000000,
    "referenciaBancaria": "x efectivo 19 julio/24",
    "filaOrigen": 1000
  },
  {
    "id": "PAG-00042",
    "facturaId": "FAC-00326",
    "facturaNumero": "PSE",
    "proveedorNombre": "MUNICIPIO S. CALI",
    "tipoPago": "saldo_final_declarado",
    "montoPagado": 1507735,
    "referenciaBancaria": "x efectivo 24 julio/24",
    "filaOrigen": 1001
  },
  {
    "id": "PAG-00043",
    "facturaId": "FAC-00326",
    "facturaNumero": "PSE",
    "proveedorNombre": "MUNICIPIO S. CALI",
    "tipoPago": "abono",
    "montoPagado": 3538844,
    "referenciaBancaria": "x bbva debito automatico el 9 julio 2026",
    "filaOrigen": 1101
  },
  {
    "id": "PAG-00044",
    "facturaId": "FAC-00326",
    "facturaNumero": "PSE",
    "proveedorNombre": "MUNICIPIO S. CALI",
    "tipoPago": "abono",
    "montoPagado": 13907819,
    "referenciaBancaria": "x bbva debito automatico el 10 julio 2026",
    "filaOrigen": 1102
  },
  {
    "id": "PAG-00045",
    "facturaId": "FAC-00326",
    "facturaNumero": "PSE",
    "proveedorNombre": "MUNICIPIO S. CALI",
    "tipoPago": "saldo_final_declarado",
    "montoPagado": 2408027,
    "referenciaBancaria": "x bbva debito automatico el 15 julio 2026",
    "filaOrigen": 1103
  },
  {
    "id": "PAG-00046",
    "facturaId": "FAC-00327",
    "facturaNumero": "CUPO ACTUAL",
    "proveedorNombre": "TARJETA",
    "tipoPago": "saldo_final_declarado",
    "montoPagado": 8716084,
    "filaOrigen": 1200
  },
  {
    "id": "PAG-00047",
    "facturaId": "FAC-00328",
    "facturaNumero": "1636720.16",
    "proveedorNombre": "BANCOLOMBIA FONDO DE INVERSION",
    "tipoPago": "saldo_final_declarado",
    "montoPagado": 5394098,
    "filaOrigen": 1202
  },
  {
    "id": "PAG-00048",
    "facturaId": "FAC-00149",
    "facturaNumero": "Cotiz-C-1-169",
    "proveedorNombre": "ENDOCOL SAS",
    "tipoPago": "cuota_programada",
    "montoPagado": 8000000,
    "filaOrigen": 334
  },
  {
    "id": "PAG-00049",
    "facturaId": "FAC-00149",
    "facturaNumero": "Cotiz-C-1-169",
    "proveedorNombre": "ENDOCOL SAS",
    "tipoPago": "cuota_programada",
    "montoPagado": 2775000,
    "filaOrigen": 335
  },
  {
    "id": "PAG-00050",
    "facturaId": "FAC-00149",
    "facturaNumero": "Cotiz-C-1-169",
    "proveedorNombre": "ENDOCOL SAS",
    "tipoPago": "cuota_programada",
    "montoPagado": 2000000,
    "filaOrigen": 336
  },
  {
    "id": "PAG-00051",
    "facturaId": "FAC-00149",
    "facturaNumero": "Cotiz-C-1-169",
    "proveedorNombre": "ENDOCOL SAS",
    "tipoPago": "cuota_programada",
    "montoPagado": 2000000,
    "filaOrigen": 337
  },
  {
    "id": "PAG-00052",
    "facturaId": "FAC-00149",
    "facturaNumero": "Cotiz-C-1-169",
    "proveedorNombre": "ENDOCOL SAS",
    "tipoPago": "cuota_programada",
    "montoPagado": 2000000,
    "filaOrigen": 338
  },
  {
    "id": "PAG-00053",
    "facturaId": "FAC-00149",
    "facturaNumero": "Cotiz-C-1-169",
    "proveedorNombre": "ENDOCOL SAS",
    "tipoPago": "cuota_programada",
    "montoPagado": 2000000,
    "filaOrigen": 339
  },
  {
    "id": "PAG-00054",
    "facturaId": "FAC-00149",
    "facturaNumero": "Cotiz-C-1-169",
    "proveedorNombre": "ENDOCOL SAS",
    "tipoPago": "cuota_programada",
    "montoPagado": 2000000,
    "filaOrigen": 340
  },
  {
    "id": "PAG-00055",
    "facturaId": "FAC-00149",
    "facturaNumero": "Cotiz-C-1-169",
    "proveedorNombre": "ENDOCOL SAS",
    "tipoPago": "cuota_programada",
    "montoPagado": 2000000,
    "filaOrigen": 341
  },
  {
    "id": "PAG-00056",
    "facturaId": "FAC-00149",
    "facturaNumero": "Cotiz-C-1-169",
    "proveedorNombre": "ENDOCOL SAS",
    "tipoPago": "cuota_programada",
    "montoPagado": 2000000,
    "filaOrigen": 342
  },
  {
    "id": "PAG-00057",
    "facturaId": "FAC-00149",
    "facturaNumero": "Cotiz-C-1-169",
    "proveedorNombre": "ENDOCOL SAS",
    "tipoPago": "cuota_programada",
    "montoPagado": 2000000,
    "filaOrigen": 343
  },
  {
    "id": "PAG-00058",
    "facturaId": "FAC-00149",
    "facturaNumero": "Cotiz-C-1-169",
    "proveedorNombre": "ENDOCOL SAS",
    "tipoPago": "cuota_programada",
    "montoPagado": 2000000,
    "filaOrigen": 344
  },
  {
    "id": "PAG-00059",
    "facturaId": "FAC-00149",
    "facturaNumero": "Cotiz-C-1-169",
    "proveedorNombre": "ENDOCOL SAS",
    "tipoPago": "cuota_programada",
    "montoPagado": 2000000,
    "filaOrigen": 345
  },
  {
    "id": "PAG-00060",
    "facturaId": "FAC-00149",
    "facturaNumero": "Cotiz-C-1-169",
    "proveedorNombre": "ENDOCOL SAS",
    "tipoPago": "cuota_programada",
    "montoPagado": 2000000,
    "filaOrigen": 346
  },
  {
    "id": "PAG-00061",
    "facturaId": "FAC-00149",
    "facturaNumero": "Cotiz-C-1-169",
    "proveedorNombre": "ENDOCOL SAS",
    "tipoPago": "cuota_programada",
    "montoPagado": 2000000,
    "filaOrigen": 347
  },
  {
    "id": "PAG-00062",
    "facturaId": "FAC-00149",
    "facturaNumero": "Cotiz-C-1-169",
    "proveedorNombre": "ENDOCOL SAS",
    "tipoPago": "cuota_programada",
    "montoPagado": 2000000,
    "filaOrigen": 348
  },
  {
    "id": "PAG-00063",
    "facturaId": "FAC-00149",
    "facturaNumero": "Cotiz-C-1-169",
    "proveedorNombre": "ENDOCOL SAS",
    "tipoPago": "cuota_programada",
    "montoPagado": 2000000,
    "filaOrigen": 349
  },
  {
    "id": "PAG-00064",
    "facturaId": "FAC-00149",
    "facturaNumero": "Cotiz-C-1-169",
    "proveedorNombre": "ENDOCOL SAS",
    "tipoPago": "cuota_programada",
    "montoPagado": 2000000,
    "filaOrigen": 350
  },
  {
    "id": "PAG-00065",
    "facturaId": "FAC-00288",
    "facturaNumero": "FE-60",
    "proveedorNombre": "ECORADIX SAS (DR. SENDOYA)",
    "tipoPago": "cuota_programada",
    "montoPagado": 0,
    "referenciaBancaria": "HONORARIOS MEDICOS CONVENIO OCT/24 RECUPERAR",
    "filaOrigen": 680
  },
  {
    "id": "PAG-00066",
    "facturaId": "FAC-00288",
    "facturaNumero": "FE-60",
    "proveedorNombre": "ECORADIX SAS (DR. SENDOYA)",
    "tipoPago": "cuota_programada",
    "montoPagado": 0,
    "referenciaBancaria": "HONORARIOS POR SERVICIO DE ESPIROMETRÍA XXXX/ 24",
    "filaOrigen": 684
  },
  {
    "id": "PAG-00067",
    "facturaId": "FAC-00288",
    "facturaNumero": "FE-60",
    "proveedorNombre": "ECORADIX SAS (DR. SENDOYA)",
    "tipoPago": "cuota_programada",
    "montoPagado": 0,
    "referenciaBancaria": "SEDACION Y ANESTESIA",
    "filaOrigen": 690
  },
  {
    "id": "PAG-00068",
    "facturaId": "FAC-00288",
    "facturaNumero": "FE-60",
    "proveedorNombre": "ECORADIX SAS (DR. SENDOYA)",
    "tipoPago": "cuota_programada",
    "montoPagado": 459300,
    "referenciaBancaria": "PATOLOGIA",
    "filaOrigen": 691
  },
  {
    "id": "PAG-00069",
    "facturaId": "FAC-00288",
    "facturaNumero": "FE-60",
    "proveedorNombre": "ECORADIX SAS (DR. SENDOYA)",
    "tipoPago": "cuota_programada",
    "montoPagado": 15086470,
    "referenciaBancaria": "ESPECIALISTAS GASTRO",
    "filaOrigen": 692
  },
  {
    "id": "PAG-00070",
    "facturaId": "FAC-00288",
    "facturaNumero": "FE-60",
    "proveedorNombre": "ECORADIX SAS (DR. SENDOYA)",
    "tipoPago": "cuota_programada",
    "montoPagado": 0,
    "referenciaBancaria": "ECOGRAFIA Y ECOGRAFIA UT",
    "filaOrigen": 693
  },
  {
    "id": "PAG-00071",
    "facturaId": "FAC-00288",
    "facturaNumero": "FE-60",
    "proveedorNombre": "ECORADIX SAS (DR. SENDOYA)",
    "tipoPago": "cuota_programada",
    "montoPagado": 2594100,
    "referenciaBancaria": "UROLOGIA Y NEUMOLOGIA",
    "filaOrigen": 694
  },
  {
    "id": "PAG-00072",
    "facturaId": "FAC-00288",
    "facturaNumero": "FE-60",
    "proveedorNombre": "ECORADIX SAS (DR. SENDOYA)",
    "tipoPago": "cuota_programada",
    "montoPagado": 460180,
    "referenciaBancaria": "OTROS PROFESIONALES",
    "filaOrigen": 695
  },
  {
    "id": "PAG-00073",
    "facturaId": "FAC-00288",
    "facturaNumero": "FE-60",
    "proveedorNombre": "ECORADIX SAS (DR. SENDOYA)",
    "tipoPago": "cuota_programada",
    "montoPagado": 18600050,
    "filaOrigen": 696
  },
  {
    "id": "PAG-00074",
    "facturaId": "FAC-00288",
    "facturaNumero": "FE-60",
    "proveedorNombre": "ECORADIX SAS (DR. SENDOYA)",
    "tipoPago": "cuota_programada",
    "montoPagado": 60756482,
    "filaOrigen": 699
  },
  {
    "id": "PAG-00075",
    "facturaId": "FAC-00426",
    "facturaNumero": "sin número",
    "proveedorNombre": "DRA. MAGDA RODRIGUEZ - UTILIDADES",
    "tipoPago": "cuota_programada",
    "montoPagado": 91964926,
    "referenciaBancaria": "UTILIDAD POR ESTADOS FINANCIEROS DEFINITIVO ES DE $183,929,851 DR CONTRERAS $91.964.925,50",
    "filaOrigen": 781
  },
  {
    "id": "PAG-00076",
    "facturaId": "FAC-00426",
    "facturaNumero": "sin número",
    "proveedorNombre": "DRA. MAGDA RODRIGUEZ - UTILIDADES",
    "tipoPago": "cuota_programada",
    "montoPagado": 3663744,
    "filaOrigen": 786
  },
  {
    "id": "PAG-00077",
    "facturaId": "FAC-00426",
    "facturaNumero": "sin número",
    "proveedorNombre": "DRA. MAGDA RODRIGUEZ - UTILIDADES",
    "tipoPago": "cuota_programada",
    "montoPagado": 4000000,
    "filaOrigen": 787
  },
  {
    "id": "PAG-00078",
    "facturaId": "FAC-00426",
    "facturaNumero": "sin número",
    "proveedorNombre": "DRA. MAGDA RODRIGUEZ - UTILIDADES",
    "tipoPago": "cuota_programada",
    "montoPagado": 3000000,
    "filaOrigen": 795
  },
  {
    "id": "PAG-00079",
    "facturaId": "FAC-00426",
    "facturaNumero": "sin número",
    "proveedorNombre": "DRA. MAGDA RODRIGUEZ - UTILIDADES",
    "tipoPago": "cuota_programada",
    "montoPagado": 4663744,
    "filaOrigen": 796
  },
  {
    "id": "PAG-00080",
    "facturaId": "FAC-00426",
    "facturaNumero": "sin número",
    "proveedorNombre": "DRA. MAGDA RODRIGUEZ - UTILIDADES",
    "tipoPago": "cuota_programada",
    "montoPagado": 91964926,
    "referenciaBancaria": "UTILIDAD POR ESTADOS FINANCIEROS DEFINITIVO ES DE $183,929,851 DR BOTERO $91.964.925,50",
    "filaOrigen": 799
  },
  {
    "id": "PAG-00081",
    "facturaId": "FAC-00426",
    "facturaNumero": "sin número",
    "proveedorNombre": "DRA. MAGDA RODRIGUEZ - UTILIDADES",
    "tipoPago": "cuota_programada",
    "montoPagado": 2455410,
    "referenciaBancaria": "SALDO PENDIENTE CUOTA 1",
    "filaOrigen": 801
  },
  {
    "id": "PAG-00082",
    "facturaId": "FAC-00426",
    "facturaNumero": "sin número",
    "proveedorNombre": "DRA. MAGDA RODRIGUEZ - UTILIDADES",
    "tipoPago": "cuota_programada",
    "montoPagado": 3663744,
    "filaOrigen": 813
  },
  {
    "id": "PAG-00083",
    "facturaId": "FAC-00426",
    "facturaNumero": "sin número",
    "proveedorNombre": "DRA. MAGDA RODRIGUEZ - UTILIDADES",
    "tipoPago": "cuota_programada",
    "montoPagado": 4000000,
    "filaOrigen": 814
  },
  {
    "id": "PAG-00084",
    "facturaId": "FAC-00426",
    "facturaNumero": "sin número",
    "proveedorNombre": "DRA. MAGDA RODRIGUEZ - UTILIDADES",
    "tipoPago": "cuota_programada",
    "montoPagado": 135905928,
    "referenciaBancaria": "UTILIDAD POR ESTADOS FINANCIEROS DEFINITIVO ES DE $135,905,928",
    "filaOrigen": 816
  },
  {
    "id": "PAG-00085",
    "facturaId": "FAC-00426",
    "facturaNumero": "sin número",
    "proveedorNombre": "DRA. MAGDA RODRIGUEZ - UTILIDADES",
    "tipoPago": "cuota_programada",
    "montoPagado": 15327488,
    "filaOrigen": 833
  },
  {
    "id": "PAG-00086",
    "facturaId": "FAC-00426",
    "facturaNumero": "sin número",
    "proveedorNombre": "DRA. MAGDA RODRIGUEZ - UTILIDADES",
    "tipoPago": "cuota_programada",
    "montoPagado": 0,
    "filaOrigen": 854
  },
  {
    "id": "PAG-00087",
    "facturaId": "FAC-00026",
    "facturaNumero": "cotizacion",
    "proveedorNombre": "MIGUEL ANGEL UNIGARRO PANTOJA - ALACER INDUSTRIA ELETRONICA LTDA",
    "tipoPago": "abono",
    "montoPagado": 173000,
    "referenciaBancaria": "TRANSPORTE RIO DE JANEIR A CUCUTA (PENDIENTE CUCUTA CALI)",
    "filaOrigen": 49
  },
  {
    "id": "PAG-00088",
    "facturaId": "FAC-00055",
    "facturaNumero": "anticipo",
    "proveedorNombre": "SILVIA PATRICIA JAIMES ESCOBAR",
    "tipoPago": "abono",
    "montoPagado": 7000000,
    "filaOrigen": 141
  },
  {
    "id": "PAG-00089",
    "facturaId": "FAC-00055",
    "facturaNumero": "anticipo",
    "proveedorNombre": "SILVIA PATRICIA JAIMES ESCOBAR",
    "tipoPago": "abono",
    "montoPagado": 7000000,
    "filaOrigen": 142
  },
  {
    "id": "PAG-00090",
    "facturaId": "FAC-00069",
    "facturaNumero": "FV-967",
    "proveedorNombre": "SAVE COLOMBIA",
    "tipoPago": "abono",
    "montoPagado": 732500,
    "filaOrigen": 166
  },
  {
    "id": "PAG-00091",
    "facturaId": "FAC-00102",
    "facturaNumero": "CC N°. 425",
    "proveedorNombre": "JULIO CESAR HURTADO",
    "tipoPago": "abono",
    "montoPagado": 1350000,
    "filaOrigen": 220
  },
  {
    "id": "PAG-00092",
    "facturaId": "FAC-00142",
    "facturaNumero": "COTIZACION",
    "proveedorNombre": "OSCAR FERNANDO ARAGON MERA",
    "tipoPago": "abono",
    "montoPagado": 1000000,
    "filaOrigen": 299
  },
  {
    "id": "PAG-00093",
    "facturaId": "FAC-00148",
    "facturaNumero": "GRFC-13433",
    "proveedorNombre": "GRAFICAS HARRIS SAS",
    "tipoPago": "abono",
    "montoPagado": 3000000,
    "referenciaBancaria": "tengo entendidoentregaron 280 cajas",
    "filaOrigen": 321
  },
  {
    "id": "PAG-00094",
    "facturaId": "FAC-00148",
    "facturaNumero": "GRFC-13433",
    "proveedorNombre": "GRAFICAS HARRIS SAS",
    "tipoPago": "abono",
    "montoPagado": 2643967,
    "filaOrigen": 322
  },
  {
    "id": "PAG-00095",
    "facturaId": "FAC-00150",
    "facturaNumero": "COTIZACIÓN-11",
    "proveedorNombre": "RUVID S.A.S",
    "tipoPago": "abono",
    "montoPagado": 6480880,
    "filaOrigen": 353
  },
  {
    "id": "PAG-00096",
    "facturaId": "FAC-00150",
    "facturaNumero": "COTIZACIÓN-11",
    "proveedorNombre": "RUVID S.A.S",
    "tipoPago": "abono",
    "montoPagado": 2431320,
    "filaOrigen": 354
  },
  {
    "id": "PAG-00097",
    "facturaId": "FAC-00150",
    "facturaNumero": "COTIZACIÓN-11",
    "proveedorNombre": "RUVID S.A.S",
    "tipoPago": "abono",
    "montoPagado": 2430000,
    "filaOrigen": 355
  },
  {
    "id": "PAG-00098",
    "facturaId": "FAC-00150",
    "facturaNumero": "COTIZACIÓN-11",
    "proveedorNombre": "RUVID S.A.S",
    "tipoPago": "abono",
    "montoPagado": 2430000,
    "filaOrigen": 356
  },
  {
    "id": "PAG-00099",
    "facturaId": "FAC-00153",
    "facturaNumero": "COTIZACION-14",
    "proveedorNombre": "SOLTHERRA S.A.S",
    "tipoPago": "abono",
    "montoPagado": 3144076,
    "filaOrigen": 422
  },
  {
    "id": "PAG-00100",
    "facturaId": "FAC-00179",
    "facturaNumero": "FE-110",
    "proveedorNombre": "DR. CESAR ORTEGA ECOENDO (GASTROZENTRUM)",
    "tipoPago": "abono",
    "montoPagado": 10000000,
    "filaOrigen": 501
  },
  {
    "id": "PAG-00101",
    "facturaId": "FAC-00179",
    "facturaNumero": "FE-110",
    "proveedorNombre": "DR. CESAR ORTEGA ECOENDO (GASTROZENTRUM)",
    "tipoPago": "abono",
    "montoPagado": 4268693,
    "filaOrigen": 502
  },
  {
    "id": "PAG-00102",
    "facturaId": "FAC-00179",
    "facturaNumero": "FE-110",
    "proveedorNombre": "DR. CESAR ORTEGA ECOENDO (GASTROZENTRUM)",
    "tipoPago": "abono",
    "montoPagado": 4000000,
    "filaOrigen": 503
  },
  {
    "id": "PAG-00103",
    "facturaId": "FAC-00220",
    "facturaNumero": "FP-113",
    "proveedorNombre": "DR. EDUARDO VALLEJO ECHAVARRIA",
    "tipoPago": "abono",
    "montoPagado": 3988640,
    "filaOrigen": 560
  },
  {
    "id": "PAG-00104",
    "facturaId": "FAC-00270",
    "facturaNumero": "CC-1",
    "proveedorNombre": "DRA. MAIRA ALEJANDRA CAMELO CALIXTO",
    "tipoPago": "abono",
    "montoPagado": 2720000,
    "filaOrigen": 637
  }
];
