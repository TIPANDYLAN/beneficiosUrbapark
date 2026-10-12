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

    // 1. Empleados filtrados por región (INCLUYE supervisores para el conteo global y valor base)
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

    // 2. Empleados para centros normales (EXCLUYE supervisores con codCosto === '0110191')
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

        // 1. Cálculo de centros normales
        const distribucionFinal = calcularDistribucionCentrosCosto({
            empleadosNormales: empleadosParaCentrosNormales,
            valorBase: valorBaseCalculado,
        });

        setResultadosCalculo(distribucionFinal);

        // 2. Cálculo de distribución de Supervisores
        const distribucionSup = calcularDistribucionSupervisores({
            empleados: empleadosPorRegion,
            parqueaderosConTemplate: parqueaderos,
            modoFiltro,
            parqueaderosSeleccionados,
            valorBase: valorBaseCalculado,
        });

        setResultadosSupervisores(distribucionSup);
    };

    // 3. Fusionar centros normales y supervisores en una sola lista unificada usando codCosto / código
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

        const todasLasLlaves = new Set([...mapaNormales.keys(), ...mapaSupervisores.keys()]);
        const unificados = [];

        todasLasLlaves.forEach((key) => {
            const normalItem = mapaNormales.get(key);
            const supItem = mapaSupervisores.get(key);

            const centroCostoNombre = normalItem?.centroCosto || supItem?.nombre || key;
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
    }, [resultadosCalculo, resultadosSupervisores, valorBaseCalculado]);

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
            {/* Columna Izquierda: Sidebar de controles y resumen */}
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
            </aside>

            {/* Columna Derecha: Tabla Unificada de Resultados */}
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
                                    <th colSpan="5">Gran Total Distribuido</th>
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