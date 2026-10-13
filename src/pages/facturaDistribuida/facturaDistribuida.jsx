import React, { useMemo, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { calcularDistribucionCentrosCosto } from '../../utils/distribucionCentrosCosto';
import FiltroParqueaderos from '../../components/filtroParqueaderos/filtroParqueaderos';
import { calcularDistribucionSupervisores } from '../../utils/calcularDistribucionSupervisores';
import './facturaDistribuida.css';

export default function FacturaDistribuida() {
    const {
        empleadosData,
        parqueaderosData,
        plantillaDistribucionData,
        gruposSupervision,          // 👈 1. Recibido del loader
        relacionEmpleadosGrupos,    // 👈 1. Recibido del loader
    } = useLoaderData();

    const [montoTotal, setMontoTotal] = useState('');
    const [modoFiltro, setModoFiltro] = useState('TODOS');
    const [parqueaderosSeleccionados, setParqueaderosSeleccionados] = useState([]);
    const [resultadosCalculo, setResultadosCalculo] = useState([]);
    const [resultadosSupervisores, setResultadosSupervisores] = useState({
        resultados: [],
        totalSupervisores: 0,
        montoSupervisores: 0,
    });

    const normalizarCodigo = (code) => String(code ?? '').trim();
    const normalizarTexto = (valor) => String(valor ?? '').trim().toUpperCase();

    const parqueaderos = useMemo(() => {
        const mapaCatalogo = new Map(
            parqueaderosData.map((p) => [
                normalizarCodigo(p.codigo || p.cost_center_code),
                p,
            ])
        );

        const listaTemplate = plantillaDistribucionData.map((item) => {
            const codigo = normalizarCodigo(item.codigo || item.cost_center_code);
            const infoCatalogo = mapaCatalogo.get(codigo);

            const regionDetectada =
                infoCatalogo?.movilizacion ||
                infoCatalogo?.region ||
                infoCatalogo?.ciudad ||
                infoCatalogo?.zona ||
                infoCatalogo?.ubicacion ||
                'SIN_REGION';

            return {
                codigo,
                nombre: item.nombre || item.name || infoCatalogo?.nombre || infoCatalogo?.name || codigo,
                region: normalizarTexto(regionDetectada),
                porcentajeBase: Number(item.porcentajeBase ?? item.percentage ?? 0),
            };
        });

        // Asegurar que Administración-Supervisores esté disponible en la lista de opciones personalizadas
        const existeSupervisor = listaTemplate.some((p) => normalizarCodigo(p.codigo) === '0110191');
        if (!existeSupervisor) {
            listaTemplate.push({
                codigo: '0110191',
                nombre: 'ADMINISTRACION-SUPERVISORES',
                region: 'NACIONAL',
                porcentajeBase: 0,
            });
        }

        return listaTemplate;
    }, [parqueaderosData, plantillaDistribucionData]);

    // Parqueaderos normales seleccionados (excluyendo 0110191)
    const parqueaderosNormalesSeleccionados = useMemo(() => {
        return parqueaderosSeleccionados.filter(
            (c) => normalizarCodigo(c) !== '0110191'
        );
    }, [parqueaderosSeleccionados]);

    // Bandera para saber si se deben incluir supervisores en modo CUSTOM según el check
    const incluirSupervisores = useMemo(() => {
        if (modoFiltro !== 'CUSTOM') return true;
        return parqueaderosSeleccionados.some(
            (c) => normalizarCodigo(c) === '0110191'
        );
    }, [modoFiltro, parqueaderosSeleccionados]);

    // 1. Empleados normales
    const empleadosParaCentrosNormales = useMemo(() => {
        const noSupervisores = empleadosData.filter(
            (e) => String(e.codCosto ?? '').trim() !== '0110191'
        );

        if (modoFiltro === 'TODOS') {
            return noSupervisores;
        }

        if (modoFiltro === 'COSTA') {
            return noSupervisores.filter(
                (e) => normalizarTexto(e.ciudad) === 'GUAYAQUIL'
            );
        }

        if (modoFiltro === 'SIERRA') {
            return noSupervisores.filter((e) => {
                const ciudad = normalizarTexto(e.ciudad);
                return ciudad === 'QUITO' || ciudad === 'AMBATO';
            });
        }

        if (modoFiltro === 'CUSTOM') {
            const setSeleccionados = new Set(parqueaderosNormalesSeleccionados.map((c) => normalizarCodigo(c)));
            return noSupervisores.filter((e) =>
                setSeleccionados.has(normalizarCodigo(e.codCosto))
            );
        }

        return noSupervisores;
    }, [empleadosData, modoFiltro, parqueaderosNormalesSeleccionados]);

    const empleadosSupervisoresConsiderados = useMemo(() => {
        if (!incluirSupervisores) return [];

        const soloSupervisores = empleadosData.filter(
            (e) => String(e.codCosto ?? '').trim() === '0110191'
        );

        if (modoFiltro === 'TODOS') {
            return soloSupervisores;
        }

        if (modoFiltro === 'COSTA') {
            return soloSupervisores.filter(
                (e) => normalizarTexto(e.ciudad) === 'GUAYAQUIL'
            );
        }

        if (modoFiltro === 'SIERRA') {
            return soloSupervisores.filter((e) => {
                const ciudad = normalizarTexto(e.ciudad);
                return ciudad === 'QUITO' || ciudad === 'AMBATO';
            });
        }

        if (modoFiltro === 'CUSTOM') {
            const regionesSeleccionadas = new Set(
                parqueaderos
                    .filter((p) => parqueaderosNormalesSeleccionados.includes(p.codigo))
                    .map((p) => normalizarTexto(p.region))
            );
            return soloSupervisores.filter((e) =>
                regionesSeleccionadas.has(normalizarTexto(e.ciudad))
            );
        }

        return soloSupervisores;
    }, [empleadosData, modoFiltro, incluirSupervisores, parqueaderosNormalesSeleccionados, parqueaderos]);

    const empleadosPorRegion = useMemo(() => {
        return [...empleadosParaCentrosNormales, ...empleadosSupervisoresConsiderados];
    }, [empleadosParaCentrosNormales, empleadosSupervisoresConsiderados]);

    const cantidadEmpleadosConsiderados = empleadosPorRegion.length;
    const montoNumerico = Number(montoTotal);

    const valorBaseCalculado =
        cantidadEmpleadosConsiderados > 0 && Number.isFinite(montoNumerico) && montoNumerico > 0
            ? montoNumerico / cantidadEmpleadosConsiderados
            : 0;

    const formatoMoneda = (valor) =>
        Number(valor || 0).toLocaleString('es-EC', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    const handleCalcular = () => {
        if (!Number.isFinite(montoNumerico) || montoNumerico <= 0 || cantidadEmpleadosConsiderados === 0) {
            setResultadosCalculo([]);
            setResultadosSupervisores({ resultados: [], totalSupervisores: 0, montoSupervisores: 0 });
            return;
        }

        const distribucionFinal = calcularDistribucionCentrosCosto({
            empleadosNormales: empleadosParaCentrosNormales,
            valorBase: valorBaseCalculado,
        });

        setResultadosCalculo(distribucionFinal);

        // 👈 2. Se pasan los grupos y relaciones al calculador de supervisores
        const distribucionSup = incluirSupervisores
            ? calcularDistribucionSupervisores({
                  empleados: empleadosPorRegion,
                  parqueaderosConTemplate: parqueaderos.filter((p) => normalizarCodigo(p.codigo) !== '0110191'),
                  gruposSupervision: gruposSupervision || [],
                  relacionEmpleadosGrupos: relacionEmpleadosGrupos || [],
                  modoFiltro,
                  parqueaderosSeleccionados: parqueaderosNormalesSeleccionados,
                  valorBase: valorBaseCalculado,
              })
            : { resultados: [], totalSupervisores: 0, montoSupervisores: 0 };

        setResultadosSupervisores(distribucionSup);
    };

    // 4. Fusionar resultados unificados
    const resultadosUnificados = useMemo(() => {
        if (resultadosCalculo.length === 0 && resultadosSupervisores.resultados.length === 0) {
            return [];
        }

        const mapaNormales = new Map();
        resultadosCalculo.forEach((item) => {
            const key = normalizarCodigo(item.codigoCosto);
            mapaNormales.set(key, { ...item });
        });

        const mapaSupervisores = new Map();
        resultadosSupervisores.resultados.forEach((item) => {
            const key = normalizarCodigo(item.codigo);
            mapaSupervisores.set(key, { monto: item.montoAsignado, nombre: item.nombre });
        });

        const todasLasLlaves = new Set();
        if (modoFiltro === 'CUSTOM') {
            parqueaderosNormalesSeleccionados.forEach((codigo) => todasLasLlaves.add(normalizarCodigo(codigo)));
            mapaSupervisores.forEach((_, key) => todasLasLlaves.add(key));
        } else {
            mapaNormales.forEach((_, key) => todasLasLlaves.add(key));
            mapaSupervisores.forEach((_, key) => todasLasLlaves.add(key));
        }

        const unificados = [];

        todasLasLlaves.forEach((key) => {
            const normalItem = mapaNormales.get(key);
            const supItem = mapaSupervisores.get(key);
            const infoParqueadero = parqueaderos.find((p) => normalizarCodigo(p.codigo) === key);

            const centroCostoNombre = normalItem?.centroCosto || supItem?.nombre || infoParqueadero?.nombre || key;
            const cantidadEmpleados = normalItem?.cantidadEmpleados || 0;
            const valorBase = normalItem?.valorBase || valorBaseCalculado;
            const montoNormal = normalItem?.montoAsignado || 0;
            const montoSupervisor = supItem?.monto || 0;
            const montoTotalAsignado = Number((montoNormal + montoSupervisor).toFixed(2));

            unificados.push({
                codigoCosto: key,
                centroCosto: centroCostoNombre,
                cantidadEmpleados,
                valorBase,
                montoNormal,
                montoSupervisor,
                montoTotalAsignado,
            });
        });

        return unificados;
    }, [resultadosCalculo, resultadosSupervisores, valorBaseCalculado, modoFiltro, parqueaderosNormalesSeleccionados, parqueaderos]);

    const granTotalDistribuido = resultadosUnificados.reduce(
        (total, item) => total + item.montoTotalAsignado,
        0
    );

    const estaDeshabilitado =
        !montoTotal ||
        !Number.isFinite(montoNumerico) ||
        montoNumerico <= 0 ||
        cantidadEmpleadosConsiderados === 0;

    return (
        <div className="factura-container">
            <aside className="factura-sidebar">
                <header className="factura-header">
                    <h1>
                        <span>Facturación </span>
                        <span>Distribuida</span>
                    </h1>
                </header>

                <section className="controles-bar">
                    <div className="input-group">
                        <label htmlFor="monto">Monto Total Factura ($):</label>
                        <input
                            id="monto"
                            type="number"
                            min="0"
                            step="any"
                            placeholder="0.00"
                            value={montoTotal}
                            onChange={(e) => {
                                setMontoTotal(e.target.value);
                                setResultadosCalculo([]);
                                setResultadosSupervisores({ resultados: [], totalSupervisores: 0, montoSupervisores: 0 });
                            }}
                        />
                    </div>

                    <div className="filtro-action-group">
                        <FiltroParqueaderos
                            parqueaderos={parqueaderos}
                            onSeleccionarModo={(modo) => {
                                setModoFiltro(modo);
                                setResultadosCalculo([]);
                                setResultadosSupervisores({ resultados: [], totalSupervisores: 0, montoSupervisores: 0 });
                            }}
                            onSeleccionarParqueaderos={(seleccionados) => {
                                setParqueaderosSeleccionados(seleccionados);
                                setResultadosCalculo([]);
                                setResultadosSupervisores({ resultados: [], totalSupervisores: 0, montoSupervisores: 0 });
                            }}
                        />
                    </div>

                    <button
                        type="button"
                        className="btn-calcular"
                        onClick={handleCalcular}
                        disabled={estaDeshabilitado}
                    >
                        <span>Calcular</span>
                    </button>
                </section>

                <section className="resumen-distribucion">
                    {resultadosSupervisores.totalSupervisores > 0 && (
                        <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#64748b' }}>
                            Supervisores distribuidos: {resultadosSupervisores.totalSupervisores} (${formatoMoneda(resultadosSupervisores.montoSupervisores)})
                        </p>
                    )}
                </section>
            </aside>

            <main className="factura-content-resultados">
                {resultadosUnificados.length > 0 && (
                    <section className="resultados-section">
                        <h2>Distribución Total Consolidada</h2>

                        <table className="tabla-resultados">
                            <thead>
                                <tr>
                                    <th>Centro de costo</th>
                                    <th>Cantidad empleados</th>
                                    <th>Valor base ($)</th>
                                    <th>Monto Normal ($)</th>
                                    <th>Monto Supervisores ($)</th>
                                    <th>Monto Total Asignado ($)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resultadosUnificados.map((item) => (
                                    <tr key={item.codigoCosto}>
                                        <td>{item.centroCosto}</td>
                                        <td>{item.cantidadEmpleados}</td>
                                        <td>${formatoMoneda(item.valorBase)}</td>
                                        <td>${formatoMoneda(item.montoNormal)}</td>
                                        <td>${formatoMoneda(item.montoSupervisor)}</td>
                                        <td><strong>${formatoMoneda(item.montoTotalAsignado)}</strong></td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colSpan="5">Total Distribuido</th>
                                    <th>${formatoMoneda(granTotalDistribuido)}</th>
                                </tr>
                            </tfoot>
                        </table>
                    </section>
                )}

                {montoTotal && montoNumerico > 0 && cantidadEmpleadosConsiderados === 0 && (
                    <p className="mensaje-sin-empleados">
                        No hay empleados para el filtro seleccionado.
                    </p>
                )}
            </main>
        </div>
    );
}