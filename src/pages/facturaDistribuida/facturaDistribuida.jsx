import React, { useMemo, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { calcularDistribucionFactura } from '../../utils/calculoDistribucion';
import FiltroParqueaderos from '../../components/filtroParqueaderos/filtroParqueaderos';
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

    const normalizarCodigo = (code) => String(code || '').trim();

    const agruparEmpleadosPorCentroCosto = (empleados) => {
        return empleados.reduce((grupos, empleado) => {
            const centroCosto = empleado.centroCosto?.trim();

            if (!centroCosto) {
                return grupos;
            }

            if (!grupos[centroCosto]) {
                grupos[centroCosto] = {
                    empleados: [],
                    cantidad: 0,
                };
            }

            grupos[centroCosto].empleados.push(empleado);
            grupos[centroCosto].cantidad += 1;

            return grupos;
        }, {});
    };

    const empleadosPorCentroCosto = useMemo(
        () => agruparEmpleadosPorCentroCosto(empleadosData),
        [empleadosData]
    );

    const obtenerEmpleadosConsiderados = () => {
        if (modoFiltro === 'TODOS') {
            return empleadosData;
        }

        if (modoFiltro === 'COSTA') {
            return empleadosData.filter(
                (empleado) =>
                    empleado.ciudad?.trim().toUpperCase() === 'GUAYAQUIL'
            );
        }

        if (modoFiltro === 'SIERRA') {
            return empleadosData.filter((empleado) => {
                const ciudad = empleado.ciudad?.trim().toUpperCase();

                return ciudad === 'QUITO' || ciudad === 'AMBATO';
            });
        }

        if (modoFiltro === 'CUSTOM') {
            const ciudadesSeleccionadas = new Set(
                parqueaderos
                    .filter((p) =>
                        parqueaderosSeleccionados.includes(p.codigo)
                    )
                    .map((p) => p.region?.trim().toUpperCase())
                    .filter(Boolean)
            );

            return empleadosData.filter((empleado) =>
                ciudadesSeleccionadas.has(
                    empleado.ciudad?.trim().toUpperCase()
                )
            );
        }

        return empleadosData;
    };

    const empleadosConsiderados = obtenerEmpleadosConsiderados();

    const cantidadEmpleadosConsiderados = empleadosConsiderados.length;

    const valorBase =
        cantidadEmpleadosConsiderados > 0 && parseFloat(montoTotal) > 0
            ? parseFloat(montoTotal) / cantidadEmpleadosConsiderados
            : 0;

            console.log('MODO FILTRO:', modoFiltro);

console.log(
    'EMPLEADOS CONSIDERADOS:',
    empleadosConsiderados.length
);

console.log(
    'VALOR BASE:',
    valorBase
);

    const parqueaderos = useMemo(() => {
        const mapaCatalogo = new Map(
            parqueaderosData.map((p) => [
                normalizarCodigo(p.codigo || p.cost_center_code),
                p,
            ])
        );

        return plantillaDistribucionData.map((item) => {
            const codigoLimpio = normalizarCodigo(
                item.codigo || item.cost_center_code
            );

            const infoCatalogo = mapaCatalogo.get(codigoLimpio);

            return {
                codigo: codigoLimpio,
                nombre:
                    item.nombre ||
                    item.name ||
                    infoCatalogo?.nombre ||
                    infoCatalogo?.name,
                region: infoCatalogo?.movilizacion || 'SIN_REGION',
                porcentajeBase: parseFloat(
                    item.porcentajeBase ??
                    item.percentage ??
                    0
                ),
            };
        });
    }, [parqueaderosData, plantillaDistribucionData]);

    const obtenerParqueaderosPorModo = () => {
        if (modoFiltro === 'COSTA') {
            return parqueaderos.filter(
                (p) =>
                    p.region?.toString().trim().toUpperCase() ===
                    'GUAYAQUIL'
            );
        }

        if (modoFiltro === 'SIERRA') {
            return parqueaderos.filter(
                (p) =>
                    p.region?.toString().trim().toUpperCase() ===
                    'QUITO'
            );
        }

        if (modoFiltro === 'CUSTOM') {
            return parqueaderos.filter((p) =>
                parqueaderosSeleccionados.includes(p.codigo)
            );
        }

        return parqueaderos;
    };

    const handleCalcular = () => {
        const listaAProcesar = obtenerParqueaderosPorModo();

        const resultados = calcularDistribucionFactura(
            montoTotal,
            listaAProcesar
        );

        setResultadosCalculo(resultados);
    };

    const listaAProcesar = obtenerParqueaderosPorModo();

    const estaDeshabilitado =
        !montoTotal ||
        parseFloat(montoTotal) <= 0 ||
        listaAProcesar.length === 0;

    return (
        <div className="factura-container">
            <section className="consult-section">
                <header className="factura-header">
                    <h1>
                        <span>Facturación</span>
                        <span>Distribuida</span>
                    </h1>
                </header>

                <main className="factura-main">
                    <section className="controles-bar">

                        <div className="input-group">
                            <label htmlFor="monto">
                                Monto Total Factura ($):
                            </label>

                            <input
                                id="monto"
                                type="number"
                                min="0"
                                step="any"
                                placeholder="0.00"
                                value={montoTotal}
                                onChange={(e) =>
                                    setMontoTotal(e.target.value)
                                }
                            />
                        </div>

                        <div className="filtro-action-group">
                            <FiltroParqueaderos
                                parqueaderos={parqueaderos}
                                onSeleccionarModo={setModoFiltro}
                                onSeleccionarParqueaderos={
                                    setParqueaderosSeleccionados
                                }
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
                </main>
            </section>

            {resultadosCalculo.length > 0 && (
                <section className="resultados-section">
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
                            {resultadosCalculo.map((item) => (
                                <tr key={item.codigo}>
                                    <td>{item.nombre}</td>
                                    <td>{item.porcentajeBase}%</td>
                                    <td>{item.porcentajeAjustado}%</td>
                                    <td>
                                        ${item.montoAsignado.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}
        </div>
    );
}