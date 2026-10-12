/**
 * Calcula la distribución por centro de costo para empleados normales 
 * utilizando el valor base global y aplicando ajuste de centavos.
 */
export const calcularDistribucionCentrosCosto = ({ empleadosNormales, valorBase }) => {
    const base = Number(valorBase) || 0;
    if (!empleadosNormales || empleadosNormales.length === 0 || base <= 0) return [];

    // Agrupar empleados normales por centro de costo
    const grupos = empleadosNormales.reduce((acc, empleado) => {
        const centroCosto = empleado.centroCosto?.trim();
        if (!centroCosto) return acc;

        if (!acc[centroCosto]) {
            acc[centroCosto] = 0;
        }
        acc[centroCosto] += 1;
        return acc;
    }, {});

    const entradas = Object.entries(grupos);
    if (entradas.length === 0) return [];

    let sumaMontosCalculados = 0;

    const distribucionPreliminar = entradas.map(([centroCosto, cantidadEmpleados]) => {
        const montoAsignado = Number((cantidadEmpleados * base).toFixed(2));
        sumaMontosCalculados += montoAsignado;

        return {
            centroCosto,
            cantidadEmpleados,
            valorBase: base,
            montoAsignado,
        };
    });

    // Total esperado exacto para los centros normales basado en el valor base global
    const totalEsperadoNormales = empleadosNormales.reduce(
        (acc, _) => acc + base,
        0
    );

    const diferenciaCentavos = Number((totalEsperadoNormales - sumaMontosCalculados).toFixed(2));

    if (diferenciaCentavos !== 0 && distribucionPreliminar.length > 0) {
        let indexMayor = 0;
        let mayorMonto = distribucionPreliminar[0].montoAsignado;

        for (let i = 1; i < distribucionPreliminar.length; i++) {
            if (distribucionPreliminar[i].montoAsignado > mayorMonto) {
                mayorMonto = distribucionPreliminar[i].montoAsignado;
                indexMayor = i;
            }
        }

        distribucionPreliminar[indexMayor].montoAsignado = Number(
            (distribucionPreliminar[indexMayor].montoAsignado + diferenciaCentavos).toFixed(2)
        );
    }

    return distribucionPreliminar;
};