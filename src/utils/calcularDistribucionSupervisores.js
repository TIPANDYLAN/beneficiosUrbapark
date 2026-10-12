/**
 * Calcula la distribución de Supervisores validando con codCosto === '0110191'.
 */
export const calcularDistribucionSupervisores = ({
    empleados,
    parqueaderosConTemplate,
    modoFiltro,
    parqueaderosSeleccionados,
    valorBase,
}) => {
    const normalizarTexto = (str) => String(str ?? '').trim().toUpperCase();

    let parqueaderosFiltrados = parqueaderosConTemplate;
    if (modoFiltro === 'COSTA') {
        parqueaderosFiltrados = parqueaderosConTemplate.filter((p) => {
            const reg = normalizarTexto(p.region);
            return reg.includes('GUAYAQUIL') || reg.includes('COSTA');
        });
    } else if (modoFiltro === 'SIERRA') {
        parqueaderosFiltrados = parqueaderosConTemplate.filter((p) => {
            const reg = normalizarTexto(p.region);
            return reg.includes('QUITO') || reg.includes('AMBATO') || reg.includes('SIERRA');
        });
    } else if (modoFiltro === 'CUSTOM') {
        parqueaderosFiltrados = parqueaderosConTemplate.filter((p) =>
            parqueaderosSeleccionados.includes(p.codigo)
        );
    }

    if (parqueaderosFiltrados.length === 0) {
        parqueaderosFiltrados = parqueaderosConTemplate;
    }

    const sumaPorcentajesBase = parqueaderosFiltrados.reduce(
        (acc, p) => acc + (Number(p.porcentajeBase) || 0),
        0
    );

    if (sumaPorcentajesBase === 0 || parqueaderosFiltrados.length === 0) {
        return { resultados: [], totalSupervisores: 0, montoSupervisores: 0 };
    }

    // Filtrar supervisores usando codCosto
    const supervisoresFiltrados = empleados.filter((e) => {
        const esSupervisor = String(e.codCosto ?? '').trim() === '0110191';
        if (!esSupervisor) return false;

        const ciudad = normalizarTexto(e.ciudad);
        if (modoFiltro === 'COSTA') return ciudad === 'GUAYAQUIL' || !ciudad;
        if (modoFiltro === 'SIERRA') return ciudad === 'QUITO' || ciudad === 'AMBATO' || !ciudad;
        if (modoFiltro === 'CUSTOM') {
            const ciudadesValidas = new Set(parqueaderosFiltrados.map((p) => normalizarTexto(p.region)));
            return ciudadesValidas.has(ciudad) || ciudadesValidas.size === 0;
        }
        return true;
    });

    const totalSupervisores = supervisoresFiltrados.length;
    const baseNum = Number(valorBase) || 0;
    const montoSupervisores = totalSupervisores * baseNum;

    if (montoSupervisores <= 0) {
        return { resultados: [], totalSupervisores, montoSupervisores };
    }

    let sumaMontosAsignados = 0;
    const resultadosPreliminares = parqueaderosFiltrados.map((p) => {
        const porcentajeBase = Number(p.porcentajeBase) || 0;
        const porcentajeAjustado = sumaPorcentajesBase > 0 
            ? (porcentajeBase / sumaPorcentajesBase) * 100 
            : (100 / parqueaderosFiltrados.length);
        
        const montoProporcional = (montoSupervisores * porcentajeAjustado) / 100;
        const montoAsignado = Number(montoProporcional.toFixed(2));

        sumaMontosAsignados += montoAsignado;

        return {
            codigo: p.codigo,
            nombre: p.nombre,
            porcentajeBase,
            porcentajeAjustado: Number(porcentajeAjustado.toFixed(4)),
            montoAsignado,
        };
    });

    const diferenciaCentavos = Number((montoSupervisores - sumaMontosAsignados).toFixed(2));
    if (diferenciaCentavos !== 0 && resultadosPreliminares.length > 0) {
        let indexMayor = 0;
        let mayorMonto = resultadosPreliminares[0].montoAsignado;

        for (let i = 1; i < resultadosPreliminares.length; i++) {
            if (resultadosPreliminares[i].montoAsignado > mayorMonto) {
                mayorMonto = resultadosPreliminares[i].montoAsignado;
                indexMayor = i;
            }
        }

        resultadosPreliminares[indexMayor].montoAsignado = Number(
            (resultadosPreliminares[indexMayor].montoAsignado + diferenciaCentavos).toFixed(2)
        );
    }

    return {
        resultados: resultadosPreliminares,
        totalSupervisores,
        montoSupervisores,
    };
};