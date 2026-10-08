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