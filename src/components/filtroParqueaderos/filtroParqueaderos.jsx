import React, { useState } from 'react';
import './FiltroParqueaderos.css';

export default function FiltroParqueaderos({ onSeleccionarModo }) {
  const [modo, setModo] = useState('SIERRA'); // 'COSTA' | 'SIERRA' | 'CUSTOM'

  const handleSeleccionar = (nuevoModo) => {
    setModo(nuevoModo);
    if (onSeleccionarModo) {
      onSeleccionarModo(nuevoModo);
    }
  };

  return (
    <div className="filtro-segmented-bar">
      <button
        type="button"
        className={`segmented-btn ${modo === 'COSTA' ? 'active' : ''}`}
        onClick={() => handleSeleccionar('COSTA')}
      >
        Costa
      </button>

      <button
        type="button"
        className={`segmented-btn ${modo === 'SIERRA' ? 'active' : ''}`}
        onClick={() => handleSeleccionar('SIERRA')}
      >
        Sierra
      </button>

      <button
        type="button"
        className={`segmented-btn ${modo === 'CUSTOM' ? 'active' : ''}`}
        onClick={() => handleSeleccionar('CUSTOM')}
      >
        Personalizado
      </button>
    </div>
  );
}