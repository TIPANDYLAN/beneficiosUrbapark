// src/App.js
import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { consultarCupo } from './api/postCupo';
import CompanyLogo from './components/companyLogo.jsx';
import './App.css';

function HomePage() {
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

      // Verificación: Si no devuelve datos o el arreglo está vacío
      if (!data || (Array.isArray(data) && data.length === 0)) {
        setError('No es posible encontrar la persona solicitada');
        setRespuesta(null);
      } else {
        setRespuesta(data);
        console.log('Respuesta:', data);
      }
    } catch (err) {
      setError(err.message || 'No es posible encontrar la persona solicitada');
      setRespuesta(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="home-page">
      <div className="home-grid">
        <div className="logo-panel">
          <img src="/logo192.png" alt="UrbaPark logo" className="brand-logo" />
        </div>

        <div className="mobile-header">
          <img src="/logo342.png" alt="Header" className="mobile-header-img" />
        </div>

        <div className="content-panel">
          <h1>
            <span style={{ color: '#ff7328' }}>Beneficios</span>{' '}
            <span style={{ color: '#362676' }} translate="no">Urbapark</span>
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

          {/* Mensaje de error formateado */}
          {error && <div className="api-message error">{error}</div>}

          {/* Resultados de la consulta */}
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
                        : item.cupo && Number(item.cupo) > 0
                          ? "Cupo: " + item.cupo
                          : 'No tiene cupo disponible'}
                    </p>
                  </div>
                </div>
              ))}

              {/* Tarjeta de Próximamente */}
              <div className="company-block coming-soon-block">
                <div className="coming-soon-logo">
                  ?
                </div>
                <div className="company-info">
                  <h4 className="company-name">Próximamente</h4>
                  <p className="company-cupo">Nuevos beneficios están en camino</p>
                </div>
              </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;