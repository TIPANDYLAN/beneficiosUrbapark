// src/pages/Contratacion.jsx
import React, { useState, Suspense } from 'react';
import { useLoaderData, Await } from 'react-router-dom';
import { generarPaquetePdfs } from '../../utils/generarPdfs.js';
import './contratacion.css';

const DOCUMENTOS_DISPONIBLES = [
  { id: 'actaReglamentoInterno', nombre: 'Acta de Reglamento Interno' },
  { id: 'consentimientoAlcoholDrogas', nombre: 'Consentimiento Alcohol y Drogas' },
  { id: 'declaracionConsentimientoSSO', nombre: 'Declaración y Consentimiento SSO' },
  { id: 'adendumAcuerdoVoluntades', nombre: 'Adéndum y Acuerdo de Voluntades' },
  { id: 'autorizacionDescuentoSeguro', nombre: 'Autorización Descuento Seguro' },
  { id: 'cartaAcumulacionSueldos', nombre: 'Carta Acumulación de Sueldos' },
  { id: 'consentimientoMediosElectronicos', nombre: 'Consentimiento Medios Electrónicos' },
  { id: 'declaracionDatosBiometricos', nombre: 'Declaración Datos Biométricos' },
];

export default function Contratacion() {
  const { empleadosData } = useLoaderData();
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState('');
  const [objetoEmpleado, setObjetoEmpleado] = useState(null);
  const [generando, setGenerando] = useState(false);
  const [progreso, setProgreso] = useState(0);

  // Estado para los checkboxes (por defecto todos seleccionados)
  const [documentosSeleccionados, setDocumentosSeleccionados] = useState(
    DOCUMENTOS_DISPONIBLES.map((doc) => doc.id)
  );

  // Handler para marcar / desmarcar individualmente
  const handleToggleDocumento = (id) => {
    setDocumentosSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((docId) => docId !== id) : [...prev, id]
    );
  };

  // Handler para seleccionar / deseleccionar todos a la vez
  const handleToggleTodos = () => {
    if (documentosSeleccionados.length === DOCUMENTOS_DISPONIBLES.length) {
      setDocumentosSeleccionados([]);
    } else {
      setDocumentosSeleccionados(DOCUMENTOS_DISPONIBLES.map((doc) => doc.id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!objetoEmpleado) return;

    if (documentosSeleccionados.length === 0) {
      alert('Por favor, selecciona al menos un documento para generar.');
      return;
    }

    setGenerando(true);
    setProgreso(0);

    try {
      // Pasa el objeto del empleado y la lista de IDs seleccionados a la utilidad
      await generarPaquetePdfs(objetoEmpleado, documentosSeleccionados, (porcentaje) => {
        setProgreso(porcentaje);
      });
    } catch (error) {
      console.error('Error al generar documentación:', error);
      alert('Ocurrió un error al generar la documentación.');
    } finally {
      setGenerando(false);
    }
  };

  const todosSeleccionados =
    documentosSeleccionados.length === DOCUMENTOS_DISPONIBLES.length;

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
                        const nombreCompleto = `${emp.nombre || emp.nombres || ''} ${
                          emp.apellido || emp.apellidos || ''
                        }`.trim();
                        return nombreCompleto.toLowerCase() === valor.trim().toLowerCase();
                      });

                      setObjetoEmpleado(empEncontrado || null);
                    }}
                    placeholder="Escriba para buscar un empleado..."
                    disabled={generando}
                  />
                  <datalist id="empleados-list">
                    {lista.map((emp, index) => {
                      const nombreCompleto = `${emp.nombre || emp.nombres || ''} ${
                        emp.apellido || emp.apellidos || ''
                      }`.trim() || 'Sin nombre';
                      return <option key={emp.id || emp.cedula || index} value={nombreCompleto} />;
                    })}
                  </datalist>
                </div>
              );
            }}
          </Await>
        </Suspense>

        {/* Sección de Selección de Documentos */}
        <div className="seccion-documentos" style={{ marginTop: '20px', marginBottom: '20px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px',
            }}
          >
            <span style={{ fontWeight: 'bold' }}>Documentos a incluir:</span>
            <button
              type="button"
              onClick={handleToggleTodos}
              disabled={generando}
              style={{
                background: 'none',
                border: 'none',
                color: '#0056b3',
                cursor: 'pointer',
                fontSize: '0.85rem',
                textDecoration: 'underline',
              }}
            >
              {todosSeleccionados ? 'Deseleccionar todos' : 'Seleccionar todos'}
            </button>
          </div>

          <div
            className="grid-documentos"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '10px',
            }}
          >
            {DOCUMENTOS_DISPONIBLES.map((doc) => (
              <div className="checklist-box">
                <label
                  key={doc.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: generando ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={documentosSeleccionados.includes(doc.id)}
                    onChange={() => handleToggleDocumento(doc.id)}
                    disabled={generando}
                  />
                  <span>{doc.nombre}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="btn"
          disabled={!objetoEmpleado || generando || documentosSeleccionados.length === 0}
        >
          {generando
            ? `Generando... (${progreso}%)`
            : `Generar documentación (${documentosSeleccionados.length})`}
        </button>
      </form>
    </div>
  );
}