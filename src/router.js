import { createBrowserRouter } from 'react-router-dom';
import Contratacion from './pages/contratacion/contratacion';
import { obtenerEmpleados } from './api/getEmpleados';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/contratacion',
    element: <Contratacion />,
    loader: async () => {
      return{
        empleadosData: obtenerEmpleados()
      }
    },
  },
]);