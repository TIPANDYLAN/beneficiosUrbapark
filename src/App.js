import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  defer,
} from 'react-router-dom';

import BannerLayout from './layouts/bannerLayout.jsx';
import HomePage from './pages/homePage/homePage.jsx';
import Contratacion from './pages/contratacion/contratacion.jsx';
import FacturaDistribuida from './pages/facturaDistribuida/facturaDistribuida.jsx';

import { obtenerEmpleados } from './api/getEmpleados.js';
import { getParqueaderos } from './api/getParqueaderos.js';
import { getDistribucion } from './api/getDistribucion.js';

import './index.css';

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
        loader: async () => {
          return {
            empleadosData: await obtenerEmpleados(),
          };
        },
      },

      {
        path: 'factura-distribuida',
        element: <FacturaDistribuida />,
        loader: async () => {
          const [
            empleadosData,
            parqueaderosData,
            distribucionData,
          ] = await Promise.all([
            obtenerEmpleados(),
            getParqueaderos(),
            getDistribucion(),
          ]);

          const grupoBase = distribucionData.gruposSupervision?.[0]?.distribucion || [];
          const plantillaDistribucionData = grupoBase.map((item) => ({
            codigo: item.codigoParqueadero,
            nombre: item.nombreParqueadero,
            porcentajeBase: item.porcentaje,
          }));

          return {
            empleadosData,
            parqueaderosData,
            plantillaDistribucionData,
            gruposSupervision: distribucionData.gruposSupervision || [],
            relacionEmpleadosGrupos: distribucionData.relacionEmpleadosGrupos || [],
          };
        },
      },
    ],
  },

  {
    path: '/otra',
    element: <p>Pagina fuera de las creadas</p>,
  },

  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}