import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';

function HomePage() {
  return (
    <main className="home-page">
      <div className="home-grid">
        <div className="logo-panel">
          <img src="/logo192.png" alt="UrbaPark logo" className="brand-logo" />
        </div>

        <div className="content-panel">
          <h1>
            <span style={{color: "#ff7328"}}>Beneficios</span>{" "}
            <span style={{color: "#362676"}}>Urbapark</span>
          </h1>

          <form className="cedula-form">
            <label htmlFor="cedula">Ingrese su cédula</label>
            <input
              id="cedula"
              name="cedula"
              type="text"
              aria-label="Cedula"
              placeholder="Digite su número de cédula"
            />
          </form>
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
