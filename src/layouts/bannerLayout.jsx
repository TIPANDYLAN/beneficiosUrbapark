// src/layouts/BannerLayout.jsx
import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import './bannerLayout.css';

export default function BannerLayout() {
  const location = useLocation();

  // 1. Define las rutas donde NO quieres que se muestre el header
  const rutasSinHeader = ['/']; // Reemplaza con la ruta deseada

  // 2. Comprueba si la ruta actual está en la lista de exclusión
  const mostrarHeader = !rutasSinHeader.includes(location.pathname);

  return (
    <div className="page-with-banner">
      {/* Columna izquierda con el banner fijo */}
      <aside className="page-banner-sidebar">
        <img src="/logo192.png" alt="UrbaPark Banner" />
      </aside>

      <div className="main-container">
        {/* Se renderiza el header solo si mostrarHeader es true */}
        {mostrarHeader && (
          <header className="main-header">
            <nav className="header-nav">
              <NavLink 
                to="/declaracion-consentimiento" 
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                Ditribuir Facturas
              </NavLink>
              <NavLink 
                to="/contratacion" 
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                Contratación
              </NavLink>
            </nav>
          </header>
        )}

        <div className="mobile-header">
          <img src="/logo342.png" alt="Header" className="mobile-header-img" />
        </div>

        {/* Columna derecha que cambiará según la ruta */}
        <main className="page-banner-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}