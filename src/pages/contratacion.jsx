import React, { useState, useEffect } from 'react';
import { obtenerEmpleados } from '../api/getEmpleados';

export default function Contratacion() {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState('');

  useEffect(() => {
    const cargarEmpleados = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await obtenerEmpleados();
        const lista = Array.isArray(data) ? data : data?.empleados || data?.data || [];
        setEmpleados(lista);
      } catch (err) {
        console.error('Error al cargar empleados:', err);
        setError(err.message || 'Ocurrió un error al obtener la lista de empleados.');
      } finally {
        setLoading(false);
      }
    };

    cargarEmpleados();
  }, []);

  return (
    <div>
      {/* Indicador de carga */}
      {loading && <p>Cargando empleados...</p>}

      {/* Mensaje de error */}
      {error && <p>❌ {error}</p>}

      {/* Campo editable con lista de opciones (Select con buscador) */}
      {!loading && !error && (
        <div>
          <label htmlFor="empleado-input">Empleado: </label>
          <input
            id="empleado-input"
            type="text"
            list="empleados-list"
            value={empleadoSeleccionado}
            onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
            placeholder="Escriba para buscar un empleado..."
          />
          <datalist id="empleados-list">
            {empleados.map((emp, index) => {
              const nombreCompleto = `${emp.nombre || ''} ${emp.apellido || ''}`.trim() || 'Sin nombre';
              return (
                <option key={emp.id || index} value={nombreCompleto} />
              );
            })}
          </datalist>
        </div>
      )}
    </div>
  );
}