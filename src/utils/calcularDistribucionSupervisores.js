/**
 * Calcula la distribución de Supervisores basándose en los grupos y plantillas de porcentajes.
 */
export const calcularDistribucionSupervisores = ({
    empleados,
    parqueaderosConTemplate,
    gruposSupervision = [],
    relacionEmpleadosGrupos = [],
    modoFiltro,
    parqueaderosSeleccionados = [],
    valorBase,
}) => {
    const normalizarTexto = (str) => String(str ?? '').trim().toUpperCase();
    const normalizarCodigo = (str) => String(str ?? '').trim();

    console.log("=== DEBUG SUPERVISORES ===");
    console.log("Total empleados recibidos:", empleados.length);
    console.log("Grupos de supervision recibidos:", gruposSupervision.length);
    console.log("Relaciones empleado-grupo recibidas:", relacionEmpleadosGrupos.length);

    // 1. Filtrar empleados supervisores (codCosto === '0110191')
    const supervisoresFiltrados = empleados.filter((e) => {
        const esSupervisor = String(e.codCosto ?? '').trim() === '0110191';
        if (!esSupervisor) return false;

        const ciudad = normalizarTexto(e.ciudad);
        if (modoFiltro === 'COSTA') return ciudad === 'GUAYAQUIL' || !ciudad;
        if (modoFiltro === 'SIERRA') return ciudad === 'QUITO' || ciudad === 'AMBATO' || !ciudad;
        return true; 
    });

    console.log("Supervisores filtrados para cálculo:", supervisoresFiltrados.length);

    const totalSupervisores = supervisoresFiltrados.length;
    const baseNum = Number(valorBase) || 0;
    const montoSupervisores = totalSupervisores * baseNum;

    if (montoSupervisores <= 0 || totalSupervisores === 0) {
        console.log("Monto o total de supervisores es 0, saliendo.");
        return { resultados: [], totalSupervisores: 0, montoSupervisores: 0 };
    }

    // 2. Mapeos robustos de cédulas y grupos
    const mapaCedulaGrupo = new Map();
    relacionEmpleadosGrupos.forEach((r) => {
        if (r.cedulaEmpleado && r.grupoId !== undefined) {
            mapaCedulaGrupo.set(normalizarCodigo(r.cedulaEmpleado), normalizarCodigo(r.grupoId));
        }
    });

    const mapaGrupos = new Map();
    gruposSupervision.forEach((g) => {
        if (g.grupoId !== undefined && g.grupoId !== null) {
            mapaGrupos.set(normalizarCodigo(g.grupoId), g);
        }
    });

    const setParqueaderosCustom = new Set(
        parqueaderosSeleccionados.map((c) => normalizarCodigo(c))
    );

    const plantillaBaseGeneral = parqueaderosConTemplate.map((p) => ({
        codigoParqueadero: p.codigo,
        nombreParqueadero: p.nombre,
        porcentaje: p.porcentajeBase,
    }));

    const mapaAcumuladoParqueaderos = new Map();

    // 3. Procesar cada supervisor individualmente
    supervisoresFiltrados.forEach((sup, idx) => {
        const cedulaSup = normalizarCodigo(
            sup.document_number || 
            sup.identification_number || 
            sup.cedula || 
            sup.numeroDocumento ||
            sup.dni ||
            sup.id || 
            sup.codEmpleado ||
            sup.codigo
        );

        const grupoIdStr = mapaCedulaGrupo.get(cedulaSup);
        const grupoInfo = mapaGrupos.get(grupoIdStr);

        if (idx < 3) {
            console.log(`Supervisor [${idx}] - Cédula: "${cedulaSup}" -> GrupoId: ${grupoIdStr} -> Halló Grupo:`, !!grupoInfo);
        }

        let distribucionPlantilla = [];

        if (grupoInfo && Array.isArray(grupoInfo.distribucion) && grupoInfo.distribucion.length > 0) {
            distribucionPlantilla = grupoInfo.distribucion;
        } else {
            distribucionPlantilla = plantillaBaseGeneral;
        }

        let distribucionFiltrada = distribucionPlantilla;

        if (modoFiltro === 'CUSTOM') {
            distribucionFiltrada = distribucionPlantilla.filter((d) =>
                setParqueaderosCustom.has(normalizarCodigo(d.codigoParqueadero))
            );
        } else if (modoFiltro === 'COSTA' || modoFiltro === 'SIERRA') {
            distribucionFiltrada = distribucionPlantilla.filter((d) => {
                const pqCatalogo = parqueaderosConTemplate.find(
                    (p) => normalizarCodigo(p.codigo) === normalizarCodigo(d.codigoParqueadero)
                );
                if (!pqCatalogo) return true;
                const reg = normalizarTexto(pqCatalogo.region);
                if (modoFiltro === 'COSTA') return reg.includes('GUAYAQUIL') || reg.includes('COSTA');
                if (modoFiltro === 'SIERRA') return reg.includes('QUITO') || reg.includes('AMBATO') || reg.includes('SIERRA');
                return true;
            });
        }

        const sumaPorcentajes = distribucionFiltrada.reduce(
            (acc, d) => acc + (Number(d.porcentaje) || 0),
            0
        );

        if (sumaPorcentajes > 0) {
            distribucionFiltrada.forEach((d) => {
                const codPq = normalizarCodigo(d.codigoParqueadero);
                const porcentajeBase = Number(d.porcentaje) || 0;

                const porcentajeAjustado = (porcentajeBase / sumaPorcentajes) * 100;
                const montoAsignadoSup = (baseNum * porcentajeAjustado) / 100;

                const actual = mapaAcumuladoParqueaderos.get(codPq) || 0;
                mapaAcumuladoParqueaderos.set(codPq, actual + montoAsignadoSup);
            });
        }
    });

    console.log("Mapa acumulado parqueaderos supervisores:", Array.from(mapaAcumuladoParqueaderos.entries()));

    let sumaMontosDistribuidos = 0;
    const resultadosPreliminares = [];

    mapaAcumuladoParqueaderos.forEach((montoBruto, codPq) => {
        const infoPq = parqueaderosConTemplate.find((p) => normalizarCodigo(p.codigo) === codPq);
        const montoAsignado = Number(montoBruto.toFixed(2));
        sumaMontosDistribuidos += montoAsignado;

        resultadosPreliminares.push({
            codigo: codPq,
            nombre: infoPq?.nombre || codPq,
            montoAsignado,
        });
    });

    console.log("Resultados preliminares supervisores:", resultadosPreliminares);

    const diferenciaCentavos = Number((montoSupervisores - sumaMontosDistribuidos).toFixed(2));
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