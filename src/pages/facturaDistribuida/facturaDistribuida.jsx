import React, { useEffect, useState } from 'react';
import { getParqueaderos } from '../../api/getParqueaderos';
import { getDistribucion } from '../../api/getDistribucion';
import { calcularDistribucionFactura } from '../../utils/calculoDistribucion';
import FiltroParqueaderos from '../../components/filtroParqueaderos/filtroParqueaderos';
import './facturaDistribuida.css';

export default function FacturaDistribuida() {
    const [parqueaderos, setParqueaderos] = useState([]);
    const [montoTotal, setMontoTotal] = useState('');
    const [modoFiltro, setModoFiltro] = useState('TODOS');
    const [parqueaderosSeleccionados, setParqueaderosSeleccionados] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [resultadosCalculo, setResultadosCalculo] = useState([]);

    useEffect(() => {
        let cancelado = false;

        async function cargarDatos() {
            try {
                setCargando(true);

                const [listaCatalogo, plantillaDistribucion] = await Promise.all([
                    getParqueaderos(),
                    getDistribucion(),
                ]);

                if (cancelado) return;

                const normalizarCodigo = (code) => String(code || '').trim();

                // 1. Crear mapa del catálogo para consultar rápido la región por código
                const mapaCatalogo = new Map(
                    listaCatalogo.map((p) => [
                        normalizarCodigo(p.codigo || p.cost_center_code),
                        p,
                    ])
                );

                // 2. Iterar ÚNICAMENTE sobre la plantilla y adjuntar la región del catálogo
                const listaCombinada = plantillaDistribucion.map((item) => {
                    const codigoLimpio = normalizarCodigo(item.codigo || item.cost_center_code);
                    const infoCatalogo = mapaCatalogo.get(codigoLimpio);

                    return {
                        codigo: codigoLimpio,
                        nombre: item.nombre || item.name || infoCatalogo?.nombre || infoCatalogo?.name,
                        region: infoCatalogo?.movilizacion || 'SIN_REGION', // Asigna la región del catálogo
                        porcentajeBase: parseFloat(item.porcentajeBase ?? item.percentage ?? 0),
                    };
                });

                console.log('Parqueaderos a procesar (solo plantilla + región):', listaCombinada);

                setParqueaderos(listaCombinada);
                setParqueaderosSeleccionados(listaCombinada.map((p) => p.codigo));
            } catch (err) {
                if (!cancelado) {
                    console.error('Error cargando datos de facturación:', err);
                    setError('No se pudieron cargar los parqueaderos o la plantilla de distribución.');
                }
            } finally {
                if (!cancelado) {
                    setCargando(false);
                }
            }
        }

        cargarDatos();

        return () => {
            cancelado = true;
        };
    }, []);

    const obtenerParqueaderosPorModo = () => {
        if (modoFiltro === 'COSTA') {
            return parqueaderos.filter((p) => p.region?.toString().trim().toUpperCase() === 'GUAYAQUIL');
        }
        if (modoFiltro === 'SIERRA') {
            return parqueaderos.filter((p) => p.region?.toString().trim().toUpperCase() === 'QUITO');
        }
        if (modoFiltro === 'CUSTOM') {
            return parqueaderos.filter((p) => parqueaderosSeleccionados.includes(p.codigo));
        }
        return parqueaderos; // 'TODOS'
    };

    const handleCalcular = () => {
        const listaAProcesar = obtenerParqueaderosPorModo();
        const resultados = calcularDistribucionFactura(montoTotal, listaAProcesar);
        setResultadosCalculo(resultados);
        console.log(resultados)
    };

    if (cargando) return <p className="estado-carga">Cargando parqueaderos y plantilla...</p>;
    if (error) return <p className="error">{error}</p>;

    const listaAProcesar = obtenerParqueaderosPorModo();
    const estaDeshabilitado = !montoTotal || parseFloat(montoTotal) <= 0 || listaAProcesar.length === 0;

    return (
        <div className="factura-container">
            <section className='consult-section'>

                <header className="factura-header">
                    <h1>
                        <span>Facturación</span>
                        <span>Distribuida</span>
                    </h1>
                </header>

                <main className="factura-main">
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
                                onChange={(e) => setMontoTotal(e.target.value)}
                            />
                        </div>

                        <div className="filtro-action-group">
                            <FiltroParqueaderos
                                parqueaderos={parqueaderos}
                                onSeleccionarModo={(modo) => setModoFiltro(modo)}
                                onSeleccionarParqueaderos={(codigos) => setParqueaderosSeleccionados(codigos)}
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
                                    <td>${item.montoAsignado.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}
        </div>
    );
}