/**
 * Calcula la distribución proporcional de la factura entre los parqueaderos seleccionados.
 * 
 * @param {number|string} montoTotal - Monto total de la factura a distribuir.
 * @param {Array} parqueaderosSeleccionados - Lista de objetos parqueadero seleccionados [{codigo, nombre, porcentajeBase}]
 * @returns {Array} Lista de parqueaderos con su nuevo porcentaje ajustado y monto prorrateado.
 */
export const calcularDistribucionFactura = (montoTotal, parqueaderosSeleccionados) => {
  const monto = parseFloat(montoTotal);

  if (isNaN(monto) || monto <= 0 || !parqueaderosSeleccionados.length) {
    return [];
  }

  // 1. Obtener la suma base de la selección actual
  const sumaPesosBase = parqueaderosSeleccionados.reduce(
    (acc, p) => acc + (p.porcentajeBase || 0),
    0
  );

  if (sumaPesosBase === 0) return [];

  // 2. Calcular monto y nuevo porcentaje proporcional para cada parqueadero
  let totalCalculado = 0;
  const resultados = parqueaderosSeleccionados.map((p) => {
    const porcentajeAjustado = ((p.porcentajeBase || 0) / sumaPesosBase) * 100;
    const montoCalculado = Number(((monto * (p.porcentajeBase || 0)) / sumaPesosBase).toFixed(2));
    
    totalCalculado += montoCalculado;

    return {
      ...p,
      porcentajeAjustado: Number(porcentajeAjustado.toFixed(4)),
      montoAsignado: montoCalculado,
    };
  });

  // 3. Ajuste de centavos sobrantes/faltantes por redondeo
  const diferenciaCentavos = Number((monto - totalCalculado).toFixed(2));
  
  if (diferenciaCentavos !== 0 && resultados.length > 0) {
    resultados[0].montoAsignado = Number(
      (resultados[0].montoAsignado + diferenciaCentavos).toFixed(2)
    );
  }

  return resultados;
};