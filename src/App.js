// src/App.js
import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import BannerLayout from './layouts/bannerLayout.jsx';
import HomePage from './pages/homePage/homePage.jsx';
import Contratacion from './pages/contratacion/contratacion.jsx';
import { obtenerEmpleados } from './api/getEmpleados.js';
import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <BannerLayout />, // 👈 Todas las rutas hijas tendrán el banner izquierdo
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
    ],
  },
  {
    path: '/otra-pagina',
    element: <div>Página sin banner lateral</div>,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}