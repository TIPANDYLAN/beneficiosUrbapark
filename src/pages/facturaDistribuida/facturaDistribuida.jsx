import React, { useEffect, useState } from 'react';
import { getParqueaderos } from '../../api/getParqueaderos';
import FiltroParqueaderos from '../../components/filtroParqueaderos/filtroParqueaderos';
import './facturaDistribuida.css';

export default function FacturaDistribuida() {
  const [parqueaderos, setParqueaderos] = useState([]);
  const [montoTotal, setMontoTotal] = useState(0);

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
              step="0.01"
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
        </section>
      </main>
    </div>
  );
}