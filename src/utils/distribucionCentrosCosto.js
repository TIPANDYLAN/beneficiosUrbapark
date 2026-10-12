/**
 * Calcula la distribución por centro de costo usando codCosto y centroCosto.
 */
export const calcularDistribucionCentrosCosto = ({ empleadosNormales, valorBase }) => {
    const base = Number(valorBase) || 0;
    if (!empleadosNormales || empleadosNormales.length === 0 || base <= 0) return [];

    // Agrupar empleados normales por codCosto y conservar su nombre (centroCosto)
    const grupos = empleadosNormales.reduce((acc, empleado) => {
        const codigoCosto = String(empleado.codCosto ?? '').trim();
        const nombreCentro = String(empleado.centroCosto ?? '').trim() || codigoCosto;
        
        if (!codigoCosto) return acc;

        if (!acc[codigoCosto]) {
            acc[codigoCosto] = {
                codigoCosto,
                centroCosto: nombreCentro,
                cantidad: 0,
            };
        }
        acc[codigoCosto].cantidad += 1;
        return acc;
    }, {});

    const entradas = Object.values(grupos);
    if (entradas.length === 0) return [];

    let sumaMontosCalculados = 0;

    const distribucionPreliminar = entradas.map((grupo) => {
        const montoAsignado = Number((grupo.cantidad * base).toFixed(2));
        sumaMontosCalculados += montoAsignado;

        return {
            codigoCosto: grupo.codigoCosto,
            centroCosto: grupo.centroCosto,
            cantidadEmpleados: grupo.cantidad,
            valorBase: base,
            montoAsignado,
        };
    });

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