import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';

function HomePage() {
  const [cedula, setCedula] = useState('');
  const [respuesta, setRespuesta] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const valor = cedula.trim();

    if (!valor) {
      setError('Debe ingresar una cédula.');
      setRespuesta(null);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        'https://sitecdesarrollo-n8n.9hwbyc.easypanel.host/webhook/empleados/cupo',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cedula: valor }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'No se pudo consultar la información.');
      }

      setRespuesta(data);
    } catch (err) {
      setError(err.message || 'Ocurrió un error al consultar la cédula.');
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
            />

            <button type="submit" className="consultar-btn" disabled={loading}>
              {loading ? 'Consultando...' : 'Consultar'}
            </button>
          </form>

          {error && <div className="api-message error">{error}</div>}

          {respuesta && (
            <div className="api-response">
              <h3>Respuesta</h3>
              <pre>{JSON.stringify(respuesta, null, 2)}</pre>
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
