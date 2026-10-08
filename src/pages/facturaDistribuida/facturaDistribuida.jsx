import React, { useEffect, useState } from 'react';
import { getParqueaderos } from '../../api/getParqueaderos';
import FiltroParqueaderos from '../../components/filtroParqueaderos/filtroParqueaderos';
import './facturaDistribuida.css';

export default function FacturaDistribuida() {
    const [parqueaderos, setParqueaderos] = useState([]);
    const [montoTotal, setMontoTotal] = useState('0.00');
    const [parqueaderosSeleccionados, setParqueaderosSeleccionados] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function cargarDatos() {
            try {
                setCargando(true);
                const lista = await getParqueaderos();
                setParqueaderos(lista);
            } catch (err) {
                console.error(err);
                setError('No se pudieron cargar los parqueaderos.');
            } finally {
                setCargando(false);
            }
        }

        cargarDatos();
    }, []);

    if (cargando) return <p className="estado-carga">Cargando parqueaderos...</p>;
    if (error) return <p className="error">{error}</p>;

    const handleCalcular = () => {
        console.log('Monto:', montoTotal);
        console.log('Parqueaderos a procesar:', parqueaderosSeleccionados);

        // Aquí ejecutas la lógica para calcular o distribuir la factura
    };

    return (
        <div className="factura-container">
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
                            step="1"
                            value={montoTotal}
                            onChange={(e) => setMontoTotal(Number(e.target.value))}
                        />
                    </div>

                    <div className="filtro-action-group">
                        <FiltroParqueaderos
                            parqueaderos={parqueaderos}
                            onSeleccionarModo={(modo) => console.log('Modo seleccionado:', modo)}
                        />
                    </div>
                    <button
                        type="button"
                        className="btn-calcular"
                        onClick={handleCalcular}
                        disabled={!montoTotal || parqueaderosSeleccionados.length === 0}
                    >
                        <span>Calcular</span>
                    </button>
                </section>
            </main>
        </div>
    );
}