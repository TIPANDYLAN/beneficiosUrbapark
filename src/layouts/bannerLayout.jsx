// src/layouts/BannerLayout.jsx

import React from 'react';
import {
  Outlet,
  NavLink,
  useLocation,
  useNavigation,
} from 'react-router-dom';

import './bannerLayout.css';

export default function BannerLayout() {
  const location = useLocation();
  const navigation = useNavigation();
  const rutasSinHeader = ['/'];
  const mostrarHeader = !rutasSinHeader.includes(location.pathname);
  const estaCargando = navigation.state === 'loading';

  return (
    <div className="page-with-banner">

      {/* Barra global de carga */}
      {estaCargando && (
        <div className="global-loading-bar">
          <div className="global-loading-progress"></div>
        </div>
      )}

      {/* Layout completo */}
      <aside className="page-banner-sidebar">
        <img src="/logo192.png" alt="UrbaPark Banner" />
      </aside>

      <div className="main-container">

        {mostrarHeader && (
          <header className="main-header">
            <nav className="header-nav">

              <NavLink
                to="/contratacion"
                className={({ isActive }) =>
                  isActive
                    ? 'nav-link active'
                    : 'nav-link'
                }
              >
                Contratación
              </NavLink>

              <NavLink
                to="/factura-distribuida"
                className={({ isActive }) =>
                  isActive
                    ? 'nav-link active'
                    : 'nav-link'
                }
              >
                Distribuir Facturas
              </NavLink>

            </nav>
          </header>
        )}

        <div className="mobile-header">
          <img
            src="/logo342.png"
            alt="Header"
            className="mobile-header-img"
          />
        </div>

        {/* Contenido */}
        <main
          className={
            estaCargando
              ? 'page-banner-content page-loading-state'
              : 'page-banner-content'
          }
        >
          <Outlet />
        </main>

      </div>
    </div>
  );
}