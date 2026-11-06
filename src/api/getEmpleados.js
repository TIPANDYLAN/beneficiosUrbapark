// src/api/getEmpleados.js

// Mapeo optimizado exclusivamente para el selector inicial (Lista Ligera)
function mapEmpleadoLista(raw) {
  if (!raw) return {};
  return {
    cedula: raw.DOCI_MFEMP || raw.documento || raw.cedula || raw.dni || '',
    nombreCompleto: raw.nombreCompleto || 'Sin nombre'
  };
}

// 1. Carga la lista de nombres instantáneamente al abrir la vista
export async function obtenerEmpleados() {
  const response = await fetch('/api/empleados', {
    method: 'GET',
    headers: {
      // Si usas el header de seguridad, inclúyelo aquí (asegúrate de exponerlo si es necesario en cliente)
      'x-app-secret': process.env.NEXT_PUBLIC_INTERNAL_APP_SECRET || '',
    }
  });

  if (!response.ok) {
    throw new Error(`La consulta de nombres falló con estado ${response.status}`);
  }

  const data = await response.json();
  const listaRaw = Array.isArray(data) ? data : (data?.empleados || []);

  // Retornamos el array mapeado solo con cédula y nombre
  return listaRaw.map(mapEmpleadoLista);
}
