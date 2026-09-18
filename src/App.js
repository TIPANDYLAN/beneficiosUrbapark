// src/App.js
import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { obtenerEmpleados } from './api/getEmpleados';
import HomePage from './pages/homePage/homePage.jsx';
import Contratacion from './pages/contratacion/contratacion.jsx';
import './index.css';

// Layout principal para mantener la envoltura visual global
function Layout() {
  return (
    <div className="app-shell">
      <Outlet />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'contratacion',
        element: <Contratacion />,
        loader: () => {
          return {
            empleadosData: obtenerEmpleados(),
          };
        },
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}