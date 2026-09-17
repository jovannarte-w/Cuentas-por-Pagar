/**
 * Exportación a CSV en el navegador -- sin librerías externas. Excel abre
 * CSV nativamente; usamos BOM UTF-8 para que las tildes y "ñ" se vean bien.
 */

export type ColumnaExport<T> = {
  header: string;
  accessor: (fila: T) => string | number;
};

function escaparCelda(valor: string | number): string {
  const texto = String(valor);
  if (/[",\n;]/.test(texto)) {
    return `"${texto.replace(/"/g, '""')}"`;
  }
  return texto;
}

export function exportarCSV<T>(nombreArchivo: string, columnas: ColumnaExport<T>[], filas: T[]) {
  const encabezado = columnas.map((c) => escaparCelda(c.header)).join(";");
  const lineas = filas.map((fila) => columnas.map((c) => escaparCelda(c.accessor(fila))).join(";"));
  const contenido = [encabezado, ...lineas].join("\r\n");

  const blob = new Blob(["﻿" + contenido], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombreArchivo.endsWith(".csv") ? nombreArchivo : `${nombreArchivo}.csv`;
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  URL.revokeObjectURL(url);
}
