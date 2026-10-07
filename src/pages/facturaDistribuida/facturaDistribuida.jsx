import React from 'react';
import { useEffect, useState } from 'react';
import { getParqueaderos } from '../../api/getParqueaderos';
import './facturaDistribuida.css';

export default function FacturaDistribuida() {
    const [parqueaderos, setParqueaderos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function cargarDatos() {
            try {
                setCargando(true);
                const lista = await getParqueaderos();
                setParqueaderos(lista);
            } catch (err) {
                setError('No se pudieron cargar los parqueaderos.');
            } finally {
                setCargando(false);
            }
        }
        cargarDatos();
    }, []);

    if (cargando) return <p>Cargando parqueaderos...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="factura-container">
            <header className="factura-header">
                <h1>
                    <span>Facturación</span>
                    <span>Distribuida</span>
                </h1>
            </header>

            <main className="factura-main">
                <h2>Parqueaderos Registrados ({parqueaderos.length})</h2>
                <ul>
                    {parqueaderos.map((p) => (
                        <li key={p.codigo}>
                            <strong>[{p.movilizacion}]</strong> {p.nombre} (Cód: {p.codigo})
                        </li>
                    ))}
                </ul>
            </main>

        </div>
    );
}