// src/pages/Contratacion.jsx
import React, { useState, useRef, Suspense } from 'react';
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
  { id: 'composicionRemuneracion', nombre: 'Composición de Remuneración' },
];

const hoyFormatted = new Date().toISOString().split('T')[0];

export default function Contratacion() {
  const { empleadosData } = useLoaderData();
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState('');
  const [objetoEmpleado, setObjetoEmpleado] = useState(null);
  const [generando, setGenerando] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [montoBono, setMontoBono] = useState('0.00');
  const [documentosSeleccionados, setDocumentosSeleccionados] = useState([]);
  const [fechaEmision, setFechaEmision] = useState(hoyFormatted);

  const handleToggleDocumento = (id) => {
    setDocumentosSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((docId) => docId !== id) : [...prev, id]
    );
  };

  const handleToggleTodos = () => {
    if (documentosSeleccionados.length === DOCUMENTOS_DISPONIBLES.length) {
      setDocumentosSeleccionados([]);
    } else {
      setDocumentosSeleccionados(DOCUMENTOS_DISPONIBLES.map((doc) => doc.id));
    }
  };

  const isDraggingBono = useRef(false);

  const handleCardClick = (e, docId) => {
    if (isDraggingBono.current || e.target.closest('.campo-bono-inline input')) {
      isDraggingBono.current = false;
      return;
    }
    handleToggleDocumento(docId);
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
      await generarPaquetePdfs(
        objetoEmpleado,
        documentosSeleccionados,
        { montoBono: parseFloat(montoBono) || 0, fechaEmision: fechaEmision  },
        (porcentaje) => {
          setProgreso(porcentaje);
        }
      );
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
              <label htmlFor="fecha-input" style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                Fecha de emisión de los documentos:
              </label>
              <input
                className="fecha-input"
                type="date"
                value={fechaEmision}
                onChange={(e) => setFechaEmision(e.target.value)}
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

                      const empEncontrado = lista.find((emp) => {
                        const nombreCompleto = `${emp.nombre || emp.nombres || ''} ${emp.apellido || emp.apellidos || ''
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
                      const nombreCompleto = `${emp.nombre || emp.nombres || ''} ${emp.apellido || emp.apellidos || ''
                        }`.trim() || 'Sin nombre';
                      return <option key={emp.id || emp.cedula || index} value={nombreCompleto} />;
                    })}
                  </datalist>
                  <label htmlFor="fecha-input" style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                    Fecha de emisión de los documentos:
                  </label>
                  <input
                    className="fecha-input"
                    type="date"
                    value={fechaEmision}
                    onChange={(e) => setFechaEmision(e.target.value)}
                    disabled={generando}
                  />
                </div>
              );
            }}
          </Await>
        </Suspense>

        {/* Sección de Selección de Documentos */}
        <div className="seccion-documentos" style={{ marginBottom: '20px' }}>
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
                textDecoration: 'none',
              }}
            >
              {todosSeleccionados ? 'Deseleccionar todos' : 'Seleccionar todos'}
            </button>
          </div>

          <div
            className="grid-documentos"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
            }}
          >
            {DOCUMENTOS_DISPONIBLES.map((doc) => {
              const estaSeleccionado = documentosSeleccionados.includes(doc.id);
              const esComposicion = doc.id === 'composicionRemuneracion';
              const ocupaDosColumnas = esComposicion && estaSeleccionado;

              return (
                <div
                  key={doc.id}
                  className={`wrapper-documento ${ocupaDosColumnas ? 'span-dos-columnas' : ''}`}
                >
                  <div
                    className="checklist-box"
                    onMouseDown={(e) => {
                      if (e.target.closest('.campo-bono-inline input')) {
                        isDraggingBono.current = true;
                      } else {
                        isDraggingBono.current = false;
                      }
                    }}
                    onClick={(e) => handleCardClick(e, doc.id)}
                  >
                    <input
                      type="checkbox"
                      checked={estaSeleccionado}
                      readOnly
                      disabled={generando}
                    />
                    <span className="checklist-texto">{doc.nombre}</span>

                    {esComposicion && estaSeleccionado && (
                      <div className="campo-bono-inline">
                        <span className="bono-label">Monto:</span>

                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={montoBono}
                          onChange={(e) => setMontoBono(e.target.value)}
                          disabled={generando}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            isDraggingBono.current = true;
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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