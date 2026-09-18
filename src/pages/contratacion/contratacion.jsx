// src/pages/Contratacion.jsx
import React, { useState, Suspense } from 'react';
import { useLoaderData, Await } from 'react-router-dom';
import { generarPaquetePdfs } from '../../utils/generarPdfs.js';
import './contratacion.css';

export default function Contratacion() {
  const { empleadosData } = useLoaderData();
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState('');
  const [objetoEmpleado, setObjetoEmpleado] = useState(null);
  const [generando, setGenerando] = useState(false);
  const [progreso, setProgreso] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!objetoEmpleado) return;

    setGenerando(true);
    setProgreso(0);

    try {
      // Dispara la generación del ZIP con todos los PDF
      await generarPaquetePdfs(objetoEmpleado, (porcentaje) => {
        setProgreso(porcentaje);
      });
    } catch (error) {
      console.error('Error al generar documentación:', error);
      alert('Ocurrió un error al generar la documentación.');
    } finally {
      setGenerando(false);
    }
  };

  return (
    <div className="pagina-contratacion">
      <header className="header-seccion">
        <h1>
          <span>Módulo</span> <span>de Contratación</span>
        </h1>
      </header>
      
      <label htmlFor="empleado-input">
        Seleccione un colaborador para continuar con el proceso.
      </label>

      <form className="form-container" onSubmit={handleSubmit}>
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
                    onChange={(e) => {
                      const valor = e.target.value;
                      setEmpleadoSeleccionado(valor);

                      // Busca y guarda el objeto de datos completo del colaborador seleccionado
                      const empEncontrado = lista.find((emp) => {
                        const nombreCompleto = `${emp.nombre || emp.nombres || ''} ${emp.apellido || emp.apellidos || ''}`.trim();
                        return nombreCompleto.toLowerCase() === valor.trim().toLowerCase();
                      });

                      setObjetoEmpleado(empEncontrado || null);
                    }}
                    placeholder="Escriba para buscar un empleado..."
                    disabled={generando}
                  />
                  <datalist id="empleados-list">
                    {lista.map((emp, index) => {
                      const nombreCompleto = `${emp.nombre || emp.nombres || ''} ${emp.apellido || emp.apellidos || ''}`.trim() || 'Sin nombre';
                      return <option key={emp.id || emp.cedula || index} value={nombreCompleto} />;
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
          disabled={!objetoEmpleado || generando}
        >
          {generando ? `Generando... (${progreso}%)` : 'Generar documentación'}
        </button>
      </form>
    </div>
  );
}