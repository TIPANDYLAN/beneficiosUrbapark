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

        return plantillaDistribucionData.map((item) => {
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
    }, [parqueaderosData, plantillaDistribucionData]);

    const empleadosPorRegion = useMemo(() => {
        if (modoFiltro === 'TODOS') {
            return empleadosData;
        }

        if (modoFiltro === 'COSTA') {
            return empleadosData.filter(
                (empleado) => normalizarTexto(empleado.ciudad) === 'GUAYAQUIL'
            );
        }

        if (modoFiltro === 'SIERRA') {
            return empleadosData.filter((empleado) => {
                const ciudad = normalizarTexto(empleado.ciudad);
                return ciudad === 'QUITO' || ciudad === 'AMBATO';
            });
        }

        if (modoFiltro === 'CUSTOM') {
            const ciudadesSeleccionadas = new Set(
                parqueaderos
                    .filter((p) => parqueaderosSeleccionados.includes(p.codigo))
                    .map((p) => normalizarTexto(p.region))
                    .filter((region) => ['QUITO', 'AMBATO', 'GUAYAQUIL'].includes(region))
            );

            return empleadosData.filter((empleado) =>
                ciudadesSeleccionadas.has(normalizarTexto(empleado.ciudad))
            );
        }

        return empleadosData;
    }, [empleadosData, modoFiltro, parqueaderos, parqueaderosSeleccionados]);

    const cantidadEmpleadosConsiderados = empleadosPorRegion.length;
    const montoNumerico = Number(montoTotal);

    const valorBaseCalculado =
        cantidadEmpleadosConsiderados > 0 && Number.isFinite(montoNumerico) && montoNumerico > 0
            ? montoNumerico / cantidadEmpleadosConsiderados
            : 0;

    const empleadosParaCentrosNormales = useMemo(() => {
        return empleadosPorRegion.filter(
            (empleado) => String(empleado.codCosto ?? '').trim() !== '0110191'
        );
    }, [empleadosPorRegion]);

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

        // 1. Cálculo de centros normales (usando los empleados normales y el valor base global)
        const distribucionFinal = calcularDistribucionCentrosCosto({
            empleadosNormales: empleadosParaCentrosNormales,
            valorBase: valorBaseCalculado,
        });

        setResultadosCalculo(distribucionFinal);

        const distribucionSup = calcularDistribucionSupervisores({
            empleados: empleadosPorRegion,
            parqueaderosConTemplate: parqueaderos,
            modoFiltro,
            parqueaderosSeleccionados,
            valorBase: valorBaseCalculado,
        });

        setResultadosSupervisores(distribucionSup);
    };

    const totalDistribuido = resultadosCalculo.reduce(
        (total, item) => total + item.montoAsignado,
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
                    <p>
                        <strong>Modo:</strong> {modoFiltro}
                    </p>
                    <p>
                        <strong>Empleados considerados:</strong> {cantidadEmpleadosConsiderados}
                    </p>
                    <p>
                        <strong>Valor base por empleado:</strong> ${formatoMoneda(valorBaseCalculado)}
                    </p>
                </section>
            </aside>

            {/* Columna Derecha: Contenedor dinámico de tablas de resultados */}
            <main className="factura-content-resultados">
                {resultadosCalculo.length > 0 && (
                    <section className="resultados-section">
                        <h2>Distribución por centro de costo</h2>

                        <table className="tabla-resultados">
                            <thead>
                                <tr>
                                    <th>Centro de costo</th>
                                    <th>Cantidad de empleados</th>
                                    <th>Valor base ($)</th>
                                    <th>Monto asignado ($)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resultadosCalculo.map((item) => (
                                    <tr key={item.centroCosto}>
                                        <td>{item.centroCosto}</td>
                                        <td>{item.cantidadEmpleados}</td>
                                        <td>${formatoMoneda(item.valorBase)}</td>
                                        <td>${formatoMoneda(item.montoAsignado)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colSpan="3">Total de centros normales</th>
                                    <th>${formatoMoneda(totalDistribuido)}</th>
                                </tr>
                            </tfoot>
                        </table>
                    </section>
                )}

                {resultadosSupervisores.resultados.length > 0 && (
                    <section className="resultados-section">
                        <h2>Distribución de Administración-Supervisores (0110191)</h2>
                        <p style={{ margin: '0.5rem 0 1rem 0', fontSize: '0.9rem', color: '#64748b' }}>
                            Total supervisores: {resultadosSupervisores.totalSupervisores} | Monto: ${formatoMoneda(resultadosSupervisores.montoSupervisores)}
                        </p>

                        <table className="tabla-resultados">
                            <thead>
                                <tr>
                                    <th>Parqueadero</th>
                                    <th>% Base</th>
                                    <th>% Reajustado</th>
                                    <th>Monto Asignado ($)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resultadosSupervisores.resultados.map((item) => (
                                    <tr key={item.codigo}>
                                        <td>{item.nombre}</td>
                                        <td>{item.porcentajeBase}%</td>
                                        <td>{item.porcentajeAjustado.toFixed(2)}%</td>
                                        <td>${formatoMoneda(item.montoAsignado)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colSpan="3">Total Supervisores Distribuido</th>
                                    <th>
                                        ${formatoMoneda(
                                            resultadosSupervisores.resultados.reduce((acc, curr) => acc + curr.montoAsignado, 0)
                                        )}
                                    </th>
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