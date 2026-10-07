import React, { useState, useRef, useEffect } from 'react';
import './FiltroParqueaderos.css';

export default function FiltroParqueaderos({
  parqueaderos = [],
  onSeleccionarModo,
  onSeleccionarParqueaderos,
}) {
  const [modo, setModo] = useState('TODOS'); // 'COSTA' | 'SIERRA' | 'CUSTOM'
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [codigosSeleccionados, setCodigosSeleccionados] = useState([]);
  const popoverRef = useRef(null);

  // Inicializar seleccionando todos los parqueaderos al cargar la lista
  useEffect(() => {
    if (parqueaderos.length > 0 && codigosSeleccionados.length === 0) {
      setCodigosSeleccionados(parqueaderos.map((p) => p.codigo));
    }
  }, [parqueaderos]);

  const handleSeleccionarModo = (nuevoModo) => {
    setModo(nuevoModo);

    if (nuevoModo === 'CUSTOM') {
      setIsCustomOpen(true);
    } else {
      setIsCustomOpen(false);
    }

    if (onSeleccionarModo) {
      onSeleccionarModo(nuevoModo);
    }
  };

  // Checkbox individual
  const handleToggleCodigo = (codigo) => {
    setCodigosSeleccionados((prev) =>
      prev.includes(codigo)
        ? prev.filter((item) => item !== codigo)
        : [...prev, codigo]
    );
  };

  // Checkbox 'Seleccionar Todos'
  const handleToggleTodos = (e) => {
    if (e.target.checked) {
      setCodigosSeleccionados(parqueaderos.map((p) => p.codigo));
    } else {
      setCodigosSeleccionados([]);
    }
  };

  const handleAplicarCustom = () => {
    setIsCustomOpen(false);
    if (onSeleccionarParqueaderos) {
      onSeleccionarParqueaderos(codigosSeleccionados);
    }
  };

  const todosSeleccionados =
    parqueaderos.length > 0 &&
    codigosSeleccionados.length === parqueaderos.length;

  return (
    <div className="filtro-wrapper" ref={popoverRef}>
      {/* Barra Segmentada */}
      <div className="filtro-segmented-bar">
        <button
          type="button"
          className={`segmented-btn ${modo === 'TODOS' ? 'active' : ''}`}
          onClick={() => handleSeleccionarModo('TODOS')}
        >
          Todos
        </button>
        <button
          type="button"
          className={`segmented-btn ${modo === 'COSTA' ? 'active' : ''}`}
          onClick={() => handleSeleccionarModo('COSTA')}
        >
          Costa
        </button>

        <button
          type="button"
          className={`segmented-btn ${modo === 'SIERRA' ? 'active' : ''}`}
          onClick={() => handleSeleccionarModo('SIERRA')}
        >
          Sierra
        </button>

        <button
          type="button"
          className={`segmented-btn ${modo === 'CUSTOM' ? 'active' : ''}`}
          onClick={() => handleSeleccionarModo('CUSTOM')}
        >
          Personalizado
        </button>
      </div>

      {/* Modal Desplegable para Selección Personalizada */}
      {isCustomOpen && modo === 'CUSTOM' && (
        <div className="popover-custom-content">
          <div className="popover-header">
            <h4>Parqueaderos</h4>
            <label className="select-all-label">
              <input
                type="checkbox"
                checked={todosSeleccionados}
                onChange={handleToggleTodos}
              />
              <span>Todos</span>
            </label>
          </div>

          <div className="custom-lista-parqueaderos">
            {parqueaderos.length > 0 ? (
              parqueaderos.map((p) => {
                const isChecked = codigosSeleccionados.includes(p.codigo);
                return (
                  <label key={p.codigo} className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleCodigo(p.codigo)}
                    />
                    <span className="p-nombre">{p.nombre}</span>
                  </label>
                );
              })
            ) : (
              <p className="sin-parqueaderos">No hay parqueaderos</p>
            )}
          </div>

          <div className="popover-footer">
            <span className="contador-seleccionados">
              {codigosSeleccionados.length} seleccionados
            </span>
            <button
              type="button"
              className="btn-aplicar"
              onClick={handleAplicarCustom}
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}