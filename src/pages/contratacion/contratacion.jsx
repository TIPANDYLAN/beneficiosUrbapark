// src/pages/Contratacion.jsx
import React, { useState, Suspense } from 'react';
import { useLoaderData, Await } from 'react-router-dom';
import './contratacion.css'

export default function Contratacion() {
  const { empleadosData } = useLoaderData();
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState('');

  return (
    <div className="pagina-contratacion">
      <header className="header-seccion">
        <h1>
          <span>Módulo</span> {" "}
          <span>de Contratación</span>
        </h1>
      </header>
      <label>Seleccione un colaborador para continuar con el proceso.</label>

      <form className="form-container">
        <Suspense
          fallback={
            <div className="campo-grupo">
              <input
                id="empleado-input-disabled"
                type="text"
                placeholder="Cargando empleados..."
                disabled
              />
            </div>
          }
        >
          <Await
            resolve={empleadosData}
            errorElement={<p className="error-text">❌ Error al cargar los empleados.</p>}
          >
            {(empleados) => {
              const lista = Array.isArray(empleados) ? empleados : empleados?.empleados || [];

              return (
                <div className="campo-grupo">
                  <input
                    id="empleado-input"
                    type="text"
                    list="empleados-list"
                    value={empleadoSeleccionado}
                    onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
                    placeholder="Escriba para buscar un empleado..."
                  />
                  <datalist id="empleados-list">
                    {lista.map((emp, index) => {
                      const nombreCompleto = `${emp.nombre || ''} ${emp.apellido || ''}`.trim() || 'Sin nombre';
                      return <option key={emp.id || index} value={nombreCompleto} />;
                    })}
                  </datalist>
                </div>
              );
            }}
          </Await>
        </Suspense>
        <button 
          type="submit" 
          className="btn" 
          disabled={!empleadoSeleccionado.trim()}
        >
          Generar documentación
        </button>
      </form>
    </div>
  );
}