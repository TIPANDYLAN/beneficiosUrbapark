// src/pages/HomePage.jsx
import React, { useState } from 'react';
import { consultarCupo } from '../../api/postCupo.js';
import CompanyLogo from '../../components/companyLogo.jsx';
import './homePage.css';

export default function HomePage() {
  const [cedula, setCedula] = useState('');
  const [respuesta, setRespuesta] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!cedula.trim()) {
      setError('Por favor ingrese un número de cédula');
      setRespuesta(null);
      return;
    }

    setLoading(true);
    setError('');
    setRespuesta(null);

    try {
      const data = await consultarCupo(cedula);
      if (!data || (Array.isArray(data) && data.length === 0)) {
        setError('No es posible encontrar la persona solicitada');
        setRespuesta(null);
      } else {
        setRespuesta(data);
      }
    } catch (err) {
      setError(err.message || 'No es posible encontrar la persona solicitada');
      setRespuesta(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1>
        <span>Beneficios</span>{' '}
        <span translate="no">Urbapark</span>
      </h1>

      <form className="cedula-form" onSubmit={handleSubmit}>
        <label htmlFor="cedula">Ingrese su cédula</label>
        <input
          id="cedula"
          name="cedula"
          type="text"
          aria-label="Cedula"
          value={cedula}
          onChange={(event) => setCedula(event.target.value)}
          placeholder="Digite su número de cédula"
          maxLength={10}
          pattern="[0-9]*"
          inputMode="numeric"
          required
          autoComplete="off"
        />
        <button type="submit" className="consultar-btn" disabled={loading}>
          {loading ? 'Consultando...' : 'Consultar'}
        </button>
      </form>

      {error && <div className="api-message error">{error}</div>}

      {respuesta && Array.isArray(respuesta) && respuesta.length > 0 && (
        <div className="api-response">
          <div className="results">
            <div className="welcome">
              ¡Bienvenido/a {respuesta[0].nombres} {respuesta[0].apellidos}!
            </div>

            {respuesta.map((item, i) => (
              <div className="company-block" key={`${item.codEmpresa}-${i}`}>
                <CompanyLogo 
                  dominioLogo={item.logoEmpresa} 
                  nomEmpresa={item.nomEmpresa} 
                />
                <div className="company-info">
                  <h4 className="company-name">{item.nomEmpresa}</h4>
                  <p className="company-cupo">
                    {String(item.codEmpresa) === '000004'
                      ? 'Afiliado / Cuenta con el servicio'
                      : String(item.codEmpresa) === '000002'
                        ? 'Solicita información en Talento Humano'
                        : item.cupo && Number(item.cupo) > 0
                          ? `Cupo: ${item.cupo}`
                          : 'No tiene cupo disponible'}
                  </p>
                </div>
              </div>
            ))}

            {/* Tarjeta de Próximamente */}
            <div className="company-block coming-soon-block">
              <div className="coming-soon-logo">?</div>
              <div className="company-info">
                <h4 className="company-name">Próximamente</h4>
                <p className="company-cupo">Nuevos beneficios están en camino</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}