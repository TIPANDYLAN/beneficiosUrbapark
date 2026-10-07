// src/App.js
import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import BannerLayout from './layouts/bannerLayout.jsx';
import HomePage from './pages/homePage/homePage.jsx';
import Contratacion from './pages/contratacion/contratacion.jsx';
import { obtenerEmpleados } from './api/getEmpleados.js';
import FacturaDistribuida from './pages/facturaDistribuida/facturaDistribuida.jsx';
import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <BannerLayout />,
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
        path: '/factura-distribuida',
        element: <FacturaDistribuida/>,
      }
    ],
  },
  {
    path: '/otra',
    element: <p>Pagina fuera de las creadas</p> ,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}