/**
 * Calcula la distribución del centro de costo "Administración-Supervisores" (0110191)
 * con respaldos de seguridad para asegurar que siempre renderice datos en la tabla.
 */
export const calcularDistribucionSupervisores = ({
    empleados,
    parqueaderosConTemplate,
    modoFiltro,
    parqueaderosSeleccionados,
    valorBase,
}) => {
    const normalizarTexto = (str) => String(str ?? '').trim().toUpperCase();

    // 1. Filtrar parqueaderos según el modo de filtro activo
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

    // 🛡️ RESPALDO DE SEGURIDAD: Si por diferencias de nombres de región el filtro devuelve 0,
    // usamos todos los parqueaderos de la plantilla para garantizar que la tabla muestre los montos.
    if (parqueaderosFiltrados.length === 0) {
        parqueaderosFiltrados = parqueaderosConTemplate;
    }

    // 2. Sumar los porcentajes base de los parqueaderos filtrados para la Regla de Tres
    const sumaPorcentajesBase = parqueaderosFiltrados.reduce(
        (acc, p) => acc + (Number(p.porcentajeBase) || 0),
        0
    );

    if (sumaPorcentajesBase === 0 || parqueaderosFiltrados.length === 0) {
        return { resultados: [], totalSupervisores: 0, montoSupervisores: 0 };
    }

    // 3. Filtrar empleados supervisores (COD_MFCC = 0110191)
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
        return true; // TODOS
    });

    const totalSupervisores = supervisoresFiltrados.length;
    const baseNum = Number(valorBase) || 0;
    const montoSupervisores = totalSupervisores * baseNum;

    if (montoSupervisores <= 0) {
        return { resultados: [], totalSupervisores, montoSupervisores };
    }

    // 4. Distribuir el monto usando porcentajes reajustados por Regla de Tres
    let sumaMontosAsignados = 0;
    const resultadosPreliminares = parqueaderosFiltrados.map((p) => {
        const porcentajeBase = Number(p.porcentajeBase) || 0;
        
        // Regla de Tres: (Porcentaje Base / Suma Total Base) * 100
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

    // 5. Ajuste final de centavos para garantizar cuadre exacto con el monto total de supervisores
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