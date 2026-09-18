// src/layouts/BannerLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

export default function BannerLayout() {
  return (
    <div className="page-with-banner">
      {/* Columna izquierda con el banner fijo */}
      <aside className="page-banner-sidebar">
        <img src="/logo192.png" alt="UrbaPark Banner" />
      </aside>
      <div className="mobile-header">
          <img src="/logo342.png" alt="Header" className="mobile-header-img" />
      </div>
      {/* Columna derecha que cambiará según la ruta */}
      <main className="page-banner-content">
        <Outlet />
      </main>
    </div>
  );
}