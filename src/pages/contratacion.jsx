import React, { useState } from 'react';
import { obtenerEmpleados } from '../api/getEmpleados';

export default function Contratacion() {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCargarEmpleados = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await obtenerEmpleados();

      // Normaliza la respuesta si n8n devuelve array directo o envuelto ({ data: [...] })
      const lista = Array.isArray(data) ? data : data?.empleados || data?.data || [];
      setEmpleados(lista);
    } catch (err) {
      console.error('Error al cargar empleados:', err);
      setError(err.message || 'Ocurrió un error al obtener la lista de empleados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => handleCargarEmpleados()}
        disabled={loading}
      >
        {loading ? 'Cargando empleados...' : 'Consultar Empleados'}
      </button>

      {/* Mensaje de error */}
      {error && (
        <p>
          ❌ {error}
        </p>
      )}

      {/* Listado de empleados */}
      {empleados.length > 0 && (
        <div>
          <h3>Empleados Activos ({empleados.length})</h3>
          <ul>
            {empleados.map((emp, index) => (
              <li key={emp.id || index}>
                <span><strong>Nombre:</strong> {emp.nombre} {emp.apellido}</span>
                {emp.cedula && <span> | <strong>Cédula:</strong> {emp.cedula}</span>}
                {emp.cargo && <span> | <strong>Cargo:</strong> {emp.cargo}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}